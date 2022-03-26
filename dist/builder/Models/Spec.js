"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = exports.Instances = exports.OperationType = exports.TypeExtension = exports.ValueDefinition = exports.TypeDefinition = exports.TypeSystemDefinition = exports.Type = exports.Value = exports.Directive = exports.ScalarTypes = void 0;
var ScalarTypes;
(function (ScalarTypes) {
    ScalarTypes["Boolean"] = "Boolean";
    ScalarTypes["Float"] = "Float";
    ScalarTypes["ID"] = "ID";
    ScalarTypes["Int"] = "Int";
    ScalarTypes["String"] = "String";
})(ScalarTypes = exports.ScalarTypes || (exports.ScalarTypes = {}));
var Directive;
(function (Directive) {
    Directive["SCHEMA"] = "SCHEMA";
    Directive["SCALAR"] = "SCALAR";
    Directive["OBJECT"] = "OBJECT";
    Directive["FIELD_DEFINITION"] = "FIELD_DEFINITION";
    Directive["ARGUMENT_DEFINITION"] = "ARGUMENT_DEFINITION";
    Directive["INTERFACE"] = "INTERFACE";
    Directive["UNION"] = "UNION";
    Directive["ENUM"] = "ENUM";
    Directive["ENUM_VALUE"] = "ENUM_VALUE";
    Directive["INPUT_OBJECT"] = "INPUT_OBJECT";
    Directive["INPUT_FIELD_DEFINITION"] = "INPUT_FIELD_DEFINITION";
})(Directive = exports.Directive || (exports.Directive = {}));
var Value;
(function (Value) {
    Value["Variable"] = "Variable";
    Value["IntValue"] = "IntValue";
    Value["FloatValue"] = "FloatValue";
    Value["StringValue"] = "StringValue";
    Value["BooleanValue"] = "BooleanValue";
    Value["NullValue"] = "NullValue";
    Value["EnumValue"] = "EnumValue";
    Value["ListValue"] = "ListValue";
    Value["ObjectValue"] = "ObjectValue";
})(Value = exports.Value || (exports.Value = {}));
var Type;
(function (Type) {
    Type["NamedType"] = "NamedType";
    Type["ListType"] = "ListType";
    Type["NonNullType"] = "NonNullType";
})(Type = exports.Type || (exports.Type = {}));
var TypeSystemDefinition;
(function (TypeSystemDefinition) {
    TypeSystemDefinition["SchemaDefinition"] = "SchemaDefinition";
    TypeSystemDefinition["TypeDefinition"] = "TypeDefinition";
    TypeSystemDefinition["DirectiveDefinition"] = "DirectiveDefinition";
    TypeSystemDefinition["FieldDefinition"] = "FieldDefinition";
    TypeSystemDefinition["UnionMemberDefinition"] = "UnionMemberDefinition";
})(TypeSystemDefinition = exports.TypeSystemDefinition || (exports.TypeSystemDefinition = {}));
var TypeDefinition;
(function (TypeDefinition) {
    TypeDefinition["ScalarTypeDefinition"] = "ScalarTypeDefinition";
    TypeDefinition["ObjectTypeDefinition"] = "ObjectTypeDefinition";
    TypeDefinition["InterfaceTypeDefinition"] = "InterfaceTypeDefinition";
    TypeDefinition["UnionTypeDefinition"] = "UnionTypeDefinition";
    TypeDefinition["EnumTypeDefinition"] = "EnumTypeDefinition";
    TypeDefinition["InputObjectTypeDefinition"] = "InputObjectTypeDefinition";
})(TypeDefinition = exports.TypeDefinition || (exports.TypeDefinition = {}));
var ValueDefinition;
(function (ValueDefinition) {
    ValueDefinition["EnumValueDefinition"] = "EnumValueDefinition";
    ValueDefinition["InputValueDefinition"] = "InputValueDefinition";
})(ValueDefinition = exports.ValueDefinition || (exports.ValueDefinition = {}));
var TypeExtension;
(function (TypeExtension) {
    TypeExtension["ScalarTypeExtension"] = "ScalarTypeExtension";
    TypeExtension["ObjectTypeExtension"] = "ObjectTypeExtension";
    TypeExtension["InterfaceTypeExtension"] = "InterfaceTypeExtension";
    TypeExtension["UnionTypeExtension"] = "UnionTypeExtension";
    TypeExtension["EnumTypeExtension"] = "EnumTypeExtension";
    TypeExtension["InputObjectTypeExtension"] = "InputObjectTypeExtension";
})(TypeExtension = exports.TypeExtension || (exports.TypeExtension = {}));
var OperationType;
(function (OperationType) {
    OperationType["query"] = "query";
    OperationType["mutation"] = "mutation";
    OperationType["subscription"] = "subscription";
})(OperationType = exports.OperationType || (exports.OperationType = {}));
// below this line this is out of spec
var Instances;
(function (Instances) {
    Instances["Argument"] = "Argument";
    Instances["Directive"] = "Directive";
    Instances["Implement"] = "Implement";
})(Instances = exports.Instances || (exports.Instances = {}));
var Helpers;
(function (Helpers) {
    Helpers["Directives"] = "Directives";
    Helpers["Implements"] = "Implements";
    Helpers["Extend"] = "Extend";
    Helpers["Comment"] = "Comment";
})(Helpers = exports.Helpers || (exports.Helpers = {}));
//# sourceMappingURL=Spec.js.map