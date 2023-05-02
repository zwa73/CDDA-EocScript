import { FunctionDeclaration, Node, SyntaxKind } from "ts-morph";
import { checkKind } from "../../Functions";
import { SourceFileData } from "../../Interfaces";
import CodeBlock from "../CodeBlock";



export class GlobalFunction{
    _node:FunctionDeclaration;
    _sfd:SourceFileData;
    _params:Array<Node>=[];
    //动态生成的不同参数函数代码块
    _dynamicCodeBlockTable:Record<string,CodeBlock|null>={}

    constructor(node:Node,sfd:SourceFileData){
        checkKind(node,SyntaxKind.FunctionDeclaration);
        this._node = node;
        this._sfd = sfd;
        this._params = node.getParameters();
    }
    getNode(){
        return this._node;
    }
    getSfd(){
        return this._sfd;
    }
    getRawName(){
        return this.getNode().getNameOrThrow();
    }
    /**获取全局函数ID
     * @param args 参数
     */
    getId(args?:Array<Node>){
        let base = this.getSfd().getId()+"_"+this.getRawName();

        if(args!=null){
            for(let arg of args)
                base+="_"+arg.getText();
        }

        return base;
    }
    getCodeBlock(args?:Array<Node>){
        let cid = this.getId(args);

        if(this._dynamicCodeBlockTable[cid]!=null)
            return this._dynamicCodeBlockTable[cid];

        let funcid = this.getId();
        let codeBody = this.getNode().getBodyOrThrow();
        let cb = new CodeBlock(funcid,codeBody,this.getSfd());

        //传参
        if(args==null)
            args=[];
        for(let i in args)
            cb.addPassArgs(this._params[i].getText(),args[i].getText());

        //let cb = new CodeBlock(codeBody,this._sfd,this._cbd.genSubBlock());
        cb.build();
        this._dynamicCodeBlockTable[cid] = cb;
        return cb;
    }
    /**获取全局函数返回值ID
     * @param rawFuncName
     */
    getReturnID(){
        return this.getSfd().getId()+"_"+this.getRawName()+"_return";
    }
}