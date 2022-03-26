"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const prettier_1 = (0, tslib_1.__importDefault)(require("prettier"));
const transforms_1 = require("./transforms");
const utils_1 = require("./utils");
const render = (sdl) => {
    const ast = (0, graphql_1.parse)(sdl, { noLocation: true });
    const schema = (0, graphql_1.buildSchema)(sdl);
    const transforms = [
        (0, transforms_1.typeTransform)(ast, schema),
        (0, transforms_1.selectorInterfaceTransform)(ast, schema),
    ];
    // additive transforms
    const results = transforms.map((vistor) => (0, graphql_1.visit)(ast, vistor));
    const types = Object.values(schema.getTypeMap()).filter((type) => !type.name.startsWith("__"));
    const enumValues = new Set(Object.values(schema.getTypeMap())
        .filter((type) => type instanceof graphql_1.GraphQLEnumType)
        .flatMap((type) => type.getValues().map((value) => value.value)));
    const ENUMS = `
    Object.freeze({
      ${Array.from(enumValues)
        .map((value) => `${value}: true`)
        .join(",\n")}
    } as const)
  `;
    const typeMap = `
    export interface ISchema {
      ${types.map(utils_1.printType).join("\n")}
    }
  `;
    const source = `
    import { buildASTSchema } from 'graphql'

    import { 
      TypeConditionError,
      NamedType,
      Field,
      InlineFragment,
      Argument, 
      Variable, 
      Selection, 
      SelectionSet, 
      SelectionBuilder, 
      namedType,
      field,
      inlineFragment,
      argument, 
      selectionSet
     } from '@timkendall/tql'
     
     export { Result, Variables, $ } from '@timkendall/tql'
     
     ` +
        `
    export const SCHEMA = buildASTSchema(${JSON.stringify(ast)})
    
    export const ENUMS = ${ENUMS}

    ${typeMap}
  ` +
        results
            .flatMap((result) => result.definitions.map((code) => code.toCodeString()))
            .join("\n");
    return prettier_1.default.format(source, { parser: "typescript" });
};
exports.render = render;
//# sourceMappingURL=render.js.map