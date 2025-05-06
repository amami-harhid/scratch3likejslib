import 'regenerator-runtime'
import 'core-js'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer
const _PlayGround = require('../lib/playGround');
const PlayGround = _PlayGround.default;
const Library = PlayGround.Libs;

const Element = PlayGround.Element;

Element.insertCss();

const Initialize = async function() {
    await PlayGround._init();
};

Initialize();
export {PlayGround, Library};

