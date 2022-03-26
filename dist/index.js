"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = exports.render = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const plugin_helpers_1 = require("@graphql-codegen/plugin-helpers");
const graphql_2 = require("graphql");
const prettier_1 = (0, tslib_1.__importDefault)(require("prettier"));
const transforms_1 = require("./tql-codegen/transforms");
const utils_1 = require("./tql-codegen/utils");
const render = (sdl) => {
    const ast = (0, graphql_2.parse)(sdl, { noLocation: true });
    const schema = (0, graphql_2.buildSchema)(sdl);
    const transforms = [(0, transforms_1.typeTransform)(ast, schema), (0, transforms_1.selectorInterfaceTransform)(ast, schema)];
    // additive transforms
    const results = transforms.map(visitor => (0, graphql_2.visit)(ast, visitor));
    const types = Object.values(schema.getTypeMap()).filter(type => !type.name.startsWith('__'));
    // const enumValues = new Set(
    //   Object.values(schema.getTypeMap())
    //     .filter(type => type instanceof GraphQLEnumType)
    //     .flatMap(type => (type as GraphQLEnumType).getValues().map(value => value.value)),
    // );
    // const ENUMS = `
    //   Object.freeze({
    //     ${Array.from(enumValues)
    //       .map(value => `${value}: true`)
    //       .join(',\n')}
    //   } as const)
    // `;
    const typeMap = `
    export interface ISchema {
      ${types.map(utils_1.printType).join('\n')}
    }
  `;
    const source = [
        `export const SCHEMA = buildASTSchema(${JSON.stringify(ast)})`,
        // `export const ENUMS = ${ENUMS}`,
        typeMap,
        results.flatMap(result => result.definitions.map(code => code.toCodeString())).join('\n'),
        `export type ExtractFragment<T extends InlineFragment<any, any>> = SpreadFragment<ISchema, T, SelectionSet<[]>>;`,
    ].join('\n');
    return prettier_1.default.format(source, { parser: 'typescript' });
};
exports.render = render;
const plugin = (schema, _documents, _config) => {
    const transformedSchemaAndAst = transformSchemaAST(schema);
    const schemaFileContents = [
        (0, graphql_1.printIntrospectionSchema)(transformedSchemaAndAst.schema),
        (0, graphql_1.printSchema)(transformedSchemaAndAst.schema),
    ]
        .filter(Boolean)
        .join('\n');
    return {
        prepend: [
            `import { buildASTSchema } from 'graphql';`,
            `import { TypeConditionError, NamedType, Field, InlineFragment, Argument, Variable, Selection, SelectionSet, SelectionBuilder, namedType, field, inlineFragment, argument, selectionSet, SpreadFragment } from '@timkendall/tql';`,
            `export { type Result, type Variables, $ } from '@timkendall/tql';`,
        ],
        content: (0, exports.render)((0, graphql_1.printSchema)(transformedSchemaAndAst.schema)),
    };
};
exports.plugin = plugin;
function transformSchemaAST(schema) {
    let ast = (0, plugin_helpers_1.getCachedDocumentNodeFromSchema)(schema);
    schema = (0, graphql_1.buildASTSchema)(ast);
    return {
        schema,
        ast,
    };
}
//# sourceMappingURL=index.js.map