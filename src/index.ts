import { GraphQLSchema, printIntrospectionSchema, printSchema, buildASTSchema } from 'graphql';
import { PluginFunction, getCachedDocumentNodeFromSchema } from '@graphql-codegen/plugin-helpers';
import { Parser } from 'graphql-js-tree';
import { RawClientSideBasePluginConfig } from '@graphql-codegen/visitor-plugin-common';
import { parse, buildSchema, visit } from 'graphql';
import type { Code } from 'ts-poet';
import prettier from 'prettier';

import { typeTransform, selectorInterfaceTransform } from './tql-codegen/transforms';
import { printType } from './tql-codegen/utils';

export const render = (sdl: string): string => {
  const ast = parse(sdl, { noLocation: true });
  const schema = buildSchema(sdl);

  const transforms = [typeTransform(ast, schema), selectorInterfaceTransform(ast, schema)];

  // additive transforms
  const results: ReadonlyArray<{ definitions: Code[] }> = transforms.map(visitor => visit(ast, visitor));

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
      ${types.map(printType).join('\n')}
    }
  `;

  const source = [
    `export const SCHEMA = buildASTSchema(${JSON.stringify(ast)})`,
    // `export const ENUMS = ${ENUMS}`,
    typeMap,
    results.flatMap(result => result.definitions.map(code => code.toCodeString())).join('\n'),
    `export type ExtractFragment<T extends InlineFragment<any, any>> = SpreadFragment<ISchema, T, SelectionSet<[]>>;`,
  ].join('\n');

  return prettier.format(source, { parser: 'typescript' });
};

export const plugin: PluginFunction<RawClientSideBasePluginConfig> = (schema: GraphQLSchema, _documents, _config) => {
  const transformedSchemaAndAst = transformSchemaAST(schema);
  const schemaFileContents = [
    printIntrospectionSchema(transformedSchemaAndAst.schema),
    printSchema(transformedSchemaAndAst.schema),
  ]
    .filter(Boolean)
    .join('\n');

  return {
    prepend: [
      `import { buildASTSchema } from 'graphql';`,
      `import { TypeConditionError, NamedType, Field, InlineFragment, Argument, Variable, Selection, SelectionSet, SelectionBuilder, namedType, field, inlineFragment, argument, selectionSet, SpreadFragment } from '@timkendall/tql';`,
      `export { type Result, type Variables, $ } from '@timkendall/tql';`,
    ],
    content: render(printSchema(transformedSchemaAndAst.schema)),
  };
};

function transformSchemaAST(schema: GraphQLSchema) {
  let ast = getCachedDocumentNodeFromSchema(schema);
  schema = buildASTSchema(ast);

  return {
    schema,
    ast,
  };
}
