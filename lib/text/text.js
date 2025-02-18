
const Text = class  {
    constructor( text ) {
        this._text = text;
        this._options = [];
    }

    addTextOption ( textOption ) {
        this._options.add( textOption );
    }

};

module.exports = Text;