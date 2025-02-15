import 'regenerator-runtime'
import 'core-js'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer

const Process = require('../lib/process');
const _P = Process.default;
window.P = _P;
const Element = _P.Element;

Element.insertCss();

window.P.init = _P._init;

window.onload = async function(){
    await _P._init();
    P.threads.startAll();
};
const P = _P;


const Process2 = class {
    constructor(name) {
        this.name = name;
      }
    
      logger () {
        console.log("Hello", this.name);
      }
}
export default {P};

