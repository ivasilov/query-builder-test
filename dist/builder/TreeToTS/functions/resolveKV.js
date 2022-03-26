"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveKVFunction = void 0;
exports.resolveKVFunction = {
    ts: `
const resolveKV = (k: string, v: boolean | string | { [x: string]: boolean | string }) =>
  typeof v === 'boolean' ? k : typeof v === 'object' ? \`\${k}{\${objectToTree(v)}}\` : \`\${k}\${v}\`;
`,
};
//# sourceMappingURL=resolveKV.js.map