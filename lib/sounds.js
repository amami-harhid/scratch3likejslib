const AudioEngine = require('scratch-audio');
const SoundLoader = require('./importer/soundLoader');
//const Process = require('./process');
const SoundPlayer = require('./soundPlayer');
const Sounds = class {

    constructor() {
        this.audioEngine = new AudioEngine();
        this.soundPlayers = new Map();
        this.soundPlayer = null;
        this.soundIdx = 0;
    }
    async importSound( sound ) {
        const soundData = await SoundLoader.loadSound(sound);
        return soundData;
    }
    async setSound( name, soundData, options = {} ) {
        // audioEngine.decodeSoundPlayerの引数は {data} の形にする。変数名は dataでないといけない。
        const data = soundData;
        const _soundPlayer = await this.audioEngine.decodeSoundPlayer({data});
        const _effects = this.audioEngine.createEffectChain();
        const _options = options;
        _options.effects = _effects;
        const soundPlayer = new SoundPlayer(name, _soundPlayer, _options);
        if(this.soundPlayer == null){
            this.soundPlayer = soundPlayer;
        }
        this.soundPlayers.set(name, soundPlayer);
        // effects は インスタンスを作るときに渡しているので引数省略。
        soundPlayer.connect(_effects);

    }
    async loadSound( name, sound , options = {}) {
        const data = await SoundLoader.loadSound(sound);
        await this.setSound(name, data, options);
    }
    switch(name) {
        const me = this;
        const _keys = Array.from(this.soundPlayers.keys());
        if( _keys.length > 1) {
            _keys.map((_name,_idx) => {
                if(_name == name) {
                    me.soundIdx = _idx;
                    const soundPlayer = me.soundPlayers.get(name);
                    me.soundPlayer = soundPlayer;
                }
            });

        } 
    }
    nextSound() {
        const me = this;
        const _keys = Array.from(this.soundPlayers.keys());
        if( _keys.length > 1) {
            const _nextIdx = this.soundIdx + 1;
            if(_nextIdx < _keys.length) {
                this.soundIdx = _nextIdx;
            }else{
                this.soundIdx = 0;
            }
            _keys.map( (_name, _idx) => {
                if (_idx == me.soundIdx ) {
                    me.soundPlayer = me.soundPlayers.get(_name);
                }
            });
        }
    }
    play() {
        if ( this.soundPlayer == null) return;
        const _effects = this.soundPlayer.effects;
        this.soundPlayer.connect(_effects);
        this.soundPlayer.play();
    }
    setVolume(volume, name) {
        if(name) {
            const me = this;
            const _keys = Array.from(this.soundPlayers.keys());
            if ( _keys.length > 0 ) {
                _keys.map((_name,_idx)=>{
                    if ( _name == name ) {
                        const _soundPlayer = this.soundPlayers.get(name);
                        _soundPlayer.volume = volume;               
                    }
                });
            } else {
                // soundPlayerがない
                return;
            }
        } else {
            if ( this.soundPlayer == null) return;
            this.soundPlayer.volume = volume;
        }
    }
    set volume(volume = 100) {
        if ( this.soundPlayer == null) return;
        // 現在選択中の soundPlayerへ設定する
        this.soundPlayer.volume = volume;
    }
    get volume(){
        if ( this.soundPlayer == null) return;
        // 現在選択中の soundPlayerから取得する
        return this.soundPlayer.volume;
    }
    set pitch(pitch = 1) {
        if ( this.soundPlayer == null) return;
        // 現在選択中の soundPlayerへ設定する
        this.soundPlayer.pitch = pitch;
    }
    get pitch() {
        if ( this.soundPlayer == null) return;
        // 現在選択中の soundPlayerから取得する
        return this.soundPlayer.pitch;
    }
    async startSoundUntilDone() {
        if ( this.soundPlayer == null) return;
        await this.soundPlayer.startSoundUntilDone(); // 終わるまで待つ
    }
    stop() {
        if ( this.soundPlayer == null) return;
        this.soundPlayer.stop();
    }

    stopImmediately() {
        if ( this.soundPlayer == null) return;
        this.soundPlayer.stopImmediately();
    }
};

module.exports = Sounds;