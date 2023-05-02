import { Node } from "ts-morph";
import { SourceFileData } from "../../Interfaces";
import { ExpProcessReturn } from "./EPInterface";
import { MathExpProcess } from "./MathExpProcess";



//非赋值运算处理
export function ValExpProcess(node: Node,sfd:SourceFileData):ExpProcessReturn{
    let out = new ExpProcessReturn();

    let exp = MathExpProcess(node,sfd);
    out.addPreFuncList(exp.getPreFuncs());

    out.setToken({"math":[exp.getToken()]});

    return out;
}