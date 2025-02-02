const Canvas = require('../canvas');
//const Env = require('../env');
//const Entity = require('./entity');
const Process = require('../process');
const StageLayering = require('../stageLayering');
const TextOption = require('./textOption');
const Utils = require('../utils');

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