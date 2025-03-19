class SVGParser {
    
    static instance = null;
    static getInstance() {
        if(SVGParser.instance){
            return SVGParser.instance;
        }
        return new SVGParser();
    }
    constructor() {
        this.domParser = new DOMParser();
        this.serializer = new XMLSerializer();
    }
    
    /**
     * SVG Text をパースする
     * 
     * @param {*} svgText 
     * @returns parsedSVGDoc 
     */
    parseFromString(svgText) {
        const parsedSVGDoc = this.domParser.parseFromString(svgText, 'image/svg+xml');
        return parsedSVGDoc.childNodes[0];        
    }
    sizeChange(svgDoc, w=480, h=360, translate={x:0, y:0}) {
        // svgタグ
        svgDoc.setAttribute('width', `${w}px`);
        svgDoc.setAttribute('height', `${h}px`);
        svgDoc.setAttribute('viewBox', `0 0 ${w} ${h}`);
        // transformをもつgTag
        const translateX = translate.x;
        const translateY = translate.y;
        const gTagTransform = svgDoc.querySelectorAll('g[transform]');
        gTagTransform[0].setAttribute('transform', `translate(${translateX}, ${translateY})`);
        const changed = this.serializer.serializeToString(svgDoc);
        return changed;
    }


}

export default SVGParser.getInstance();