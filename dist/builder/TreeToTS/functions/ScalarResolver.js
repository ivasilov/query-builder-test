"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalarResolverFunction = void 0;
exports.ScalarResolverFunction = {
    ts: `
const ScalarResolver = (scalar: string, value: any) => {
  switch (scalar) {
    case 'String':
      return  \`\${JSON.stringify(value)}\`;
    case 'Int':
      return \`\${value}\`;
    case 'Float':
      return \`\${value}\`;
    case 'Boolean':
      return \`\${value}\`;
    case 'ID':
      return \`"\${value}"\`;
    case 'enum':
      return \`\${value}\`;
    case 'scalar':
      return \`\${value}\`;
    default:
      return false;
  }
};
`,
};
//# sourceMappingURL=ScalarResolver.js.map