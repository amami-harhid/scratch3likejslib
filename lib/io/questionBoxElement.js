const playGround = require('../playGround');
const EventEmitter = require('events').EventEmitter;
const stageStageOverlays = 'stage_stage-overlays';
class QuestionElement extends EventEmitter{

    constructor() {
        super();
    }
    async ask() {
        const runtime = playGround.default.runtime;
        const keyboard = runtime.ioDevices.keyboard;
        keyboard.spaceStopPropagation = false;
        //const main = document.getElementById('main');
        const canvasDiv = document.getElementById('canvasDiv');
        const stage_stage_overlays = document.createElement('div');
        stage_stage_overlays.id = stageStageOverlays;
        stage_stage_overlays.classList.add( stageStageOverlays );
        canvasDiv.appendChild(stage_stage_overlays);
        const stage_stage_bottom_wrapper = document.createElement('div');
        stage_stage_bottom_wrapper.classList.add('stage_stage-bottom-wrapper');
        //stage_stage_bottom_wrapper.style.width = "90%";
        //stage_stage_bottom_wrapper.style.height = "90%";

        stage_stage_overlays.appendChild(stage_stage_bottom_wrapper);

        const stage_question_wrapper = document.createElement('div')
        stage_question_wrapper.style.position = 'absolute';
        stage_question_wrapper.classList.add("stage_question-wrapper");
        stage_stage_bottom_wrapper.appendChild(stage_question_wrapper);

        const div = document.createElement('div');
        stage_question_wrapper.appendChild(div);
        const div2 = document.createElement('div');
        div2.classList.add("question_question-container");
        div.appendChild(div2);
        const div3 = document.createElement('div');
        div3.classList.add('question_question-input');
        div2.appendChild(div3);
        const input = document.createElement('input');
        input.classList.add('input_input-form');
        input.setAttribute('type','text');
        input.setAttribute('spellcheck', false);
        div3.appendChild(input);
        const button = document.createElement('button');
        button.classList.add('question_question-submit-button');
        const img = document.createElement('img');
        img.classList.add('question_question-submit-button-icon');
        img.draggable = false;
        img.src = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDUxLjIgKDU3NTE5KSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5HZW5lcmFsL0NoZWNrPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTcuODYxNDQwNTksMTUuNDAyODc3NiBDNy40MzUyNjg1OSwxNS40MDI4Nzc2IDcuMDA5MDk2NTgsMTUuMjM5NzMzNiA2LjY4NDQ3MzM4LDE0LjkxNTExMDQgTDMuNDg4MTgzMzYsMTEuNzE4ODIwNCBDMi44MzcyNzIyMSwxMS4wNjc5MDkzIDIuODM3MjcyMjEsMTAuMDE1Nzk3MSAzLjQ4ODE4MzM2LDkuMzY0ODg2IEM0LjEzOTA5NDUsOC43MTM5NzQ4NSA1LjE5MTIwNjY0LDguNzEzOTc0ODUgNS44NDIxMTc3OCw5LjM2NDg4NiBMNy44NjE0NDA1OSwxMS4zODQyMDg4IEwxNC4xNTkxMzA4LDUuMDg4MTgzMzYgQzE0LjgwODM3NzIsNC40MzcyNzIyMSAxNS44NjIxNTQsNC40MzcyNzIyMSAxNi41MTMwNjUyLDUuMDg4MTgzMzYgQzE3LjE2MjMxMTYsNS43Mzc0Mjk3NyAxNy4xNjIzMTE2LDYuNzkxMjA2NjQgMTYuNTEzMDY1Miw3LjQ0MjExNzc4IEw5LjAzODQwNzgsMTQuOTE1MTEwNCBDOC43MTM3ODQ2LDE1LjIzOTczMzYgOC4yODc2MTI1OSwxNS40MDI4Nzc2IDcuODYxNDQwNTksMTUuNDAyODc3NiIgaWQ9InBhdGgtMSI+PC9wYXRoPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IkdlbmVyYWwvQ2hlY2siIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxtYXNrIGlkPSJtYXNrLTIiIGZpbGw9IndoaXRlIj4KICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPSIjcGF0aC0xIj48L3VzZT4KICAgICAgICA8L21hc2s+CiAgICAgICAgPHVzZSBpZD0iQ2hlY2siIGZpbGw9IiM1NzVFNzUiIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgIDxnIGlkPSJDb2xvci9XaGl0ZSIgbWFzaz0idXJsKCNtYXNrLTIpIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHJlY3QgaWQ9IkNvbG9yIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiPjwvcmVjdD4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';
        button.appendChild(img);
        div3.appendChild(button);

        let inputText = '';
        const inputChange = function(e) {
            inputText = e.currentTarget.value;
            //input.setAttribute('value', inputText);
        }

        const me = this;
        input.addEventListener('input', inputChange);
        input.addEventListener('keypress', function(e){
            if( e.key == 'Enter'){
                me.emit('textInput');
                return;
            }
        })
        const buttonClick = function() {
            me.emit('textInput');
        };

        button.addEventListener('click', buttonClick);

        input.focus();

        return new Promise(resolve=>{
            me.once('textInput', ()=>{
                keyboard.spaceStopPropagation = true;
                resolve(inputText);
            })
        })
    }
    removeAsk() {
        const _stageStageOverlays = document.getElementById(stageStageOverlays);
        if(_stageStageOverlays){
            _stageStageOverlays.remove();
        }
    }
}
export {QuestionElement};