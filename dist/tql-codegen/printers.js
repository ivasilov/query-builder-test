"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printInputType = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("./utils");
const printInputType = (type) => {
    const isList = (0, utils_1.listType)(type);
    const base = (0, utils_1.inputType)(type);
    return ((() => {
        if (base instanceof graphql_1.GraphQLScalarType) {
            return (0, utils_1.toPrimitive)(base);
        }
        else if (base instanceof graphql_1.GraphQLEnumType) {
            return base.name;
        }
        else if (base instanceof graphql_1.GraphQLInputObjectType) {
            return base.name;
        }
        else {
            throw new Error('Unable to render inputType.');
        }
    })() + (isList ? '[]' : ''));
};
exports.printInputType = printInputType;
//# sourceMappingURL=printers.js.map