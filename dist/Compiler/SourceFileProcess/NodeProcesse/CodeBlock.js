"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBlock = exports.BlockType = void 0;
const ts_morph_1 = require("ts-morph");
const VariableProcess_1 = require("./VariableProcess");
const Functions_1 = require("../Functions");
const JsonClass_1 = require("JsonClass");
const FunctionProcess_1 = require("./FunctionProcess");
const ExpressionProcess_1 = require("./ExpressionProcess");
const NPInterfaces_1 = require("./NPInterfaces");
const IfProcess_1 = require("./IfProcess");
const SwitchProcess_1 = require("./SwitchProcess");
var BlockType;
(function (BlockType) {
    BlockType["IF"] = "if";
    BlockType["ELSE"] = "else";
    BlockType["CLAUSE"] = "clause";
    BlockType["OTHER"] = "other";
})(BlockType = exports.BlockType || (exports.BlockType = {}));
let _processFunc = {
    [ts_morph_1.SyntaxKind.VariableStatement]: VariableProcess_1.VariableProcess,
    [ts_morph_1.SyntaxKind.FunctionDeclaration]: FunctionProcess_1.FunctionProcess,
    [ts_morph_1.SyntaxKind.ExpressionStatement]: ExpressionProcess_1.ExpressionProcess,
    [ts_morph_1.SyntaxKind.ReturnStatement]: ReturnProcess,
    [ts_morph_1.SyntaxKind.IfStatement]: IfProcess_1.IfProcess,
    [ts_morph_1.SyntaxKind.SwitchStatement]: SwitchProcess_1.SwitchProcess,
};
function ReturnProcess(node) {
    (0, Functions_1.checkKind)(node, ts_morph_1.SyntaxKind.ReturnStatement);
    let outlist = new NPInterfaces_1.ProcessReturn();
    let rit = (0, ExpressionProcess_1.MathExpProcess)(node.getExpressionOrThrow(), this.getSfd());
    outlist.addPreFuncList(rit.getPreFuncs());
    let obj = { "math": [this.getReturnId(), "=", rit.getToken()] };
    outlist.addToken(obj);
    //return [{ "math": [ id, mid, lst ]}];
    return outlist;
}
class CodeBlock {
    _id;
    _parentBlock;
    _node;
    _sfd;
    _condition;
    _falseNode;
    _processTable = {
        [ts_morph_1.SyntaxKind.VariableStatement]: VariableProcess_1.VariableProcess,
        [ts_morph_1.SyntaxKind.FunctionDeclaration]: FunctionProcess_1.FunctionProcess,
        [ts_morph_1.SyntaxKind.ExpressionStatement]: ExpressionProcess_1.ExpressionProcess,
        [ts_morph_1.SyntaxKind.ReturnStatement]: ReturnProcess,
        [ts_morph_1.SyntaxKind.IfStatement]: IfProcess_1.IfProcess,
        [ts_morph_1.SyntaxKind.SwitchStatement]: SwitchProcess_1.SwitchProcess,
    };
    constructor(id, node, sfd, condition, falseNode) {
        this._id = id;
        this._node = node;
        this._sfd = sfd;
        this._condition = condition;
        this._falseNode = falseNode;
    }
    getId() {
        return this._id;
    }
    getReturnId() {
        return this.getId() + "_return";
    }
    getParentBlock() {
        return this._parentBlock;
    }
    genSubBlock(id, node, sfd, condition, falseNode) {
        let rid = sfd.genRID();
        let subBlockId = this.getId() + "_" + id + "_" + rid;
        let subBolck = new CodeBlock(subBlockId, node, sfd, condition, falseNode);
        subBolck._parentBlock = this;
        return subBolck;
    }
    getSfd() {
        return this._sfd;
    }
    /**处理代码块
     */
    build() {
        let eoc = new JsonClass_1.Eoc(this.getId());
        if (this._condition != null)
            eoc.setCondition(this._condition);
        eoc.addEffectList(this.processStatments(this._node));
        if (this._falseNode != null)
            eoc.addFalseEffectList(this.processStatments(this._falseNode));
        let eocObj = eoc.build();
        this._sfd.addEoc(eocObj);
        return new NPInterfaces_1.ProcessReturn([eoc.build()]);
    }
    /**处理申明列表
     */
    processStatments(node) {
        let statments = [];
        if (Array.isArray(node))
            statments = node;
        else if (node.isKind(ts_morph_1.SyntaxKind.SourceFile) || node.isKind(ts_morph_1.SyntaxKind.Block) || node.isKind(ts_morph_1.SyntaxKind.CaseClause))
            statments = node.getStatements();
        else
            statments = [node];
        let effects = [];
        for (let stat of statments) {
            try {
                let processFunc = _processFunc[stat.getKind()];
                if (processFunc == null)
                    continue;
                let result = processFunc.bind(this)(stat);
                if (!result.isVaild())
                    continue;
                let preFuncs = result.getPreFuncs();
                let tokens = result.getTokens();
                for (let obj of preFuncs)
                    effects.push(obj);
                for (let obj of tokens)
                    effects.push(obj);
            }
            catch (e) {
                console.log("processStatments 出现错误");
                console.log((0, Functions_1.throwLog)(stat));
                throw e;
            }
        }
        return effects;
    }
}
exports.CodeBlock = CodeBlock;
exports.default = CodeBlock;
