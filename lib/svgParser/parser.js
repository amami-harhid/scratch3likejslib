class SVGParser {
    
    static instance = null;
    static getInstance() {
        if(SVGParser.instance){
            return SVGParser.instance;
        }
        return new SVGParser();
    }
    /**
     * @constructor
     */
    constructor() {
        this.domParser = new DOMParser();
        this.serializer = new XMLSerializer();
        this.svgDoc = null;
    }
    /**
     * SVG Text をパースする
     * 
     * @param {string} svgText 
     * @return {Element} 
     */
    parseFromString(svgText) {
        const parsedSVGDoc = this.domParser.parseFromString(svgText, 'image/svg+xml');
        this.svgDoc = parsedSVGDoc.childNodes[0];
        return this.svgDoc;        
    }
    /**
     * 
     * @return {{w:number,h:number}}
     */
    getSize() {
        if(this.svgDoc){
            const element = this.svgDoc;
            const w = element.getAttribute('width');
            const h = element.getAttribute('height');
            const _w = `${w}`.replace('px', '');
            const _h = `${h}`.replace('px', '');
            return {w: Number(_w), h: Number(_h)};
        }
        return {w: 0, h: 0};
    }
    /**
     * 
     * @param {Element} svgDoc 
     * @param {number} w 
     * @param {number} h 
     * @param {object} translate 
     * @return {string} 変更後のsvgDoc文字列
     */
    sizeChange(svgDoc, w=480, h=360, 
                    translate={x:0, y:0}) {
        // svgタグ
        svgDoc.setAttribute('width', `${w}px`);
        svgDoc.setAttribute('height', `${h}px`);
        svgDoc.setAttribute('viewBox', `0 0 ${w} ${h}`);
        // transformをもつgTag
        // @type {NodeListOf<Element>}
        const gTagTransform = svgDoc.querySelectorAll('g[transform]');
        if(gTagTransform && gTagTransform.length && gTagTransform.length > 0){
            const translateX = translate.x;
            const translateY = translate.y;
            gTagTransform[0].setAttribute('transform', `translate(${translateX}, ${translateY})`);    
        }
        const changed = this.serializer.serializeToString(svgDoc);
        return changed;
    }
}
const svgParser = SVGParser.getInstance();
module.exports = svgParser;
