/**
 * @module
 */
let exports = {};


/**
 * Cast to object.
 * @param {Object} param
 * @return {Object}
 */
exports.obj = function(param) {
  return param;
};


/**
 * @type {boolean|undefined}
 * @private
 */
exports.supportsImageRenderingPixelatedResult_ = undefined;


/**
 * @type {string|undefined}
 * @private
 */
exports.imageRenderingValueResult_ = undefined;


/**
 * @return {boolean}
 */
exports.supportsImageRenderingPixelated = function() {
  if (exports.supportsImageRenderingPixelatedResult_ === undefined) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('style', 'image-rendering: -moz-crisp-edges; image-rendering: pixelated;');
    // canvas.style.imageRendering will be undefined, null or an
    // empty string on unsupported browsers.
    const tmp = canvas.style['imageRendering']; // non standard
    exports.supportsImageRenderingPixelatedResult_ = !!tmp;
    if (exports.supportsImageRenderingPixelatedResult_) {
      exports.imageRenderingValueResult_ = tmp;
    }
  }
  return exports.supportsImageRenderingPixelatedResult_;
};


/**
 * @return {string}
 */
exports.imageRenderingValue = function() {
  exports.supportsImageRenderingPixelated();
  return exports.imageRenderingValueResult_ || '';
};

export default exports;