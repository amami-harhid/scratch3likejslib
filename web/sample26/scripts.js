/**
 * sample26
 * 質問を出す
 */

import {PlayGround, Library} from '../../build/index.js'
const [Pg, Lib] = [PlayGround, Library]; // 短縮名にする

Pg.title = "【Sample26】リンゴの色に触れたときネコが鳴く"

const Jurassic = "Jurassic";
const Cat01 = "Cat01";

let stage;
let cat;

Pg.preload = async function () {
    this.Image.load('../assets/Jurassic.svg', Jurassic);
    this.Image.load('../assets/cat.svg', Cat01 );
}
Pg.prepare = async function () {
    stage = new Lib.Stage();
    stage.Image.add( Jurassic  )
    cat = new Lib.Sprite( 'cat' );
    await cat.Image.add( Cat01 );

}

Pg.setting = async function () {

    cat.Event.whenFlag(async function*(){
        addCss();
    });

    cat.Event.whenClicked(async function(){
        const question = new QuestionElement(this);
        question.ask('abcdefg');
    });
}
function addCss() {
    const style = document.createElement('style');
    style.innerHTML =
`
.stage_stage-overlays {
    position: absolute;
    top: 0.0625rem;
    left: 0.0625rem;
    pointer-events: none;
    width: 90%;
    height: 90%;
    z-index: 9999;
}
.stage_stage-bottom-wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    top: 0;
    left: 0;
    overflow: hidden;
    pointer-events: none;
}
.stage_question-wrapper {
    width:95%;
    pointer-events: auto;
    z-index:99999;
}
.question_question-container {
    margin: 0.5rem;
    border: 1px solid hsla(0, 0%, 0%, 0.15);
    border-radius: 0.5rem;
    border-width: 2px;
    padding: 1rem;
    background: white;
}
.question_question-input {
    display: flex;
    position: relative;
    width:90%;
}
.input_input-form {
    height: 2rem;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 1.2rem;
    color: hsla(225, 15%, 40%, 1);
    border-width: 1px;
    border-style: solid;
    border-color: hsla(0, 0%, 0%, 0.15);
    border-radius: 2rem;
    outline: none;
    cursor: text;
    transition: 0.25s ease-out;
    box-shadow: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    width:100%;
}
`;
    document.getElementsByTagName('head')[0].appendChild(style);
}
class QuestionElement {

    constuctor(sprite) {
        this.sprite = sprite;
    }
    ask(text) {
        const main = document.getElementById('main');
        const stage_stage_overlays = document.createElement('div');
        stage_stage_overlays.classList.add('stage_stage-overlays');
        main.appendChild(stage_stage_overlays);
        const stage_stage_bottom_wrapper = document.createElement('div');
        stage_stage_bottom_wrapper.classList.add('stage_stage-bottom-wrapper');
        stage_stage_bottom_wrapper.style.width = "90%";
        stage_stage_bottom_wrapper.style.height = "90%";

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
        div3.appendChild(input);
    }
}