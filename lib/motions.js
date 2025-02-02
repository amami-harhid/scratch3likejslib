const Element = require('./element'); 
const Utils = require('./utils');
const Motions = class {

    static moveSteps( _steps, myElement ) {
        if( Utils.isNumber(_steps)) {
            if( myElement instanceof Element ) {
                const _position = myElement.position;
                let _degree = this._direction;
        
                if ( Math.abs(_degree)  == 90) {
                    _position.x += ((_degree > 0)? 1: -1) * _step;
                    return;
                }
                if ( _degree == 0 || _degree == 180) {
                    _position.y += _step * ((_degree == 0)? 1 : -1);
                    return;
                }
                const _radian = (_degree / 180.0) * Math.PI;
                const _x = Math.sin(_radian) * _step;
                const _y = Math.cos(_radian) * _step;
                _position.x += _x;
                _position.y += _y;
                return;
            }
        }
        // Do nothing;
    }
    static _calcDegree(_degree) {
        if( Utils.isNumber(_degree)) {
            const _d = _degree % 360;
            if( _d > 0) {
                if( _d > 180) {
                    _d = _d - 360;
                }
                return _d;
            }else if( _d < 0) {
                if( _d < -180) {
                    _d = _d + 360;
                }
                return _d;
            }
            return _d;
        }
        // Do nothing.
    }

};

module.exports = Motions;