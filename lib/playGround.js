const Element = require('./element');
const Env = require('./env');
const FontLoader = require('./importer/fontLoader');
const ImageLoader = require('./importer/imageLoader');
const NowLoading = require('./nowLoading');
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
        this._preloadDone = false;
        this._dataPool = {};

    }
    clearDataPool() {
        const _pool = this._dataPool;
        for (let key in _pool){ 
            delete this._dataPool[key]
        }
    }
    get loadedImages() {
        return this._loadedImages;
    }
    get loadedSounds() {
        return this._loadedSounds;
    }
    get dataPool() {
        return this._dataPool;
    }
    set dataPool(_dataPool) {
        this._dataPool = _dataPool;
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

    get stageWidth () {
        return this._render.stageWidth;
    }

    get stageHeight () {
        return this._render.stageHeight;
    }

    toScratchPosition(x, y) {
        // Base position -> canvas 
        const rate = this.renderRate;
        const _x = x * rate.x;
        const _y = y * rate.y;
        return {x: _x, y: _y};
    }

    toActualPosition( x, y ) {

        const rate = this.renderRate;
        const _x = x / rate.x;
        const _y = y / rate.y;
        return {x: _x, y: _y};

    }
    /**
     * change scratch position to local position
     * @param {*} x  scratch x position
     * @param {*} y  scratch y position
     * @returns local position
     */
    scratchToLocalPos( x, y ) {

        const w = this._render.stageWidth;
        const h = this._render.stageHeight;

        let localPosX = x + w / 2;
        let localPosY = h / 2 - y;
        return {x: localPosX, y: localPosY};
    }

    /**
     * change local position to scratch position
     * @param {*} x  local x position
     * @param {*} y  local y position
     * @returns scratch position
     */
    localToScratchPos( x, y ) {

        const w = this._render.stageWidth;
        const h = this._render.stageHeight;

        let scratchPosX = x - w / 2;
        let scratchPosY = h / 2 - y;

        return {x: scratchPosX, y: scratchPosY};

    }

    /**
     * get randering rate ( when resized )
     * @returns 
     */
    getRenderRate() {
        return this.renderRate;        
    }


    set flag ( flag ) {
        this._flag = flag;
    }

    get flag () {
        return this._flag;
    }

//    get wait () {
//    }
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
    async _start() {
        this.clearDataPool();
        console.log('befor _prepare');
        await this._prepare();
        console.log('befor _setting');
        await this._setting();
        console.log('after _setting');

    }
    /**
     * HTMLヘッダーtitle
     */
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
        mainTmp.style.zIndex = -1;
        mainTmp.style.position = 'absolute'
        mainTmp.style.touchAction = 'manipulation'
        mainTmp.style.width = `${innerWidth}px`
        mainTmp.style.height = `${innerHeight}px`

        document.body.appendChild(mainTmp);
        // ちょっとだけ待つ（ Now Loading を見せたいため )
        await Utils.wait(1000);
        this._preload();
        await this._waitUntilPreloadDone();   
        await Element.init();
        const main = this.main;
        main.classList.add(Element.DISPLAY_NONE);
        this._render = new Render();
        this.runtime = new Runtime();
        this.runtime.attachRenderer(this._render.renderer);    
//        this._prepareReload();
        this.clearDataPool();
        await this._prepare();
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

    }
    async _preload () {
        if( this.preload ) {
            this.preload( this );
        }
    }

    async _prepare () {
        // この時点で各種ローディングは終わっているので、NowLoadingを消す。
        this.mainTmp.remove();

        // Mainタグから非表示のクラスを除去しフラグとキャンバスを表示する
        const main = this.main;
        main.classList.remove(Element.DISPLAY_NONE);
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
    // Element.init() 内から呼び出される。
/*
    _drawingStart() {
        if( this._stage ) {
            const me = this;
            const pace = Env.pace;
            this._stage.update();
            setTimeout(async function(){
                for(;;) {
                    me._draw();
                    await Utils.wait(pace);
                }
            }, pace);
        }
    }
*/
    _draw () {
        if( this._stage ) {
            this._stage.update ();
            this._stage.draw();
            if( this.draw ) {
                this.draw();
            }
        }
    }
//    keyIsDown(key) {
//        return this.runtime.keyIsDown(key);
//    }

//    _prepareReload() {
//        const _reloadKickBinded = this._reloadKick.bind(this);
//        this.runtime.on('KEY_PRESSED', _reloadKickBinded);
//    }
//    _reloadKick( key ) {
//        if( key == 'Escape') {
//            // 別スレッドからリロードすると一発でリロードできる
//            setTimeout(function(){
//                window.location.reload( ); // ページの再読み込み
//            },10);            
//        }
//    }

    loadImage(imageUrl, name) {
        let _name ;
        if( name ) {
            _name = name;
        }else{
            _name = imageUrl.replace(/\.[^.]+$/)
        }
        const data = ImageLoader.loadImage(imageUrl, _name);
        this._preloadImagePromise.push(data);
        return data;
    }
    loadSound(soundUrl, name) {
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

    


}

export default PlayGround.getInstance();