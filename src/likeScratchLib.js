import 'regenerator-runtime'
import 'core-js'
import { Buffer } from 'buffer'
window.Buffer = window.Buffer || Buffer
const Libs = require('../lib/libs').default;
const PlayGround = require('../lib/playGround').default;
const Element = PlayGround.Element;

Element.insertCss();

window.onload = async function(){
    init();
};

const Images = PlayGround.loadedImages;
const Sounds = PlayGround.loadedSounds;

/** アプリデータ格納用（なんでも入る） */
const Storage = PlayGround.dataPool;

const init = async function() {
    await PlayGround._init();
    //process.threads.startAll();

};



export {PlayGround, Libs, Storage, Images, Sounds};

