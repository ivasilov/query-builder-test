"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryFunction = void 0;
exports.buildQueryFunction = {
    ts: `
const buildQuery = (type: string, a?: Record<any, any>) => 
  traverseToSeekArrays([type], a);
`,
};
//# sourceMappingURL=buildQuery.js.map