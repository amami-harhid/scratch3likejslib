const Backdrops = require('./backdrops');
//const Canvas = require('./canvas');
//const Css = require('./css');
const Costumes = require('./costumes');
const Element = require('./element');
const Env = require('./env');
const EventEmitter = require('events').EventEmitter;
const ImageLoader = require('./importer/imageLoader');
const SoundLoader = require('./importer/soundLoader');
const FontLoader = require('./importer/fontLoader');
const js_beautify = require('js-beautify');
const Keyboard = require('./io/keyboard');
const Looks = require('./looks');
const MathUtils = require('./math-utils');
const NowLoading = require('./nowLoading');
const Render = require('./render');
const Rewrite = require('./rewrite');
const RotationStyle = require('./rotationStyle');
const Runtime = require('./engine/runtime');
//const Sensing = require('./sensing');
const Sounds = require('./sounds');
const Sprite = require('./sprite');
const Stage = require('./stage');
const StageLayering = require('./stageLayering');
const TextDraw = require('./text/textDraw');
const TextOption = require('./text/textOption');
const Utils = require('./utils');
const Monitors = require('./monitors');
const Process = class {

    static getInstance() {
        if( Process._instance == undefined ) {
            Process._instance = new Process();
        }
        return Process._instance;
    }

    constructor () {
        this._render = null;
        this._id = this._generateUUID();
        this._preloadImagePromise = [];
        this._preloadSoundPromise = [];
        this._preloadFontPromise = [];
        this._sounds = {}
        this._images = {};
        this._preloadDone = false;
    }
    get images() {
        return this._images;
    }
    get sounds() {
        return this._sounds;
    }
    _generateUUID () {
        return Utils.generateUUID();
    }
    get Backdrops () {
        return Backdrops;
    }
    get Costumes () {
        return Costumes;
    }
    get Element () {
        return Element;
    }
    get Env () {
        return Env;
    }
    get EventEmitter () {
        return EventEmitter;
    }
    get js_beautify () {
        return js_beautify;
    }
    get keyboard () {
        return Keyboard;
    }
    get Looks () {
        return Looks;
    }
    get Monitors () {
        return Monitors;
    }
    get NowLoading () {
        return NowLoading;
    }
    get MathUtils () {
        return MathUtils;
    }
    get Render () {
        return Render;
    }
    get Rewrite () {
        return Rewrite.default;
    }
    get RotationStyle () {
        return RotationStyle;
    }
    get Sounds () {
        return Sounds;
    }
    get Stage () {
        return Stage;
    }
    get StageLayering () {
        return StageLayering;
    }
    get Sprite () {
        return Sprite;
    }
    get TextDraw () {
        return TextDraw;
    }
    get TextOption () {
        return TextOption;
    }
    get Utils () {
        return Utils;
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

    /**
     * get rendering rate object
     */
    get renderRate() {
        const _rateX = this._render.stageWidth / this.canvas.width;
        const _rateY = this._render.stageHeight / this.canvas.height;
        return {x: _rateX, y:_rateY};
    }
    /**
     * mousePosition ( on canvas )
     */
    get mousePosition () {
        const rate = this.renderRate;
        const _mouseX = (this.stage.mouse.x - this.canvas.width/2 ) * rate.x;
        const _mouseY = (this.canvas.height/2 - this.stage.mouse.y) * rate.y;
        return {x: _mouseX, y: _mouseY};
    }

    get randomPoint () {
        const randomPointX = (Math.random()-0.5)*this.stageWidth;
        const randomPointY = (Math.random()-0.5)*this.stageHeight;
        return { x: randomPointX, y: randomPointY };
    }

    get randomDirection () {
        const direction = (Math.random()-0.5)* 2 * 360;
        if( direction > 180 ){
            return direction - 180;
        }
        return direction;
    }

    set flag ( flag ) {
        this._flag = flag;
    }

    get flag () {
        return this._flag;
    }

    async wait ( t ) {
        await Utils.wait( t );
    }

//    get wait () {
//    }

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
        // Now Loading 準備 OWARI

        this._preload();
        await this._waitUntilPreloadDone();
        await Element.init();
        const main = this.main;
        main.classList.add(Element.DISPLAY_NONE);
        this._render = new Render();
        this.runtime = new Runtime();
        this.runtime.attachRenderer(this._render.renderer);
        this._prepareReload();

        await this._prepare();
        await this._setting();
    }

    async _preload () {
        if( P.preload ) {
            P.preload();
        }
    }

    async _prepare () {
        // この時点で各種ローディングは終わっているので、NowLoadingを消す。
        this.mainTmp.remove();

        // Mainタグから非表示のクラスを除去しフラグとキャンバスを表示する
        const main = this.main;
        main.classList.remove(Element.DISPLAY_NONE);
        // prepareメソッドの実行を開始する
        if( P.prepare ) {
            await P.prepare();
            await P.Utils.wait(Env.pace);
            if( this._stage ) {
                this._stage.update();
                this._stage.draw();
            }    
        }
    }
    async _setting () {
        if( P.setting ) {
            await P.setting ();
        }
    }
    // Element.init() 内から呼び出される。
    _drawingStart() {
        if( this._stage ) {
            const me = this;
            const pace = this.Env.pace;
            this._stage.update();
            setTimeout(async function(){
                for(;;) {
                    me._draw();
                    await me.Utils.wait(pace);
                }
            }, pace);
        }
    }
    _draw () {
        if( this._stage ) {
            this._stage.update ();
            P._stage.draw();
            if( P.draw ) {
                P.draw();
            }
        }
    }
    getKeyIsDown(key) {
        return this.runtime.getKeyIsDown(key);
    }
    _prepareReload() {
        const _reloadKickBinded = this._reloadKick.bind(this);
        this.runtime.on('KEY_PRESSED', _reloadKickBinded);
    }
    _reloadKick( key ) {
        if( key == 'Escape') {
            // 別スレッドからリロードすると一発でリロードできる
            setTimeout(function(){
                window.location.reload( ); // ページの再読み込み
            },10);            
        }
    }

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
                this._images[v.name] = {'name': v.name, 'data': v.data };
            }    
        }
        if( this._preloadSoundPromise.length > 0 ) {
            const _sounds = await Promise.all(this._preloadSoundPromise);
            for(const v of _sounds) {
                this._sounds[v.name] = {'name' : v.name, 'data': v.data };
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
    async waitUntil( condition ) {
        for(;;) {
            if( condition() ) {
                break;
            }
            await Utils.wait(Env.pace);
        }
    }

    


}

export default Process.getInstance();