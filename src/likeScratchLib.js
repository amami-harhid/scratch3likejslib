import 'regenerator-runtime'
import 'core-js'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer

const Process = require('../lib/process');
const process = Process.default;
const Element = process.Element;

Element.insertCss();

window.onload = async function(){
    await process._init();
    process.threads.startAll();
};

export {process};

