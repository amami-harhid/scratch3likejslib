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

const ImagePool = PlayGround.loadedImages;
const SoundPool = PlayGround.loadedSounds;

/** ステージ、スプライトデータ格納用 */
const Storage = PlayGround.dataPools;

Initialize();

export {PlayGround, Library, Storage, ImagePool, SoundPool};

