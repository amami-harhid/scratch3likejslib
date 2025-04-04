const EventEmitter = require('events').EventEmitter;
const PlayGround = require('../playGround');
const Utils = require('../libs');

/** div include canvas */
const CanvasDiv = 'canvasDiv';
/** stageOverLays */
const StageOverlays = 'stage_stage-overlays';
/** class of stage bottom div */
const StageBottomWrapper = 'stage_stage-bottom-wrapper';
/** class of question div wrapper */
const StageQuestionWrapper = 'stage_question-wrapper';
/** class of question container */
const QuestionContainer = 'question_question-container';
/** class of question label (stage) */
const QuestionLabel = 'question_question-label';
/** class of Question input div */
const QuestionInput = 'question_question-input';
/** class of input tag */
const InputForm = 'input_input-form';
/** class of Question button */
const QuestionSubmitButton = 'question_question-submit-button';
/** class of Question Button Icon */
const QuestionSubmitButtonIcon = 'question_question-submit-button-icon';
/** Button svg text */
const ButtonIconSrc = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUxLjIgKDU3NTE5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5HZW5lcmFsL0NoZWNrPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTcuODYxNDQwNTksMTUuNDAyODc3NiBDNy40MzUyNjg1OSwxNS40MDI4Nzc2IDcuMDA5MDk2NTgsMTUuMjM5NzMzNiA2LjY4NDQ3MzM4LDE0LjkxNTExMDQgTDMuNDg4MTgzMzYsMTEuNzE4ODIwNCBDMi44MzcyNzIyMSwxMS4wNjc5MDkzIDIuODM3MjcyMjEsMTAuMDE1Nzk3MSAzLjQ4ODE4MzM2LDkuMzY0ODg2IEM0LjEzOTA5NDUsOC43MTM5NzQ4NSA1LjE5MTIwNjY0LDguNzEzOTc0ODUgNS44NDIxMTc3OCw5LjM2NDg4NiBMNy44NjE0NDA1OSwxMS4zODQyMDg4IEwxNC4xNTkxMzA4LDUuMDg4MTgzMzYgQzE0LjgwODM3NzIsNC40MzcyNzIyMSAxNS44NjIxNTQsNC40MzcyNzIyMSAxNi41MTMwNjUyLDUuMDg4MTgzMzYgQzE3LjE2MjMxMTYsNS43Mzc0Mjk3NyAxNy4xNjIzMTE2LDYuNzkxMjA2NjQgMTYuNTEzMDY1Miw3LjQ0MjExNzc4IEw5LjAzODQwNzgsMTQuOTE1MTEwNCBDOC43MTM3ODQ2LDE1LjIzOTczMzYgOC4yODc2MTI1OSwxNS40MDI4Nzc2IDcuODYxNDQwNTksMTUuNDAyODc3NiIgaWQ9InBhdGgtMSI+PC9wYXRoPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IkdlbmVyYWwvQ2hlY2siIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxtYXNrIGlkPSJtYXNrLTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICA8L21hc2s+CiAgICAgICAgPHVzZSBpZD0iQ2hlY2siIGZpbGw9IiM1NzVFNzUiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgIDxnIGlkPSJDb2xvci9XaGl0ZSIgbWFzaz0idXJsKCNtYXNrLTIpIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHJlY3QgaWQ9IkNvbG9yIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjwvcmVjdD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';

const QuestionBoxElement = class extends EventEmitter {
    /** emitId (input complete) */
    static TextInputComplete = 'textInputComplete';
    static QuestionBoxForceComplete = 'QuestionBoxForceComplete';
    constructor() {
        super();
        this.forceComplete = false;
    }
    /**
     * DOM(StageStageOverlays)が存在しなくなるまで待つ
     * 強制打ち切りの場合は false を返す
     * @returns Promise<void>
     */
    async askWait(entity) {
        const me = this;
        return new Promise(async resolve=>{
            const f = function() {
                me.forceComplete = true;
            }
            const stage = PlayGround.default.stage;
            stage.once(QuestionBoxElement.QuestionBoxForceComplete,f);
            let stage_stage_overlays = document.getElementById(StageOverlays);
            for(;;){
                if(me.forceComplete === true){
                    QuestionBoxElement.removeAsk(entity);
                    break;
                }
                if(stage_stage_overlays == undefined) {
                    break;
                }
                await Utils.default.wait(0.033);
                stage_stage_overlays = document.getElementById(StageOverlays);
            }
            if(me.forceComplete === true){
                resolve(false);
            }else{
                stage.removeListener(QuestionBoxElement.QuestionBoxForceComplete,f);
                resolve(true);
            }
        })

    }
    /**
     * entity がStageなのかを判定する
     * @param {*} entity 
     * @returns Stageの場合 True
     */
    static isStage(entity) {
        if(entity['isSprite'] &&  entity.isSprite() === false ){
            return true;
        }
        return false;
    }
    /**
     * entity がSpriteなのかを判定する
     * @param {*} entity 
     * @returns Spriteの場合 True
     */
    static isSprite(entity) {
        if(entity['isSprite'] &&  entity.isSprite() === true ){
            return true;
        }
        return false;
    }
    async ask( entity, text ) {
        this.forceComplete = false;
        const result = await this.askWait(entity);
        if(result === false || this.forceComplete === true) {
            QuestionBoxElement.removeAsk(entity);
            return '';
        }
        const canvasDiv = document.getElementById(CanvasDiv);
        const stage_overlays = document.createElement('div');
        stage_overlays.id = StageOverlays;
        stage_overlays.classList.add( StageOverlays );
        canvasDiv.appendChild(stage_overlays);
        const stage_stage_bottom_wrapper = document.createElement('div');
        stage_stage_bottom_wrapper.classList.add(StageBottomWrapper);
        stage_overlays.appendChild(stage_stage_bottom_wrapper);

        const stage_question_wrapper = document.createElement('div')
        stage_question_wrapper.style.position = 'absolute';
        stage_question_wrapper.classList.add(StageQuestionWrapper);
        stage_stage_bottom_wrapper.appendChild(stage_question_wrapper);

        const div = document.createElement('div');
        stage_question_wrapper.appendChild(div);
        const questionContainer = document.createElement('div');
        questionContainer.classList.add(QuestionContainer);
        div.appendChild(questionContainer);
        if(entity){
            if( QuestionBoxElement.isStage(entity) ){
                // ステージの場合
                const questionLabel = document.createElement('div');
                questionLabel.classList.add(QuestionLabel);
                questionLabel.innerHTML = text;
                questionContainer.appendChild(questionLabel);
            }else if( QuestionBoxElement.isSprite(entity) ){
                // スプライトの場合
                entity.Looks.say(text);
            }    
        }

        const questionInputDiv = document.createElement('div');
        questionInputDiv.classList.add(QuestionInput);
        questionContainer.appendChild(questionInputDiv);
        const input = document.createElement('input');
        input.classList.add(InputForm);
        input.setAttribute('type','text');
        input.setAttribute('spellcheck', false);
        questionInputDiv.appendChild(input);
        const button = document.createElement('button');
        button.classList.add(QuestionSubmitButton);
        const img = document.createElement('img');
        img.classList.add(QuestionSubmitButtonIcon);
        img.draggable = false;
        img.src = ButtonIconSrc;
        button.appendChild(img);
        questionInputDiv.appendChild(button);

        const runtime = PlayGround.default.runtime;
        const keyboard = runtime.ioDevices.keyboard;
        // 半角スペースの入力を許可する
        keyboard.spaceStopPropagation = false;

        let inputText = '';
        const inputChange = function(e) {
            inputText = e.currentTarget.value;
        }
        const me = this;
        input.addEventListener('input', inputChange);
        const keyPress = function(e){
            if( e.key == 'Enter'){
                me.emit(QuestionBoxElement.TextInputComplete);
                return;
            }
        }
        input.addEventListener('keypress', keyPress);

        const buttonClick = function() {
            // buttonクリックしたとき 
            me.emit(QuestionBoxElement.TextInputComplete);
        };
        button.addEventListener('click', buttonClick);

        input.focus();

        return new Promise(resolve=>{
            me.once(QuestionBoxElement.TextInputComplete, ()=>{
                // 質問の枠を消す    
                QuestionBoxElement.removeAsk(entity);
                // 半角スページ入力抑止
                keyboard.spaceStopPropagation = true;
                // Promise を解決、入力文字列を戻す
                resolve(inputText);
            })
        })
    }
    /**
     * 質問を消す
     */
    static removeAsk(entity) {
        if( entity && QuestionBoxElement.isSprite(entity) ){
            // スプライトの場合、フキダシを消す
            entity.Looks.say('');
        }
        const _stageOverlays = document.getElementById(StageOverlays);
        if(_stageOverlays){
            // 質問のDOMを削除する
            _stageOverlays.remove();
        }
    }
};

export default QuestionBoxElement;