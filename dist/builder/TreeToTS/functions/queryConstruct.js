"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryConstructFunction = void 0;
exports.queryConstructFunction = {
    ts: `
const queryConstruct = (t: 'query' | 'mutation' | 'subscription', tName: string, operationName?: string) => (o: Record<any, any>) =>
  \`\${t.toLowerCase()}\${operationName ? ' ' + operationName : ''}\${inspectVariables(buildQuery(tName, o))}\`;
`,
};
//# sourceMappingURL=queryConstruct.js.map