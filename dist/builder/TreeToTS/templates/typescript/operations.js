"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyTypeScript = void 0;
const resolveValueTypes_1 = require("../resolveValueTypes");
const generateOperationsChaining = ({ query, mutation, subscription }) => {
    var _a, _b, _c;
    const allOps = {
        query: ((_a = query === null || query === void 0 ? void 0 : query.operationName) === null || _a === void 0 ? void 0 : _a.name) && query.operations.length ? query.operationName.name : undefined,
        mutation: ((_b = mutation === null || mutation === void 0 ? void 0 : mutation.operationName) === null || _b === void 0 ? void 0 : _b.name) && mutation.operations.length ? mutation.operationName.name : undefined,
        subscription: ((_c = subscription === null || subscription === void 0 ? void 0 : subscription.operationName) === null || _c === void 0 ? void 0 : _c.name) && subscription.operations.length ? subscription.operationName.name : undefined,
    };
    return `
const allOperations = ${JSON.stringify(allOps, null, 4)}

type GenericOperation<O> = O extends 'query'
  ? ${allOps.query ? `"${allOps.query}"` : 'never'}
  : O extends 'mutation'
  ? ${allOps.mutation ? `"${allOps.mutation}"` : 'never'}
  : ${allOps.subscription ? `"${allOps.subscription}"` : 'never'}
`;
};
const generateOperationsZeusTypeScript = ({ query, mutation, subscription }) => {
    var _a, _b, _c;
    const orOpsType = [
        ((_a = query === null || query === void 0 ? void 0 : query.operationName) === null || _a === void 0 ? void 0 : _a.name) ? `'query'` : undefined,
        ((_b = mutation === null || mutation === void 0 ? void 0 : mutation.operationName) === null || _b === void 0 ? void 0 : _b.name) ? `'mutation'` : undefined,
        ((_c = subscription === null || subscription === void 0 ? void 0 : subscription.operationName) === null || _c === void 0 ? void 0 : _c.name) ? `'subscription'` : undefined,
    ]
        .filter(o => !!o)
        .join(' | ');
    return `const Zeus = <
  Z extends ${resolveValueTypes_1.VALUETYPES}[R],
  O extends ${orOpsType},
  R extends keyof ValueTypes = GenericOperation<O>
>(
  operation: O,
  o: Z | ${resolveValueTypes_1.VALUETYPES}[R],
  operationName?: string,
) => queryConstruct(operation, allOperations[operation], operationName)(o as any);`;
};
const generateSelectorsZeusTypeScript = () => {
    return `const Selector = <T extends keyof ${resolveValueTypes_1.VALUETYPES}>(_key: T) => ZeusSelect<${resolveValueTypes_1.VALUETYPES}[T]>();`;
};
const generateConstructFunctions = () => {
    return `
export const constructQuery = <T extends ValueTypes['Query']>(q: T) => {
  const gqlString = Zeus('query', q);
  const selector = Selector('Query')(q);
  type InferredResponseType = InputType<GraphQLTypes['Query'], typeof selector>;
  return gql(gqlString) as TypedDocumentNode<InferredResponseType, {}>;
};

export const constructMutation = <T extends ValueTypes['Mutation']>(q: T) => {
  const gqlString = Zeus('mutation', q);
  const selector = Selector('Mutation')(q);
  type InferredResponseType = InputType<GraphQLTypes['Mutation'], typeof selector>;
  return gql(gqlString) as TypedDocumentNode<InferredResponseType, {}>;
};`;
};
const bodyTypeScript = (resolvedOperations) => `
${generateOperationsChaining(resolvedOperations)}
${generateOperationsZeusTypeScript(resolvedOperations)}
${generateSelectorsZeusTypeScript()}
${generateConstructFunctions()}
  `;
exports.bodyTypeScript = bodyTypeScript;
//# sourceMappingURL=operations.js.map