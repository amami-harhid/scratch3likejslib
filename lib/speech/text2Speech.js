const SoundLoader = require('../importer/soundLoader');
const Process = require('../process');
const Sounds = require('../sounds');

const SERVER = 'https://synthesis-service.scratch.mit.edu';
/**
 * The url of the synthesis server.
 * @type {string}
 */
const SERVER_HOST = 'https://synthesis-service.scratch.mit.edu';

/**
 * How long to wait in ms before timing out requests to synthesis server.
 * @type {int}
 */
const SERVER_TIMEOUT = 10000; // 10 seconds

/**
 * Volume for playback of speech sounds, as a percentage.
 * @type {number}
 */
const SPEECH_VOLUME = 250;

/**
 * An id for one of the voices.
 */
const ALTO_ID = 'ALTO';

/**
 * An id for one of the voices.
 */
const TENOR_ID = 'TENOR';

/**
 * An id for one of the voices.
 */
const SQUEAK_ID = 'SQUEAK';

/**
 * An id for one of the voices.
 */
const GIANT_ID = 'GIANT';

/**
 * An id for one of the voices.
 */
const KITTEN_ID = 'KITTEN';

/**
 * Playback rate for the tenor voice, for cases where we have only a female gender voice.
 */
const FEMALE_TENOR_RATE = 0.89; // -2 semitones

/**
 * Playback rate for the giant voice, for cases where we have only a female gender voice.
 */
const FEMALE_GIANT_RATE = 0.79; // -4 semitones

/**
 * Language ids. The value for each language id is a valid Scratch locale.
 */
const ENGLISH_ID = 'en';
const JAPANESE_ID = 'ja';

const GENDER = class {
    static get MALE() {
        return 'male';
    }
    static get FEMALE() {
        return 'female';
    }
}
const Speech = class {

    constructor() {
        this.voice = ALTO_ID;
        this.language =  JAPANESE_ID;
        this.gender = GENDER.FEMALE;
        this.cache = new Map();
    }
    /**
     * An object with info for each voice.
     */
    get VOICE_INFO () {
        return {
            [ALTO_ID]: {
                name: formatMessage({
                    id: 'text2speech.alto',
                    default: 'alto',
                    description: 'Name for a voice with ambiguous gender.'
                }),
                gender: 'female',
                playbackRate: 1
            },
            [TENOR_ID]: {
                name: formatMessage({
                    id: 'text2speech.tenor',
                    default: 'tenor',
                    description: 'Name for a voice with ambiguous gender.'
                }),
                gender: 'male',
                playbackRate: 1
            },
            [SQUEAK_ID]: {
                name: formatMessage({
                    id: 'text2speech.squeak',
                    default: 'squeak',
                    description: 'Name for a funny voice with a high pitch.'
                }),
                gender: 'female',
                playbackRate: 1.19 // +3 semitones
            },
            [GIANT_ID]: {
                name: formatMessage({
                    id: 'text2speech.giant',
                    default: 'giant',
                    description: 'Name for a funny voice with a low pitch.'
                }),
                gender: 'male',
                playbackRate: 0.84 // -3 semitones
            },
            [KITTEN_ID]: {
                name: formatMessage({
                    id: 'text2speech.kitten',
                    default: 'kitten',
                    description: 'A baby cat.'
                }),
                gender: 'female',
                playbackRate: 1.41 // +6 semitones
            }
        };
    }
    get LANGUAGE_INFO () {
        return {
            [ENGLISH_ID]: {
                name: 'English',
                locales: ['en'],
                speechSynthLocale: 'en-US'
            },
            [JAPANESE_ID]: {
                name: 'Japanese',
                locales: ['ja', 'ja-hira'],
                speechSynthLocale: 'ja-JP'
            },
        };
    }
    /**
     * The default state, to be used when a target has no existing state.
     * @type {Text2SpeechState}
     */
    static get DEFAULT_TEXT2SPEECH_STATE () {
        return {
            voiceId: ALTO_ID
        };
    }

    /**
     * A default language to use for speech synthesis.
     * @type {string}
     */
    get DEFAULT_LANGUAGE () {
        return JAPANESE_ID;
    }

    speech(words, properties={}) {
        // 128文字までしか許容しないとする
        const text = encodeURIComponent(words.substring(0, 128));
        let path = `${SERVER_HOST}/synth?locale=${this.locale}&gender=${this.gender}&text=${text}`;
        if(!this.cache.has(path)) {
            const name = 'ScratchSpeech'; // <-- なんでもよいが、変数に使える文字であること
            const me = this;
            SoundLoader.loadSound(path,name).then(_sound=>{
                me.cache.set(path, _sound);
                me._speechPlay(_sound.name, _sound.data, properties);
            });
        }else{
            const _sound = this.cache.get(path);
            this._speechPlay(_sound.name, _sound.data, properties);
        }
    }
    
    _speechPlay(name, data, properties) {
        const sounds = new Sounds();
        sounds.setSound(name, data, properties).then(_=>{
            sounds.play();
        });
    }

    async speechAndWait(words, properties={}) {
        // 128文字までしか許容しないとする
        const text = encodeURIComponent(words.substring(0, 128));
        let path = `${SERVER_HOST}/synth?locale=${this.locale}&gender=${this.gender}&text=${text}`;
        if(!this.cache.has(path)) {
            const name = 'ScratchSpeech'; // <-- なんでもよいが、変数に使える文字であること
            const sound = await SoundLoader.loadSound(path, name);
            this.cache.set(path, sound);
        }
        const sound = this.cache.get(path);
        await this._speechPlayUntilDone(sound.name, sound.data, properties);
    }
    
    async _speechPlayUntilDone(name, data, properties) {
        const sounds = new Sounds();
        await sounds.setSound(name, data, properties);
        await sounds.startSoundUntilDone();
    }

    static getInstance() {
        if(Speech.instance == undefined) {
            Speech.instance = new Speech();
        }
        return Speech.instance;
    }
}

module.exports = Speech;