import 'regenerator-runtime'
import 'core-js'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer

const Process = require('../lib/process');
const Scratch = Process.default;
const Element = Main.Element;

Element.insertCss();

window.onload = async function(){
    await init();
};

const Space = {
};

const init = async function() {
    await Scratch._init();
    Scratch.threads.startAll();

};

export {Scratch, Space};

