"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveReturnFromRoot = void 0;
const Models_1 = require("../../Models");
const resolveField = (f) => {
    const { type, name } = f;
    return `\t\t${name}:"${type.name}"`;
};
const resolveReturnFromRoot = (i, usages) => {
    if (i.data.type !== Models_1.TypeDefinition.ObjectTypeDefinition &&
        i.data.type !== Models_1.TypeDefinition.UnionTypeDefinition &&
        i.data.type !== Models_1.TypeDefinition.InterfaceTypeDefinition &&
        i.data.type !== Models_1.TypeSystemDefinition.DirectiveDefinition) {
        return '';
    }
    if (!i.args) {
        return '';
    }
    if (i.data.type === Models_1.TypeDefinition.UnionTypeDefinition) {
        return `\t${i.name}:{\n${i.args
            .map(f => resolveField(Object.assign(Object.assign({}, f), { name: `"...on ${f.name}"` })))
            .join(',\n')}\n\t}`;
    }
    if (i.data.type === Models_1.TypeDefinition.InterfaceTypeDefinition && usages) {
        const usagesStrings = usages.length > 0 ? `${usages.map(u => `\t\t"...on ${u}": "${u}"`).join(',\n')},\n` : ``;
        return `\t${i.name}:{\n${usagesStrings}${i.args.map(f => resolveField(f)).join(',\n')}\n\t}`;
    }
    return `\t${i.name}:{\n${i.args.map(f => resolveField(f)).join(',\n')}\n\t}`;
};
exports.resolveReturnFromRoot = resolveReturnFromRoot;
//# sourceMappingURL=returnedReturns.js.map