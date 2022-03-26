"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typescriptFunctions = void 0;
const functions_1 = require("../../functions");
const typescriptFunctions = () => `
${functions_1.ZeusSelectFunction.ts}
${functions_1.ScalarResolverFunction.ts}
${functions_1.TypePropsResolverFunction.ts}
${functions_1.isArrayFunctionFunction.ts}
${functions_1.resolveKVFunction.ts}
${functions_1.objectToTreeFunction.ts}
${functions_1.traverseToSeekArraysFunction.ts}
${functions_1.buildQueryFunction.ts}
${functions_1.inspectVariablesFunction.ts}
${functions_1.queryConstructFunction.ts}  
${functions_1.seekForAliasesFunction.ts}
${functions_1.VariableFunction.ts}
`;
exports.typescriptFunctions = typescriptFunctions;
//# sourceMappingURL=functions.js.map