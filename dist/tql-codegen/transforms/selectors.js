"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
const graphql_1 = require("graphql");
const ts_poet_1 = require("ts-poet");
const outvariant_1 = require("outvariant");
const printers_1 = require("../printers");
const utils_1 = require("../utils");
// ex. F extends "Human" ? HumanSelector : DroidSelector
const printConditionalSelectorArg = (types) => {
    const [first, ...rest] = types;
    if (rest.length === 0) {
        return `I${first}Selector`;
    }
    else {
        return types
            .map(t => `F extends "${t}" ? I${t}Selector : `)
            .join('')
            .concat(' never');
    }
};
const printArgument = (arg) => {
    const type = (0, utils_1.inputType)(arg.type);
    const typename = type instanceof graphql_1.GraphQLScalarType
        ? (0, utils_1.toPrimitive)(type)
        : type instanceof graphql_1.GraphQLEnumType
            ? type.toString()
            : 'I' + type.toString();
    return `Argument<"${arg.name}", V['${arg.name}']>`;
};
const printVariable = (arg) => {
    return `${arg.name}${arg.type instanceof graphql_1.GraphQLNonNull ? '' : '?'}: Variable<string> | ${(0, printers_1.printInputType)(arg.type)}`;
};
const printMethod = (field) => {
    const { name, args } = field;
    const type = (0, utils_1.outputType)(field.type);
    const comments = [
        field.description && `@description ${field.description}`,
        field.deprecationReason && `@deprecated ${field.deprecationReason}`,
    ].filter(Boolean);
    const jsDocComment = comments.length > 0
        ? `
  /**
   ${comments.map(comment => '* ' + comment).join('\n')}
    */
  `
        : '';
    if (type instanceof graphql_1.GraphQLScalarType || type instanceof graphql_1.GraphQLEnumType) {
        // @todo render arguments correctly
        return args.length > 0
            ? jsDocComment.concat(`${name}: (variables) => field("${name}", Object.entries(variables).map(([k, v]) => argument(k, v)) as any),`)
            : jsDocComment.concat(`${name}: () => field("${name}"),`);
    }
    else {
        const renderArgument = (arg) => {
            return `argument("${arg.name}", variables.${arg.name})`;
        };
        // @todo restrict allowed Field types
        return args.length > 0
            ? `
      ${jsDocComment}
      ${name}:(
        variables,
        select,
      ) => field("${name}", Object.entries(variables).map(([k, v]) => argument(k, v)) as any, selectionSet(select(${type.toString()}Selector))),
    `
            : `
      ${jsDocComment}
      ${name}: (
        select,
      ) => field("${name}", undefined as never, selectionSet(select(${type.toString()}Selector))),
    `;
    }
};
const printSignature = (field) => {
    const { name, args } = field;
    const type = (0, utils_1.outputType)(field.type);
    const comments = [
        field.description && `@description ${field.description}`,
        field.deprecationReason && `@deprecated ${field.deprecationReason}`,
    ].filter(Boolean);
    const jsDocComment = comments.length > 0
        ? `
    /**
     ${comments.map(comment => '* ' + comment).join('\n')}
     */
    `
        : '';
    // @todo define Args type parameter as mapped type OR non-constant (i.e Array<Argument<...> | Argument<...>>)
    if (type instanceof graphql_1.GraphQLScalarType || type instanceof graphql_1.GraphQLEnumType) {
        return args.length > 0
            ? `${jsDocComment}\n readonly ${name}: <V extends { ${args
                .map(printVariable)
                .join(', ')} }>(variables: V) => Field<"${name}", [ ${args.map(printArgument).join(', ')} ]>`
            : `${jsDocComment}\n readonly ${name}: () => Field<"${name}">`;
    }
    else {
        // @todo restrict allowed Field types
        return args.length > 0
            ? `
      ${jsDocComment}
      readonly ${name}: <V extends { ${args.map(printVariable).join(', ')} }, T extends ReadonlyArray<Selection>>(
        variables: V,
        select: (t: I${type.toString()}Selector) => T
      ) => Field<"${name}", [ ${args.map(printArgument).join(', ')} ], SelectionSet<T>>,
    `
            : `
      ${jsDocComment}
      readonly ${name}: <T extends ReadonlyArray<Selection>>(
        select: (t: I${type.toString()}Selector) => T
      ) => Field<"${name}", never, SelectionSet<T>>,
    `;
    }
};
const transform = (ast, schema) => {
    // const Field = imp("Field@timkendall@tql");
    // const Argument = imp("Argument@timkendall@tql");
    // const Variable = imp("Variable@timkendall@tql");
    // const InlineFragment = imp("InlineFragment@timkendall@tql");
    return {
        [graphql_1.Kind.DIRECTIVE_DEFINITION]: () => null,
        [graphql_1.Kind.SCALAR_TYPE_DEFINITION]: () => null,
        [graphql_1.Kind.ENUM_TYPE_DEFINITION]: () => null,
        [graphql_1.Kind.ENUM_VALUE_DEFINITION]: () => null,
        [graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION]: () => null,
        [graphql_1.Kind.OBJECT_TYPE_DEFINITION]: node => {
            const typename = node.name.value;
            const type = schema.getType(typename);
            (0, outvariant_1.invariant)(type instanceof graphql_1.GraphQLObjectType, `Type "${typename}" was not instance of expected class GraphQLObjectType.`);
            const fields = Object.values(type.getFields());
            return (0, ts_poet_1.code) `
        ${ /* selector interface */''}
        interface I${type.name}Selector {
          readonly __typename: () => Field<"__typename">
          ${fields.map(printSignature).join('\n')}
        }

        ${ /* selector object */''}
        const ${typename}Selector: I${typename}Selector = {
          __typename: () => field("__typename"),
          ${fields.map(printMethod).join('\n')}
        }

        ${ /* select fn */''}
        export const ${(0, utils_1.toLower)(typename)} = <T extends ReadonlyArray<Selection>>(select: (t: I${typename}Selector) => T) => new SelectionBuilder<ISchema, "${type}", T>(SCHEMA as any, "${typename}", select(${typename}Selector))
      `;
        },
        [graphql_1.Kind.INTERFACE_TYPE_DEFINITION]: node => {
            const typename = node.name.value;
            const type = schema.getType(typename);
            (0, outvariant_1.invariant)(type instanceof graphql_1.GraphQLInterfaceType, `Type "${typename}" was not instance of expected class GraphQLInterfaceType.`);
            // @note Get all implementors of this union
            const implementations = schema.getPossibleTypes(type).map(type => type.name);
            const fields = Object.values(type.getFields());
            return (0, ts_poet_1.code) `
        ${ /* selector interface */''}
        interface I${type.name}Selector {
          readonly __typename: () => Field<"__typename">
          
          ${fields.map(printSignature).join('\n')}

          readonly on: <T extends ReadonlyArray<Selection>, F extends ${implementations
                .map(name => `"${name}"`)
                .join(' | ')}>(
            type: F,
            select: (t: ${printConditionalSelectorArg(implementations.map(name => name))}) => T
          ) => InlineFragment<NamedType<F>, SelectionSet<T>>
        }

        ${ /* selector object */''}
        const ${typename}Selector: I${typename}Selector = {
          __typename: () => field("__typename"),
          
          ${fields.map(printMethod).join('\n')}

          on: (
            type,
            select,
          ) => {
            switch(type) {
              ${implementations
                .map(name => `
                case "${name}": {
                  return inlineFragment(
                    namedType("${name}"),
                    selectionSet(select(${name}Selector as Parameters<typeof select>[0])),
                  )
                }
              `)
                .join('\n')}
              default:
                throw new TypeConditionError({ 
                  selectedType: type, 
                  abstractType: "${type.name}",
                })
            }
          },
        }

        ${ /* select fn */''}
        export const ${(0, utils_1.toLower)(typename)} = <T extends ReadonlyArray<Selection>>(select: (t: I${typename}Selector) => T) => new SelectionBuilder<ISchema, "${type}", T>(SCHEMA as any, "${typename}", select(${typename}Selector))
      `;
        },
        [graphql_1.Kind.UNION_TYPE_DEFINITION]: node => {
            const typename = node.name.value;
            const type = schema.getType(typename);
            (0, outvariant_1.invariant)(type instanceof graphql_1.GraphQLUnionType, `Type "${typename}" was not instance of expected class GraphQLUnionType.`);
            // @note Get all implementors of this union
            const implementations = schema.getPossibleTypes(type).map(type => type.name);
            return (0, ts_poet_1.code) `
        ${ /* selector interface */''}
        interface I${type.name}Selector {
          readonly __typename: () => Field<"__typename">

          readonly on: <T extends ReadonlyArray<Selection>, F extends ${implementations
                .map(name => `"${name}"`)
                .join(' | ')}>(
            type: F,
            select: (t: ${printConditionalSelectorArg(implementations.map(name => name))}) => T
          ) => InlineFragment<NamedType<F>, SelectionSet<T>>
        }

        ${ /* selector object */''}
        const ${typename}Selector: I${typename}Selector = {
          __typename: () => field("__typename"),
          
          on: (
            type,
            select,
          ) => {
            switch(type) {
              ${implementations
                .map(name => `
                case "${name}": {
                  return inlineFragment(
                    namedType("${name}"),
                    selectionSet(select(${name}Selector as Parameters<typeof select>[0])),
                  )
                }
              `)
                .join('\n')}
              default:
                throw new TypeConditionError({ 
                  selectedType: type, 
                  abstractType: "${type.name}",
                })
            }
          },
        }

        ${ /* select fn */''}
        export const ${(0, utils_1.toLower)(typename)} = <T extends ReadonlyArray<Selection>>(select: (t: I${typename}Selector) => T) => new SelectionBuilder<ISchema, "${type}", T>(SCHEMA as any, "${typename}", select(${typename}Selector))
      `;
        },
        [graphql_1.Kind.SCHEMA_DEFINITION]: node => {
            return null;
        },
    };
};
exports.transform = transform;
//# sourceMappingURL=selectors.js.map