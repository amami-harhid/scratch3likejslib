const Element = require('./element');
const Env = require('./env');
const FontLoader = require('./importer/fontLoader');
const ImageLoader = require('./importer/imageLoader');
const NowLoading = require('./nowLoading');
const Libs = require('./libs');
const Render = require('./render');
const Runtime = require('./engine/runtime');
const SoundLoader = require('./importer/soundLoader');
const Stage = require('./stage');
const threads = require('./threads');
const Utils = require('./utils');

const PlayGround = class {

    static getInstance() {
        if( PlayGround._instance == undefined ) {
            PlayGround._instance = new PlayGround();
        }
        return PlayGround._instance;
    }

    constructor () {
        this._render = null;
        this._id = this._generateUUID();
        this._preloadImagePromise = [];
        this._preloadSoundPromise = [];
        this._preloadFontPromise = [];
        this._loadedImages = {};
        this._loadedSounds = {};
        this._dataPools = {};
        this._preloadDone = false;
        this._prepaeDone = false;

        this._monitors = null;
    }
    get monitors() {
        return this._monitors;
    }
    set monitors(_monitors){
        this._monitors = _monitors;
    }
    isPrepareDone(){
        return this._prepaeDone;
    }
    clearPools() {
        const _pool = this._dataPoolSprite;
        for (let key in _pool){ 
            delete this._dataPoolSprite[key]
        }
        // for( let key in this._loadedImages){
        //     delete this._loadedImages[key];
        // }
        // for( let key in this._loadedSounds){
        //     delete this._loadedSounds[key];
        // }
    }
    get loadedImages() {
        return this._loadedImages;
    }
    get loadedSounds() {
        return this._loadedSounds;
    }
    get dataPools() {
        return this._dataPools;
    }
    set dataPools(_dataPool) {
        this._dataPools = _dataPool;
    }
    get Element () {
        return Element;
    }
    get Stage () {
        return Stage;
    }    
    _generateUUID () {
        return Utils.generateUUID();
    }
    get NowLoading () {
        return NowLoading;
    }
    get threads () {
        return threads;
    }
    get render () {
        return this._render;
    }
    set render( render ) {
        // _init() の中で設定される。
        this._render = render;
    }
    set stage ( stage ) {
        this._stage = stage;
    }

    get stage () {
        return this._stage;
    }

    get $stageWidth () {
        return this._render.stageWidth;
    }

    get $stageHeight () {
        return this._render.stageHeight;
    }


    /**
     * get randering rate ( when resized )
     * @returns 
     */
    getRenderRate() {
        return Libs.default.renderRate;        
    }


    set flag ( flag ) {
        this._flag = flag;
    }

    get flag () {
        return this._flag;
    }

    ifMainExist() {
        const main = document.getElementById('main');
        if(main) return main;
        return false;
    }
    removeMainIfExist(){
        const main = this.ifMainExist();
        if(main){
            main.remove();
        }
    }
    async _reStart() {
//        this.clearPools();
//        console.log('befor _prepare');
//        await this._prepare();
        await this._setting();

    }
    /**
     * HTMLヘッダーtitle
     */
    get title() {
        return document.title;
    }
    set title(_title) {
        document.title = _title;
    }

    async _init() {
//        const keyboard = Keyboard.default;
//        keyboard.startWatching();
        // Now Loading 準備 START
        const mainTmp = document.createElement('main');
        this.mainTmp = mainTmp;
        mainTmp.id = 'mainTmp';
        mainTmp.classList.add('nowLoading');
        mainTmp.style.zIndex = 9999 ; // 一番手前 ( 本体main z-index= 999)
        mainTmp.style.position = 'absolute'
        mainTmp.style.touchAction = 'manipulation'
        mainTmp.style.width = `${innerWidth}px`
        mainTmp.style.height = `${innerHeight}px`

        document.body.appendChild(mainTmp);
        await Utils.wait(100);
        this._preload();
        await this._waitUntilPreloadDone();   
        await Element.init();
        const main = this.main;
        main.classList.add(Element.DISPLAY_NONE);
        this._render = new Render();
        this.runtime = new Runtime();
        this.runtime.attachRenderer(this._render.renderer);    
//        this._prepareReload();
        this.clearPools();
        await this._prepare();
        this._prepaeDone = true;
        await this._setting();
        await Element.flagInit();
        //await this._setting();

        this.runningGame = false;
        this.runtime.on('RUNNING_GAME', ()=>{
            this.runningGame = true;
        });
        this.runtime.on('PAUSING_GAME', ()=>{
            this.runningGame = false;
        });
        await Utils.wait(100);
        // Mainタグから非表示のクラスを除去しフラグとキャンバスを表示する
        main.classList.remove(Element.DISPLAY_NONE);
        // NowLoadingを消す。
        this.mainTmp.remove();

    }
    async _preload () {
        if( this.preload ) {
            this.preload( this );
        }
    }

    async _prepare () {

        // prepareメソッドの実行を開始する
        if( this.prepare ) {
            await this.prepare(this);
            await Utils.wait(Env.pace);
            if( this._stage ) {
                this._stage.update();
                this._stage.draw();
            }
        }
    }
    async _setting () {

        if( this.setting ) {
            await this.setting (this);
        }

    }

    _draw () {
        if( this._stage ) {
            this._stage.update ();
            this._stage.draw();
            // draw関数を定義済であれば実行する
            // これは p5.js の名残り。なくてもよいと思う。
            if( this.draw ) {
                this.draw();
            }
        }
        if( this._monitors ) {
            this._monitors.draw();
        }
    }

    $loadImage(imageUrl, name, translate) {
        let _name ;
        if( name ) {
            _name = name;
        }else{
            _name = imageUrl.replace(/\.[^.]+$/)
        }
        const data = ImageLoader.loadImage(imageUrl, _name, translate);
        this._preloadImagePromise.push(data);
        return data;
    }
    $loadSound(soundUrl, name) {
        let _name ;
        if( name ) {
            _name = name;
        }else{
            _name = imageUrl.replace(/\.[^.]+$/)
        }
        const data = SoundLoader.loadSound(soundUrl, _name);
        this._preloadSoundPromise.push(data);
        return data;
    }
    loadFont(fontUrl, name) {
        const font = FontLoader.fontLoad(fontUrl, name);
        this._preloadFontPromise.push(font);
        return font;
    }
    spriteClone( src, callback ) {
        if( src instanceof P.Sprite ) {
            src.clone().then( async( c ) =>{
                if( callback ) {
                    const _callback = callback.bind( c );
                    _callback();
                }
            });
        }
    }

    get preloadDone() {
        return this._preloadDone;
    }
    async _waitUntilPreloadDone() {
        if(this._preloadImagePromise.length > 0 ) {
            const _images = await Promise.all(this._preloadImagePromise);
            for(const v of _images) {
                this._loadedImages[v.name] = {'name': v.name, 'data': v.data };
            }    
        }
        if( this._preloadSoundPromise.length > 0 ) {
            const _sounds = await Promise.all(this._preloadSoundPromise);
            for(const v of _sounds) {
                this._loadedSounds[v.name] = {'name' : v.name, 'data': v.data };
            }    
        }
        if ( this._preloadFontPromise.length > 0 ) {
            const _fonts = await Promise.all( this._preloadFontPromise);
            for(const v of _fonts) {
                // Font を登録する
                document.fonts.add( v );
            }
        }

        this._preloadDone = true;
    }

    get Image () {
        return {
            "load": this.$loadImage.bind(this),
        }
    }
    get Sound () {
        return {
            "load": this.$loadSound.bind(this),
        }
    }

    $stopAll() {
        threads.stopThreadsInterval();
    }

    
    get Control(){
        return {
            "stopAll": this.$stopAll.bind(this),
        }
    }
}

export default PlayGround.getInstance();