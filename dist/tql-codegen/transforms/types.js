"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = void 0;
const graphql_1 = require("graphql");
const printers_1 = require("../printers");
const utils_1 = require("../utils");
const printVariable = (arg) => {
    return `${arg.name}: ${(0, printers_1.printInputType)(arg.type)} ${arg.type instanceof graphql_1.GraphQLNonNull ? '' : '| undefined'}`;
};
const printField = (field) => {
    const { args } = field;
    const isList = (0, utils_1.listType)(field.type);
    const isNonNull = field.type instanceof graphql_1.GraphQLNonNull;
    const type = (0, utils_1.outputType)(field.type);
    const printVariables = () => {
        return args.length > 0 ? `(variables: { ${args.map(printVariable).join(', ')} })` : '';
    };
    if (type instanceof graphql_1.GraphQLScalarType) {
        return (`${args.length > 0 ? '' : 'readonly'} ${field.name}${printVariables()}: ${isList ? `ReadonlyArray<${(0, utils_1.toPrimitive)(type)}>` : `${(0, utils_1.toPrimitive)(type)}`}` + (isNonNull ? '' : ' | null'));
    }
    else if (type instanceof graphql_1.GraphQLEnumType) {
        return (`${args.length > 0 ? '' : 'readonly'} ${field.name}${printVariables()}: ${isList ? `ReadonlyArray<${type.name}>` : `${type.name}`}` + (isNonNull ? '' : ' | null'));
    }
    else if (type instanceof graphql_1.GraphQLInterfaceType ||
        type instanceof graphql_1.GraphQLUnionType ||
        type instanceof graphql_1.GraphQLObjectType) {
        return (`${args.length > 0 ? '' : 'readonly'} ${field.name}${printVariables()}: ${isList ? `ReadonlyArray<I${type.name}>` : `I${type.name}`}` + (isNonNull ? '' : ' | null'));
    }
    else {
        throw new Error('Unable to print field.');
    }
};
const transform = (ast, schema) => {
    // @note needed to serialize inline enum values correctly at runtime
    const enumValues = new Set();
    return {
        [graphql_1.Kind.DIRECTIVE_DEFINITION]: () => null,
        [graphql_1.Kind.SCALAR_TYPE_DEFINITION]: () => null,
        [graphql_1.Kind.ENUM_TYPE_DEFINITION]: node => {
            var _a, _b;
            const typename = node.name.value;
            const values = (_b = (_a = node.values) === null || _a === void 0 ? void 0 : _a.map(v => v.name.value)) !== null && _b !== void 0 ? _b : [];
            const printMember = (member) => {
                return `${member} = "${member}"`;
            };
            return null;
        },
        [graphql_1.Kind.ENUM_VALUE_DEFINITION]: node => {
            return null;
            // enumValues.add(node.name.value);
            // return null;
        },
        [graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION]: node => {
            return null;
            // const typename = node.name.value;
            // const type = schema.getType(typename);
            // invariant(
            //   type instanceof GraphQLInputObjectType,
            //   `Type "${typename}" was not instance of expected class GraphQLInputObjectType.`,
            // );
            // const fields = Object.values(type.getFields());
            // const printField = (field: GraphQLInputField) => {
            //   const isList = listType(field.type);
            //   const isNonNull = isNonNullType(field.type);
            //   const baseType = inputType(field.type);
            //   let tsType: string;
            //   if (baseType instanceof GraphQLScalarType) {
            //     tsType = toPrimitive(baseType);
            //   } else if (baseType instanceof GraphQLEnumType) {
            //     tsType = baseType.name;
            //   } else if (baseType instanceof GraphQLInputObjectType) {
            //     tsType = 'I' + baseType.name;
            //   } else {
            //     throw new Error('Unable to render inputField!');
            //   }
            //   return [field.name, isNonNull ? ':' : '?:', ' ', tsType, isList ? '[]' : ''].join('');
            // };
            // return code`
            //   export interface I${typename} {
            //     ${fields.map(printField).join('\n')}
            //   }
            // `;
        },
        [graphql_1.Kind.OBJECT_TYPE_DEFINITION]: node => {
            return null;
            // const typename = node.name.value;
            // const type = schema.getType(typename);
            // invariant(
            //   type instanceof GraphQLObjectType,
            //   `Type "${typename}" was not instance of expected class GraphQLObjectType.`,
            // );
            // const fields = Object.values(type.getFields());
            // const interfaces = type.getInterfaces();
            // // @note TypeScript only requires new fields to be defined on interface extendors
            // const interfaceFields = interfaces.flatMap(i => Object.values(i.getFields()).map(field => field.name));
            // const uncommonFields = fields.filter(field => !interfaceFields.includes(field.name));
            // // @todo extend any implemented interfaces
            // // @todo only render fields unique to this type
            // const extensions = interfaces.length > 0 ? `extends ${interfaces.map(i => 'I' + i.name).join(', ')}` : '';
            // return code`
            //   export interface I${typename} ${extensions} {
            //     readonly __typename: ${`"${typename}"`}
            //     ${uncommonFields.map(printField).join('\n')}
            //   }
            // `;
        },
        [graphql_1.Kind.INTERFACE_TYPE_DEFINITION]: node => {
            return null;
            // const typename = node.name.value;
            // const type = schema.getType(typename);
            // invariant(
            //   type instanceof GraphQLInterfaceType,
            //   `Type "${typename}" was not instance of expected class GraphQLInterfaceType.`,
            // );
            // // @note Get all implementors of this union
            // const implementations = schema.getPossibleTypes(type).map(type => type.name);
            // const fields = Object.values(type.getFields());
            // return code`
            //   export interface I${typename} {
            //     readonly __typename: ${implementations.map(type => `"${type}"`).join(' | ')}
            //     ${fields.map(printField).join('\n')}
            //   }
            // `;
        },
        [graphql_1.Kind.UNION_TYPE_DEFINITION]: node => {
            return null;
            // const typename = node.name.value;
            // const type = schema.getType(typename);
            // invariant(
            //   type instanceof GraphQLUnionType,
            //   `Type "${typename}" was not instance of expected class GraphQLUnionType.`,
            // );
            // // @note Get all implementors of this union
            // const implementations = schema.getPossibleTypes(type).map(type => type.name);
            // return code`
            //   export type ${'I' + type.name} = ${implementations.map(type => `I${type}`).join(' | ')}
            // `;
        },
        [graphql_1.Kind.SCHEMA_DEFINITION]: () => {
            return null;
        },
    };
};
exports.transform = transform;
//# sourceMappingURL=types.js.map