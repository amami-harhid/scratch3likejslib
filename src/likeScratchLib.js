import 'regenerator-runtime'
import 'core-js'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer
const Libs = require('../lib/libs').default;
const PlayGround = require('../lib/playGround').default;
const Element = PlayGround.Element;

Element.insertCss();

const Initialize = async function() {
    await PlayGround._init();
};

const Images = PlayGround.loadedImages;
const Sounds = PlayGround.loadedSounds;

/** アプリデータ格納用（なんでも入る） */
const Storage = PlayGround.dataPool;

Initialize();

export {PlayGround, Libs, Storage, Images, Sounds};

