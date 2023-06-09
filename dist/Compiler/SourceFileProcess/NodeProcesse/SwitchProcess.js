"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchProcess = void 0;
const ts_morph_1 = require("ts-morph");
const Functions_1 = require("../Functions");
const NPInterfaces_1 = require("./NPInterfaces");
const CodeBlock_1 = require("./CodeBlock");
const ExpressionProcess_1 = require("./ExpressionProcess");
function SwitchProcess(node) {
    (0, Functions_1.checkKind)(node, ts_morph_1.ts.SyntaxKind.SwitchStatement);
    let out = new NPInterfaces_1.ProcessReturn();
    let switchObj = {
        "switch": (0, ExpressionProcess_1.AutoExpProcess)(node.getExpression(), this.getSfd()).getToken(),
        "cases": [],
    };
    let cases = node.getCaseBlock().getClauses();
    for (let caseClause of cases) {
        if (caseClause.isKind(ts_morph_1.SyntaxKind.CaseClause)) {
            let caToken = parseInt(caseClause.getExpression().getText());
            //let caseid = this.getSfd().genBlockId(BlockType.CLAUSE);
            //let blockObj = ca.getFirstDescendantByKindOrThrow(SyntaxKind.Block);
            let block = this.genSubBlock(CodeBlock_1.BlockType.CLAUSE, caseClause, this.getSfd());
            let blockObj = block.build();
            out.mergePreFuncList(blockObj);
            switchObj.cases.push({
                case: caToken,
                effect: [{ "run_eocs": block.getId() }]
            });
        }
    }
    out.addToken(switchObj);
    return out;
}
exports.SwitchProcess = SwitchProcess;
