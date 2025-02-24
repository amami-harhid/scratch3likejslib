const ImageEffective = class {
    /**
     * 色の効果
     */
    static get COLOR () {
        return 'color';
    }
    /**
     * 魚眼レンズの効果
     */
    static get FISHEYE () {
        return 'fisheye';
    }
    /**
     * 渦巻きの効果
     */
    static get WHIRL () {
        return 'whirl';
    }
    /**
     * ピクセル化の効果
     */
    static get PIXELATE () {
        return 'pixelate';
    }
    // モザイクの効果
    static get MOSAIC () {
        return 'mosaic';
    }
    // 明るさの効果
    static get BRIGHTNESS () {
        return 'brightness';
    }
    // 幽霊の効果
    static get GHOST () {
        return 'ghost';
    }
};

class SoundOption {
    static get VOLUME (){
        return "volume";
    }
    static get PITCH () {
        return "pitch";
    }
}
const RotationStyle = class {
    static get LEFT_RIGHT () {
        return 'left-right';
    }
    static get DONT_ROTATE () {
        return 'do-not-rotate';
    }
    static get ALL_AROUND () {
        return 'all-around';
    }    
}
module.exports = {ImageEffective, SoundOption, RotationStyle};