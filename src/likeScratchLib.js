import 'regenerator-runtime'
import 'core-js'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer
const Libs = require('../lib/libs');
const Process = require('../lib/process');
const process = Process.default;
const libs = Libs.default;
const Element = process.Element;

Element.insertCss();

window.onload = async function(){
    init();
};

/** アプリデータ格納用（なんでも入る） */
const pool = process.dataPool;

const init = async function() {
    await process._init();
    //process.threads.startAll();

};



export {libs, process, pool};

