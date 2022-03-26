"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTypes = exports.resolveInterfaces = exports.resolveUnions = void 0;
const Models_1 = require("../../Models");
const TYPES = 'GraphQLTypes';
const typeScriptMap = {
    Int: 'number',
    Float: 'number',
    Boolean: 'boolean',
    ID: 'string',
    String: 'string',
};
const toTypeScriptPrimitive = (a) => typeScriptMap[a] || `${TYPES}["${a}"]`;
const plusDescription = (description, prefix = '') => description ? `${prefix}/** ${description} */\n` : '';
const resolveField = (f) => {
    const { type: { options }, } = f;
    const isArray = !!(options && options.find(o => o === Models_1.Options.array));
    const isArrayRequired = !!(options && options.find(o => o === Models_1.Options.arrayRequired));
    const isRequired = !!(options && options.find(o => o === Models_1.Options.required));
    const isNullType = (type) => {
        if (isArray && isRequired && isArrayRequired) {
            return `: Array<${type}>`;
        }
        if (isArray && isRequired && !isArrayRequired) {
            return `?: Array<${type}>`;
        }
        if (isArray && !isRequired && isArrayRequired) {
            return `: Array<${type} | undefined>`;
        }
        if (isArray && !isRequired && !isArrayRequired) {
            return `?: Array<${type} | undefined>`;
        }
        if (isRequired) {
            return `: ${type}`;
        }
        return `?: ${type}`;
    };
    return `${plusDescription(f.description, '\t')}\t${f.name}${isNullType(toTypeScriptPrimitive(f.type.name))}`;
};
const resolveUnions = (rootNodes) => {
    const unionTypes = rootNodes
        .filter(rn => rn.data.type === Models_1.TypeDefinition.UnionTypeDefinition)
        .map(rn => `${TYPES}["${rn.name}"]`)
        .join(' | ');
    return `type ZEUS_UNIONS = ${unionTypes || 'never'}`;
};
exports.resolveUnions = resolveUnions;
const resolveInterfaces = (rootNodes) => {
    const interfaceTypes = rootNodes
        .filter(rn => rn.data.type === Models_1.TypeDefinition.InterfaceTypeDefinition)
        .map(rn => `${TYPES}["${rn.name}"]`)
        .join(' | ');
    return `type ZEUS_INTERFACES = ${interfaceTypes || 'never'}`;
};
exports.resolveInterfaces = resolveInterfaces;
const resolveEnum = (i) => {
    if (!i.args) {
        throw new Error('Empty enum error');
    }
    return `${plusDescription(i.description)}const enum ${i.name} {\n${i.args
        .map(f => `\t${f.name} = "${f.name}"`)
        .join(',\n')}\n}`;
};
const resolveTypeFromRoot = (i, rootNodes) => {
    if (i.data.type === Models_1.TypeSystemDefinition.DirectiveDefinition) {
        return '';
    }
    if (i.data.type === Models_1.Helpers.Comment) {
        return `// ${i.description}`;
    }
    if (!i.args || !i.args.length) {
        return `${plusDescription(i.description)}["${i.name}"]:any`;
    }
    if (i.data.type === Models_1.TypeDefinition.UnionTypeDefinition) {
        return `${plusDescription(i.description)}["${i.name}"]:{
\t__typename:${i.args.length ? i.args.map(ti => `"${ti.name}"`).join(' | ') : 'never'}
\t${i.args.map(f => `['...on ${f.type.name}']: '__union' & ${TYPES}["${f.type.name}"];`).join('\n\t')}\n}`;
    }
    if (i.data.type === Models_1.TypeDefinition.EnumTypeDefinition) {
        return `${plusDescription(i.description)}["${i.name}"]: ${i.name}`;
    }
    if (i.data.type === Models_1.TypeDefinition.InputObjectTypeDefinition) {
        return `${plusDescription(i.description)}["${i.name}"]: {\n\t${i.args.map(f => resolveField(f)).join(',\n')}\n}`;
    }
    if (i.data.type === Models_1.TypeDefinition.InterfaceTypeDefinition) {
        const typesImplementing = rootNodes.filter(rn => rn.interfaces && rn.interfaces.includes(i.name));
        return `${plusDescription(i.description)}["${i.name}"]: {
\t__typename:${typesImplementing.length === 0 ? 'never' : typesImplementing.map(ti => `"${ti.name}"`).join(' | ')},
${i.args.map(f => resolveField(f)).join(',\n')}
\t${typesImplementing.map(f => `['...on ${f.name}']: '__union' & ${TYPES}["${f.name}"];`).join('\n\t')}\n}`;
    }
    return `${plusDescription(i.description)}["${i.name}"]: {\n\t__typename: "${i.name}",\n${i.args
        .map(f => resolveField(f))
        .join(',\n')}\n}`;
};
const resolveTypes = (rootNodes) => {
    return `type ${TYPES} = {
    ${rootNodes
        .map(f => resolveTypeFromRoot(f, rootNodes))
        .filter(v => v)
        .join(';\n\t')}
    }`
        .concat('\n')
        .concat(rootNodes
        .filter(rn => rn.data.type === Models_1.TypeDefinition.EnumTypeDefinition)
        .filter(rn => rn.name === '__TypeKind' || rn.name === '__DirectiveLocation')
        .map(resolveEnum)
        .join('\n'));
};
exports.resolveTypes = resolveTypes;
//# sourceMappingURL=returnedTypes.js.map