"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTree = void 0;
const Models_1 = require("../Models");
const resolveValueTypes_1 = require("./templates/resolveValueTypes");
const returnedPropTypes_1 = require("./templates/returnedPropTypes");
const returnedReturns_1 = require("./templates/returnedReturns");
const returnedTypes_1 = require("./templates/returnedTypes");
const typescript_1 = require("./templates/typescript");
/**
 * Class Responsible for generating typescript code
 */
const findOperations = (nodes, ot) => {
    const node = nodes.filter(n => n.type.operations && n.type.operations.find(o => o === ot))[0];
    if (node === undefined) {
        return { operationName: undefined, operations: [] };
    }
    const args = node.args ? node.args : [];
    const operations = args.map((f) => f.name);
    return { operationName: { name: node.name, type: 'operation' }, operations };
};
const resolveOperations = (tree) => {
    const nodes = tree.nodes;
    return {
        query: findOperations(nodes, Models_1.OperationType.query),
        mutation: findOperations(nodes, Models_1.OperationType.mutation),
        subscription: findOperations(nodes, Models_1.OperationType.subscription),
    };
};
const resolveBasisCode = (tree) => {
    const propTypes = `const AllTypesProps: Record<string,any> = {\n${tree.nodes
        .map(returnedPropTypes_1.resolvePropTypeFromRoot)
        .filter(pt => pt)
        .join(',\n')}\n}`;
    const returnTypes = `const ReturnTypes: Record<string,any> = {\n${tree.nodes
        .map(f => (0, returnedReturns_1.resolveReturnFromRoot)(f, f.data.type === Models_1.TypeDefinition.InterfaceTypeDefinition
        ? tree.nodes.filter(n => { var _a; return (_a = n.interfaces) === null || _a === void 0 ? void 0 : _a.includes(f.name); }).map(n => n.name)
        : undefined))
        .filter(pt => pt)
        .join(',\n')}\n}`;
    return propTypes.concat('\n\n').concat(returnTypes);
};
const resolveTree = ({ tree }) => {
    const operations = (0, typescript_1.bodyTypeScript)(resolveOperations(tree));
    return [
        resolveBasisCode(tree),
        (0, returnedTypes_1.resolveInterfaces)(tree.nodes),
        (0, returnedTypes_1.resolveUnions)(tree.nodes),
        (0, resolveValueTypes_1.resolveValueTypes)(tree.nodes),
        (0, returnedTypes_1.resolveTypes)(tree.nodes),
        typescript_1.constantTypesTypescript,
        (0, typescript_1.typescriptFunctions)(),
        operations,
    ].join('\n');
};
exports.resolveTree = resolveTree;
//# sourceMappingURL=index.js.map