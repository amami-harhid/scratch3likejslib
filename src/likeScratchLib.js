import 'regenerator-runtime'
import 'core-js'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer

const Process = require('../lib/process');
const Main = Process.default;
const Element = Main.Element;

Element.insertCss();

window.onload = async function(){
    await init();
};

const Pool = {
};

const init = async function() {
    await Main._init();
    Main.threads.startAll();

};

export {Main, Pool};

