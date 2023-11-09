// 'use strict';

/****************************************

	common.js -- 18.06.21 -- by spvog

****************************************/

var SCALE = (function () {
	return {
		getContainer: function () {
			this.containerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			this.containerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		},
		getZoomrate: function () {
			var horizontalZoomRate = this.containerWidth / this.element.clientWidth,
				verticalZoomRate = this.containerHeight / this.element.clientHeight,
				zoomRate = ((this.element.clientWidth * verticalZoomRate) > this.containerWidth) ? horizontalZoomRate : verticalZoomRate;

			return zoomRate;
		},
		set: function (target) {console.log('SCALE ------>');
			this.getContainer();

			this.element = target;
			this.zoomRate = this.getZoomrate();
			this.left = (this.containerWidth - (this.element.clientWidth * this.zoomRate)) / 2;

			if (parent === window) this.setScale();
			// this.setScale();
		},
		setScale: function (zoomRate, left) {
			this.element.style.transform = 'scale('+this.zoomRate+')';
			this.element.style.MsTransform = 'scale('+this.zoomRate+')';
			this.element.style.MozTransform = 'scale('+this.zoomRate+')';
			this.element.style.WebkitTransform = 'scale('+this.zoomRate+')';
			this.element.style.transformOrigin = '0% 0%';
			this.element.style.MsTransformOrigin = '0% 0%';
			this.element.style.MozTransformOrigin = '0% 0%';
			this.element.style.WebkitTransformOrigin = '0% 0%';
			// this.element.style.left = this.left + 'px';
		},
		reSet: function (target) {
			this.getContainer();
			this.set(target);
		}
	}
})();
SCALE.set(document.getElementById('container'));
window.addEventListener('resize', function(){
	SCALE.reSet(document.getElementById('container'));
});

var ZOOM = (function () {
	var zoom = {
		rate: SCALE.zoomRate,
		set: function () {
			var self = this;

			var findZoom = setInterval(function(){
				if (parent.ZOOMVALUE) {
					clearInterval(findZoom);
					self.rate = parent.ZOOMVALUE;
				}
			}, 10);
		}
	}
	zoom.set();
	return zoom;
})();

// Coding Helper START --------------------------------------------------------------//
function log (log) {
	var div = (document.querySelector('.logBox')) ? document.querySelector('.logBox') : create({tag: 'div', className: 'logBox', css: {
		position: 'absolute',
		top: document.querySelectorAll('.logBox').length * 20 + 'px',
		left: '0',
		zIndex: '100'
	}});
	// console.log(log)
	// div.innerHTML = log;
}
function sort (array) { array.sort(function (a, b) { return a - b; }); }
function getRealOffsetTop (o)  { return o ? o.offsetTop + getRealOffsetTop(o.offsetParent) : 0; }
function getRealOffsetLeft (o) { return o ? o.offsetLeft + getRealOffsetLeft(o.offsetParent) : 0; }
function convertArray (elements) {
	for (var i = 0, array = []; i < elements.length; i++) array.push(elements[i]);
	return array;
}
function create (opt) {
	var element = document.createElement(opt.tag);

	if (opt.id) element.id = opt.id;
	if (opt.className) element.className = opt.className;
	if (opt.css) {
		for (var idx in opt.css) element.style[idx] = opt.css[idx];
	}

	if (opt.target) opt.target.appendChild(element);
	else document.body.appendChild(element);

	return element;
}
function loadScriptFile (cssSrc, callBack) {
	var script = document.createElement('script');
	script.src = cssSrc;

	if (callBack) {
		script.onload = function () {
			callBack();
		};
	}
	document.body.appendChild(script);
}
// Coding Helper END --------------------------------------------------------------//

// Polyfill START ------------------------------------------------------------------//
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1. 
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }
    
    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

// Polyfill END ------------------------------------------------------------------//