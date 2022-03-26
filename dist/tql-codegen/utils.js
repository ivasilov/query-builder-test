"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printType = exports.toPrimitive = exports.listType = exports.outputType = exports.inputType = exports.toLower = exports.toUpper = void 0;
const graphql_1 = require("graphql");
function toUpper(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
exports.toUpper = toUpper;
function toLower(word) {
    return word.charAt(0).toLowerCase() + word.slice(1);
}
exports.toLower = toLower;
function inputType(type) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        return inputType(type.ofType);
    }
    else if (type instanceof graphql_1.GraphQLList) {
        return inputType(type.ofType);
    }
    else {
        return type;
    }
}
exports.inputType = inputType;
function outputType(type) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        return outputType(type.ofType);
    }
    else if (type instanceof graphql_1.GraphQLList) {
        return outputType(type.ofType);
    }
    else {
        return type;
    }
}
exports.outputType = outputType;
function listType(type) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        return listType(type.ofType);
    }
    else if (type instanceof graphql_1.GraphQLList) {
        return true;
    }
    else {
        return false;
    }
}
exports.listType = listType;
const toPrimitive = (scalar) => {
    switch (scalar.name) {
        case 'ID':
        case 'String':
            return 'string';
        case 'Boolean':
            return 'boolean';
        case 'Int':
        case 'Float':
            return 'number';
        default:
            return 'string';
    }
};
exports.toPrimitive = toPrimitive;
const printType = (type) => {
    if (type instanceof graphql_1.GraphQLScalarType) {
        return `${type.name}: ${(0, exports.toPrimitive)(type)}`;
    }
    else if (type instanceof graphql_1.GraphQLEnumType) {
        return `${type.name}: ${type.name}`;
    }
    else {
        return `${type.name}: ${type.name}`;
    }
};
exports.printType = printType;
//# sourceMappingURL=utils.js.map