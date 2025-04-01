const SVGParser = require('../svgParser/parser'); 
const ImageLoader = class {

    static get REGEX_DATA_IMAGE_URL() {
        return /^data:image\\/;
    }
    static get REGEX_SVG_DATA_IMAGE_URL() {
        return /^<svg\s/;
    }
    static get REGEX_SVG_DATA_IMAGE_FILE() {
        return /^.+\.svg$/;
    }
    static isSVG(image) {
        if(typeof image === 'string') {
            const dataImageUrl = image;
            if(dataImageUrl.match(ImageLoader.REGEX_SVG_DATA_IMAGE_URL)){
                return true;
            }
        }
        return false;
    }
    static async loadImage(image, name, translate={x:0,y:0}) {
        if(image) {
            if(typeof image === 'string') {
                if(image.match(ImageLoader.REGEX_SVG_DATA_IMAGE_FILE)){
                    let _text = await ImageLoader._svgText(image);
                    if(_text == "ERROR"){
                        throw "ローディングエラー。SVG画像データの指定を確認してください。("+image+")";
                    }
                    const parser = SVGParser.default;
                    const svgDoc = parser.parseFromString(_text);
                    const size = parser.getSize();
                    if(size.w > 480 && size.h > 360) {
                        const changed = parser.sizeChange(svgDoc,480,360,translate);
                        return {name:name, data: changed};    
                    }else{
                        return {name:name, data: _text};    
                    }
                }else{
                    const localUrl = image;
                    let _img = await ImageLoader._loadImage(localUrl);
                    if(_img == "ERROR"){
                        throw "イメージローディングエラー。画像データの指定を確認してください。("+localUrl+")";
                    }
                    return {name:name,data:_img};
                }
            }
        }
    }
    static async _loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = (e) => {
                //reject(e);
                resolve("ERROR");
            }    
            img.src = src;
        });
    }
    static async _svgText(image) {
        let svg = await fetch(image);
        let _text = await svg.text();
        if(_text.substring(0,4) != "<svg"){
            return "ERROR";
        }
        return _text;
    }

};

module.exports = ImageLoader;