"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveValueTypes = exports.VALUETYPES = void 0;
const Models_1 = require("../../Models");
const truthy_1 = require("./truthy");
exports.VALUETYPES = 'ValueTypes';
const resolveValueType = (t) => `${exports.VALUETYPES}["${t}"]`;
const typeScriptMap = {
    Int: 'number',
    Float: 'number',
    Boolean: 'boolean',
    ID: 'string',
    String: 'string',
};
const toTypeScriptPrimitive = (a) => typeScriptMap[a] || a;
const plusDescription = (description, prefix = '') => description ? `${prefix}/** ${description} */\n` : '';
const resolveArg = (f) => {
    const { type: { options }, } = f;
    const isArray = !!(options && options.find(o => o === Models_1.Options.array));
    const isArrayRequired = !!(options && options.find(o => o === Models_1.Options.arrayRequired));
    const isRequired = !!(options && options.find(o => o === Models_1.Options.required));
    const isRequiredName = (name) => {
        if ((isArray && isArrayRequired) || (isRequired && !isArray)) {
            return name;
        }
        return `${name}?`;
    };
    const concatArray = (name) => {
        if (isArray) {
            if (!isRequired) {
                return `(${name} | undefined | null)[]`;
            }
            return `${name}[]`;
        }
        if (!isRequired) {
            return `${name} | null`;
        }
        return name;
    };
    const resolveArgsName = (name) => {
        return isRequiredName(name) + ':';
    };
    return `${plusDescription(f.description, '\t')}\t${resolveArgsName(f.name)}${concatArray(f.type.name in typeScriptMap ? toTypeScriptPrimitive(f.type.name) : resolveValueType(f.type.name))}`;
};
const resolveField = (f, enumsAndScalars) => {
    const { args } = f;
    const resolvedTypeName = f.type.name in typeScriptMap || enumsAndScalars.includes(f.type.name) ? truthy_1.truthyType : resolveValueType(f.type.name);
    if (args && args.length) {
        return `${f.name}?: [{${args.map(resolveArg).join(',')}},${resolvedTypeName}]`;
    }
    return `${plusDescription(f.description, '\t')}\t${`${f.name}?` + ':'}${resolvedTypeName}`;
};
const AliasType = (code) => `AliasType<${code}>`;
const resolveValueTypeFromRoot = (i, rootNodes, enumsAndScalars) => {
    if (i.data.type === Models_1.TypeSystemDefinition.DirectiveDefinition) {
        return '';
    }
    if (i.data.type === Models_1.Helpers.Comment) {
        return '';
    }
    if (!i.args || !i.args.length) {
        return `${plusDescription(i.description)}["${i.name}"]:unknown`;
    }
    if (i.data.type === Models_1.TypeDefinition.UnionTypeDefinition) {
        return `${plusDescription(i.description)}["${i.name}"]: ${AliasType(`{${i.args
            .map(f => `\t\t["...on ${f.type.name}"] : ${resolveValueType(f.type.name)}`)
            .join(',\n')}\n\t\t__typename?: ${truthy_1.truthyType}\n}`)}`;
    }
    if (i.data.type === Models_1.TypeDefinition.EnumTypeDefinition) {
        return `${plusDescription(i.description)}["${i.name}"]:${i.name}`;
    }
    if (i.data.type === Models_1.TypeDefinition.InputObjectTypeDefinition) {
        return `${plusDescription(i.description)}["${i.name}"]: {\n${i.args.map(f => resolveArg(f)).join(',\n')}\n}`;
    }
    if (i.data.type === Models_1.TypeDefinition.InterfaceTypeDefinition) {
        const typesImplementing = rootNodes.filter(rn => rn.interfaces && rn.interfaces.includes(i.name));
        return `${plusDescription(i.description)}["${i.name}"]:${AliasType(`{
\t${i.args.map(f => resolveField(f, enumsAndScalars)).join(',\n')};\n\t\t${typesImplementing
            .map(f => `['...on ${f.name}']?: Omit<${resolveValueType(f.name)},keyof ${resolveValueType(i.name)}>;`)
            .join('\n\t\t')}\n\t\t__typename?: ${truthy_1.truthyType}\n}`)}`;
    }
    return `${plusDescription(i.description)}["${i.name}"]: ${AliasType(`{\n${i.args.map(f => resolveField(f, enumsAndScalars)).join(',\n')},\n\t\t__typename?: ${truthy_1.truthyType}\n}`)}`;
};
const resolveValueTypes = (rootNodes) => {
    const enumsAndScalars = rootNodes
        .filter(n => { var _a, _b; return ((_a = n.data) === null || _a === void 0 ? void 0 : _a.type) === Models_1.TypeDefinition.EnumTypeDefinition || ((_b = n.data) === null || _b === void 0 ? void 0 : _b.type) === Models_1.TypeDefinition.ScalarTypeDefinition; })
        .map(n => n.name);
    return `type ${exports.VALUETYPES} = {
    ${rootNodes
        .map(f => resolveValueTypeFromRoot(f, rootNodes, enumsAndScalars))
        .filter(v => v)
        .join(';\n\t')}
  }`;
};
exports.resolveValueTypes = resolveValueTypes;
//# sourceMappingURL=resolveValueTypes.js.map