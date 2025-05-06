const NowLoading = require('./nowLoading');
const Element = require('./element');
const Env = require('./env');
const FontLoader = require('./importer/fontLoader');
const ImageLoader = require('./importer/imageLoader');
const libs = require('./libs');
const Render = require("./render");
const Runtime = require('./engine/runtime');
const SoundLoader = require('./importer/soundLoader');
const Stage = require('./stage');
const threads = require('./threads');
const Utils = require('./utils');

class PlayGround {
    static _instance;

    /**
     * 
     * @return {PlayGround}
     */
    static getInstance() {
        if( PlayGround._instance == undefined ) {
            PlayGround._instance = new PlayGround();
        }
        return PlayGround._instance;
    }
    constructor () {
        this._render = null;
        this._id = this._generateUUID();
        this._runtime = null;
        this._preloadImagePromise = [];
        this._preloadSoundPromise = [];
        this._preloadFontPromise = [];
        this._loadedImages = {};
        this._loadedSounds = {};
//        this._dataPools = {};
        this._preloadDone = false;
        this._prepaeDone = false;
        this._stage = null;
        this._monitors = null;
        this.runningGame = false;
        this._canvas = null;
        this._flag = null;
        this.mainTmp = null;
        this.main = undefined;
        this.preload = null;
        this.prepare = null;
        this.setting = null;
        this.draw = null;
        this._textCanvas = null;
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
    // clearPools() {
    //     const _pool = this._dataPoolSprite;
    //     for (let key in _pool){ 
    //         delete this._dataPoolSprite[key]
    //     }
    // }
    get loadedImages() {
        return this._loadedImages;
    }
    get loadedSounds() {
        return this._loadedSounds;
    }
    // get dataPools() {
    //     return this._dataPools;
    // }
    // set dataPools(_dataPool) {
    //     this._dataPools = _dataPool;
    // }

    get Libs () {
        return libs.default;
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
        return NowLoading.default;
    }
    get threads () {
        return threads;
    }
    get render () {
        if(this._render == undefined) throw 'render undefined error';
        return this._render;
    }
    set render( render ) {
        // _init() の中で設定される。
        this._render = render;
    }

    set runtime(runtime) {
        this._runtime = runtime;
    }

    get runtime()  {
        if(this._runtime == undefined) throw 'runtime undefined error';
        return this._runtime;
    }

    set stage ( stage ) {
        this._stage = stage;
    }

    get stage () {
        if( this._stage == undefined) throw 'stage undefined error';
        return this._stage;
    }

    set canvas(canvas) {
        this._canvas = canvas;
    }
    get canvas() {
        if(this._canvas == undefined) throw 'canvas undefined error';
        return this._canvas;
    }
    set textCanvas(textCanvas) {
        this._textCanvas = textCanvas;
    }
    get textCanvas() {
        if(this._textCanvas == undefined) throw 'textCanvas undefined error';
        return this._textCanvas;
    }
    get $stageWidth () {
        if(this._render){
            return this._render.stageWidth;
        }
        throw 'unable calclulate stageWidth';
    }

    get $stageHeight () {
        if(this._render){
            return this._render.stageHeight;
        }
        throw 'unable calclulate stageHeight';
    }


    /**
     * get randering rate ( when resized )
     * @returns 
     */
    getRenderRate() {
        return libs.renderRate;        
    }


    set flag ( flag ) {
        this._flag = flag;
    }

    get flag () {
        if(this._flag){
            return this._flag;
        }
        throw 'unable to get flag element';
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

        // Now Loading 準備 START
        const mainTmp = document.createElement('main');
        this.mainTmp = mainTmp;
        mainTmp.id = 'mainTmp';
        mainTmp.classList.add('nowLoading');
        mainTmp.style.zIndex = '9999' ; // 一番手前 ( 本体main z-index= 999)
        mainTmp.style.position = 'absolute'
        mainTmp.style.touchAction = 'manipulation'
        mainTmp.style.width = `${innerWidth}px`
        mainTmp.style.height = `${innerHeight}px`

        document.body.appendChild(mainTmp);
        await Utils.wait(100);
        this._preload();
        await this._waitUntilPreloadDone();

        this.main = await Element.init();
        const main = this.main;
        if(main == undefined){
            throw 'unable to add main classList';
        }
        main.classList.add(Element.DISPLAY_NONE);
        this._render = new Render();
        this._runtime = new Runtime();
        if(this._render == undefined || this._render.renderer == undefined){
            throw 'unable to execute attachRenderer';
        }
        this._runtime.attachRenderer(this._render.renderer);    

        await this._prepare();
        this._prepaeDone = true;
        await this._setting();
        await Element.flagInit();
        //await this._setting();

        this.runningGame = false;
        this._runtime.on('RUNNING_GAME', ()=>{
            this.runningGame = true;
        });
        this._runtime.on('PAUSING_GAME', ()=>{
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
            _name = imageUrl.replace(/\.[^.]+$/, '');
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
            _name = soundUrl.replace(/\.[^.]+$/, '');
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
        if( src instanceof libs.Sprite ) {
            const _src = src;
            _src.$clone().then( async( c ) =>{
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
//const playGround = PlayGround.getInstance();

export default PlayGround.getInstance()