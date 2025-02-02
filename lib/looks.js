const Looks = class {
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

module.exports = Looks;