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

module.exports = P;

