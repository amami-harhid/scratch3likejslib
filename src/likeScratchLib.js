import 'regenerator-runtime'
import 'core-js'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer
const Library = require('../lib/libs').default;
const PlayGround = require('../lib/playGround').default;
const Element = PlayGround.Element;

Element.insertCss();

const Initialize = async function() {
    await PlayGround._init();
};

Initialize();

export {PlayGround, Library};

