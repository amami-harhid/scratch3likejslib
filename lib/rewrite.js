const js_beautify = require('js-beautify');
const Rewrite = class {

    static getInstance() {
        if( Rewrite._instance == undefined ) {
            Rewrite._instance = new Rewrite();
        }
        return Rewrite._instance;
    }

    exec ( f, me, emitterEventId, ...args ) {

        const af = this._rewrite( f );
        let bindedFunc = af.bind( me );
        // async functionを実行しているので、エラーcatchは try^catch構文では不可能。
        bindedFunc(...args).catch(e=>{ console.error('script=', f.toString()); throw e; });

    }
    execWithEmitter ( f, me, emitterEventId, ...args ) {

        const af = this._rewrite( f , emitterEventId);
        let bindedFunc = af.bind( me );
        // async functionを実行しているので、エラーcatchは try^catch構文では不可能。
        bindedFunc(...args).catch(e=>{ console.error('script=', f.toString()); throw e; });

    }

    execThread( f, me, ...args ) {
//        console.log("execThread(1)", f);
        const af = this._rewrite( f );
//        console.log("execThread(2)", af);
        let bindedFunc = af.bind( me );
        let t = setTimeout(bindedFunc, 0, ...args);
        return t;
    }
    _removeOuter( funcS ) {
        return funcS.substring(funcS.indexOf('{') + 1, funcS.lastIndexOf('}'));
    }
    _removeComments ( funcS ) {
        return funcS.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');
    }
    _getEventObjectVarName ( funcS ) {
        return funcS.substring(funcS.indexOf('(') + 1, funcS.indexOf(')'))
    }
    static get constant() {
        return {
            RegexLoopDef : /((while|for)\s\([^\)]*?\)\s)({)/g ,
            LoopProtectionIsDone : /_waitRapperRewrited/,
            LoopProtectionStopper : `if(_stopper_===true){break;}\n` ,
            LoopProtectionCode : `await P.Utils._waitRapperRewrited(P.Env.pace); \n` ,
            JsBeautifyOptions : {
                indent_size: 2,
                space_in_empty_paren: false,
                space_in_paren: false,            
            }
        }

    }
    _rewrite ( f, emitterEventId ) {
        let code = f.toString();
        const theVar = this._getEventObjectVarName(code)
        //console.log(theVar)
        code = this._removeComments(code);// コメントを消す
        
    /* 整形の結果「Left Curly Bracket({)の前の改行をなくす
      SemiColonで終わらない行にSemiColonは付与しないことに注意。
      while(true)
      {x+=1;break}
      ↓
      while (true) {
        x += 1;
        break
      }
    */
        code = js_beautify(code, Rewrite.constant.JsBeautifyOptions);
        const _loopProtectionIsDone = code.match(Rewrite.constant.LoopProtectionIsDone);
        if( _loopProtectionIsDone === null) {
            if(emitterEventId ) {
                code = code.replace(Rewrite.constant.RegexLoopDef, '$1$3' + Rewrite.constant.LoopProtectionStopper + Rewrite.constant.LoopProtectionCode);
            }else{
                code = code.replace(Rewrite.constant.RegexLoopDef, '$1$3' + Rewrite.constant.LoopProtectionCode);
            }
        }
        code = js_beautify(code, Rewrite.constant.JsBeautifyOptions);
        // function() {　}　の外側を除去する
        code = this._removeComments(this._removeOuter(code))

        // emitter処理を前後につける
        if(emitterEventId ) {
            code = ` const _STOPF_=()=>{_stopper_=true;}\nlet _stopper_=false;this.once('${emitterEventId}',_STOPF_);\n `+ code;
//            code = ` this.emit('${emitterEventId}');const _STOPF_=()=>{stopper=true;}\nlet stopper=false;this.once('${emitterEventId}',_STOPF_);\n `+ code;
            code = code + ` this.removeListener('${emitterEventId}',_STOPF_);\n`;                
            code = js_beautify(code, Rewrite.constant.JsBeautifyOptions);
            //console.log(code);
        }

        const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor
        //const AsyncFunction = new Function(`return Object.getPrototypeOf(async function(){}).constructor`)();
        let af = null;

        // AyncFunction で async functionを作る過程のなかのエラーをキャッチする方法がわからない（例：変数のreferenceエラーなど）

        if(theVar.length>0 ) {
            af = new AsyncFunction(theVar,code);

        }else{
            af = new AsyncFunction(code)
        }
        return af;
    
    }
}

export default Rewrite.getInstance();