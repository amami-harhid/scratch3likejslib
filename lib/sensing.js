const Process = require('./process')
const Utils = require('./utils');
const Sensing = {



    enable: function() {
        const me = Process.default;
//        const render = me.renderer;
        /**
        * decimalRound - rounds a number too decimal points.
        *
        * @param {number} value - the value to round.
        * @param {number} points - how many decimal points to leave.
        */
        function decimalRound (value, points) {
          return Math.round(value * (10 ** points)) / (10 ** points)
        }
      
        /**
        * computeX - Computes centered x based on x extracted from event.
        */
        function computeX (x) {
          const mag = 1;//me.canvas.magnification / 100
          return decimalRound((x - (me.canvas.offsetLeft) - (me.stageWidth / 2)) / mag, 2)
        }
      
        /**
        * computeY - Computes centered y based on y extracted from event.
        */
        function computeY (y) {
          const mag = 1;// me.canvas.magnification / 100
          return decimalRound((-y + me.canvas.offsetTop + (me.stageHeight / 2)) / mag, 2)
        }
      
        document.addEventListener('keydown', (e) => {
          e.key && me.keysKey.indexOf(e.key.toLowerCase()) === -1 ? me.keysKey.push(e.key.toLowerCase()) : null
          e.code && me.keysCode.indexOf(e.code.toLowerCase()) === -1 ? me.keysCode.push(e.code.toLowerCase()) : null
        })
      
        document.addEventListener('keyup', (e) => {
          e.key ? me.keysKey = me.keysKey.filter((item) => item !== e.key.toLowerCase()) : null
          e.code ? me.keysCode = me.keysCode.filter((item) => item !== e.code.toLowerCase()) : null
        })
      
        me.canvas.addEventListener('mousemove', (e) => {
          me.mouseX = e.clientX; //computeX(e.clientX)
          me.mouseY = e.clientY; //computeY(e.clientY)
          e.stopPropagation();
        })
      
        me.canvas.addEventListener('touchmove', (e) => {
          me.mouseX = computeX(e.changedTouches[0].clientX)
          me.mouseY = computeY(e.changedTouches[0].clientY)
        }, { passive: true })
      
        me.canvas.addEventListener('mousedown', () => {
          me.mouseDown = true;
          e.stopPropagation();
        })
        me.canvas.addEventListener('mouseup', () => {
          me.mouseDown = false;
          e.stopPropagation();
        })
      
        me.canvas.addEventListener('touchstart', (e) => {
          me.mouseX = computeX(e.touches[0].clientX)
          me.mouseY = computeY(e.touches[0].clientY)
          me.mouseDown = true
        }, { passive: true })
      
        me.canvas.addEventListener('touchend', () => {
          me.mouseDown = false
          me.mouseX = null
          me.mouseY = null
        })
    }
}

module.exports = Sensing;