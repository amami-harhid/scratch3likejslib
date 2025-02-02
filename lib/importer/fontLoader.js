const FontLoader = class {

    static async fontLoad(url, name) {
        if(url) {
            const font = new FontFace(name, `url(${url})`);
            const _font = await font.load();
            return _font;
        }
        // 例外を起こすべきところ。
        throw('Scratch3LikeJS loadFont: empty url')
    }

};

module.exports = FontLoader;