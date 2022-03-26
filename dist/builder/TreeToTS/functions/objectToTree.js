"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToTreeFunction = void 0;
exports.objectToTreeFunction = {
    ts: `
const objectToTree = (o: { [x: string]: boolean | string }): string =>
  \`{\${Object.keys(o).map((k) => \`\${resolveKV(k, o[k])}\`).join(' ')}}\`;
`,
};
//# sourceMappingURL=objectToTree.js.map