const SoundPlayer = class {

    constructor(name, _soundPlayer, options = {}) {
        this._name = name;
        this._soundPlayer = _soundPlayer;
        this._options = options;
        this._volume = ('volume' in options)? options.volume: 100;
        this._pitch = ('pitch' in options)? options.pitch: 1;
        this.connectDone = false;
        if('effects' in this._options) {
            this._effects = this._options.effects;
            this._soundPlayer.setPlaybackRate(this._pitch);
            this._effects.set(this._effects.volume.name, this._volume);
            this._effects.volume.update();
            this.connect();
        }
    }
    set pitch( pitch ) {
        this._pitch = pitch;
        this._soundPlayer.setPlaybackRate(pitch);
    }
    get pitch() {
        return this._pitch;
    }
    set volume( volume) {
        this._volume = volume;
        this._effects.set(this._effects.volume.name, this._volume);
        this._effects.volume.update();
    }
    get volume() {
        return this._volume;
    }

    get soundPlayer() {
        return this._soundPlayer;

    }
    get name() {
        return this._name;
    }
    set effects ( effects ){
        this._effects = effects;
    }
    get effects() {
        return this._effects;
    }
    connect(effects) {
        if(this.connectDone === false) {
            if(effects) {
                this._effects = effects;
            }
            this._soundPlayer.connect(this._effects);
            this.connectDone = true;
        }
    }
    play() {
        this._soundPlayer.play();
    }
    async startSoundUntilDone() {
        this.play();
        await this._soundPlayer.finished();
    }
    stop() {
        this._soundPlayer.stop();
    }
    stopImmediately() {
        this._soundPlayer.stopImmediately();
    }

}

module.exports = SoundPlayer;