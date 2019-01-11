/**
 * @module
 */
import googAsserts from 'goog/asserts';
import olBase from 'ol';
import olObservable from 'ol/Observable';
import olEvents from 'ol/events';
import olLayerGroup from 'ol/layer/Group';

const exports = function(map, scene) {
  /**
   * @type {!ol.Map}
   * @protected
   */
  this.map = map;

  /**
   * @type {ol.View}
   * @protected
   */
  this.view = map.getView();

  /**
   * @type {!Cesium.Scene}
   * @protected
   */
  this.scene = scene;

  /**
   * @type {ol.Collection.<ol.layer.Base>}
   * @protected
   */
  this.olLayers = map.getLayerGroup().getLayers();

  /**
   * @type {ol.layer.Group}
   */
  this.mapLayerGroup = map.getLayerGroup();

  /**
   * Map of OpenLayers layer ids (from ol.getUid) to the Cesium ImageryLayers.
   * Null value means, that we are unable to create equivalent layers.
   * @type {Object.<string, ?Array.<T>>}
   * @protected
   */
  this.layerMap = {};

  /**
   * Map of listen keys for OpenLayers layer layers ids (from ol.getUid).
   * @type {!Object.<string, Array<ol.EventsKey>>}
   * @protected
   */
  this.olLayerListenKeys = {};

  /**
   * Map of listen keys for OpenLayers layer groups ids (from ol.getUid).
   * @type {!Object.<string, !Array.<ol.EventsKey>>}
   * @private
   */
  this.olGroupListenKeys_ = {};
};


/**
 * Destroy all and perform complete synchronization of the layers.
 * @api
 */
exports.prototype.synchronize = function() {
  this.destroyAll();
  this.addLayers_(this.mapLayerGroup);
};


/**
 * Order counterparts using the same algorithm as the Openlayers renderer:
 * z-index then original sequence order.
 * @protected
 */
exports.prototype.orderLayers = function() {
  // Ordering logics is handled in subclasses.
};


/**
 * Add a layer hierarchy.
 * @param {ol.layer.Base} root
 * @private
 */
exports.prototype.addLayers_ = function(root) {
  /** @type {Array<olcsx.LayerWithParents>} */
  const fifo = [{
    layer: root,
    parents: []
  }];
  while (fifo.length > 0) {
    const olLayerWithParents = fifo.splice(0, 1)[0];
    const olLayer = olLayerWithParents.layer;
    const olLayerId = olBase.getUid(olLayer).toString();
    this.olLayerListenKeys[olLayerId] = [];
    googAsserts.assert(!this.layerMap[olLayerId]);

    let cesiumObjects = null;
    if (olLayer instanceof olLayerGroup) {
      this.listenForGroupChanges_(olLayer);
      if (olLayer !== this.mapLayerGroup) {
        cesiumObjects = this.createSingleLayerCounterparts(olLayerWithParents);
      }
      if (!cesiumObjects) {
        olLayer.getLayers().forEach((l) => {
          if (l) {
            const newOlLayerWithParents = {
              layer: l,
              parents: olLayer === this.mapLayerGroup ?
                [] :
                [olLayerWithParents.layer].concat(olLayerWithParents.parents)
            };
            fifo.push(newOlLayerWithParents);
          }
        });
      }
    } else {
      cesiumObjects = this.createSingleLayerCounterparts(olLayerWithParents);
    }
    // add Cesium layers
    if (cesiumObjects) {
      this.layerMap[olLayerId] = cesiumObjects;
      this.olLayerListenKeys[olLayerId].push(olEvents.listen(olLayer, 'change:zIndex', this.orderLayers, this));
      cesiumObjects.forEach(function(cesiumObject) {
        this.addCesiumObject(cesiumObject);
      }, this);
    }
  }

  this.orderLayers();
};


/**
 * Remove and destroy a single layer.
 * @param {ol.layer.Layer} layer
 * @return {boolean} counterpart destroyed
 * @private
 */
exports.prototype.removeAndDestroySingleLayer_ = function(layer) {
  const uid = olBase.getUid(layer).toString();
  const counterparts = this.layerMap[uid];
  if (!!counterparts) {
    counterparts.forEach(function(counterpart) {
      this.removeSingleCesiumObject(counterpart, false);
      this.destroyCesiumObject(counterpart);
    }, this);
    this.olLayerListenKeys[uid].forEach(olObservable.unByKey);
    delete this.olLayerListenKeys[uid];
  }
  delete this.layerMap[uid];
  return !!counterparts;
};


/**
 * Unlisten a single layer group.
 * @param {ol.layer.Group} group
 * @private
 */
exports.prototype.unlistenSingleGroup_ = function(group) {
  if (group === this.mapLayerGroup) {
    return;
  }
  const uid = olBase.getUid(group).toString();
  const keys = this.olGroupListenKeys_[uid];
  keys.forEach((key) => {
    olObservable.unByKey(key);
  });
  delete this.olGroupListenKeys_[uid];
  delete this.layerMap[uid];
};


/**
 * Remove layer hierarchy.
 * @param {ol.layer.Base} root
 * @private
 */
exports.prototype.removeLayer_ = function(root) {
  if (!!root) {
    const fifo = [root];
    while (fifo.length > 0) {
      const olLayer = fifo.splice(0, 1)[0];
      const done = this.removeAndDestroySingleLayer_(olLayer);
      if (olLayer instanceof olLayerGroup) {
        this.unlistenSingleGroup_(olLayer);
        if (!done) {
          // No counterpart for the group itself so removing
          // each of the child layers.
          olLayer.getLayers().forEach((l) => {
            fifo.push(l);
          });
        }
      }
    }
  }
};


/**
 * Register listeners for single layer group change.
 * @param {ol.layer.Group} group
 * @private
 */
exports.prototype.listenForGroupChanges_ = function(group) {
  const uuid = olBase.getUid(group).toString();

  googAsserts.assert(this.olGroupListenKeys_[uuid] === undefined);

  const listenKeyArray = [];
  this.olGroupListenKeys_[uuid] = listenKeyArray;

  // only the keys that need to be relistened when collection changes
  let contentKeys = [];
  const listenAddRemove = (function() {
    const collection = group.getLayers();
    if (collection) {
      contentKeys = [
        collection.on('add', function(event) {
          this.addLayers_(event.element);
        }, this),
        collection.on('remove', function(event) {
          this.removeLayer_(event.element);
        }, this)
      ];
      listenKeyArray.push(...contentKeys);
    }
  }).bind(this);

  listenAddRemove();

  listenKeyArray.push(group.on('change:layers', (e) => {
    contentKeys.forEach((el) => {
      const i = listenKeyArray.indexOf(el);
      if (i >= 0) {
        listenKeyArray.splice(i, 1);
      }
      olObservable.unByKey(el);
    });
    listenAddRemove();
  }));
};


/**
 * Destroys all the created Cesium objects.
 * @protected
 */
exports.prototype.destroyAll = function() {
  this.removeAllCesiumObjects(true); // destroy
  let objKey;
  for (objKey in this.olGroupListenKeys_) {
    const keys = this.olGroupListenKeys_[objKey];
    keys.forEach(olObservable.unByKey);
  }
  for (objKey in this.olLayerListenKeys) {
    this.olLayerListenKeys[objKey].forEach(olObservable.unByKey);
  }
  this.olGroupListenKeys_ = {};
  this.olLayerListenKeys = {};
  this.layerMap = {};
};


/**
 * Adds a single Cesium object to the collection.
 * @param {!T} object
 * @abstract
 * @protected
 */
exports.prototype.addCesiumObject = function(object) {};


/**
 * @param {!T} object
 * @abstract
 * @protected
 */
exports.prototype.destroyCesiumObject = function(object) {};


/**
 * Remove single Cesium object from the collection.
 * @param {!T} object
 * @param {boolean} destroy
 * @abstract
 * @protected
 */
exports.prototype.removeSingleCesiumObject = function(object, destroy) {};


/**
 * Remove all Cesium objects from the collection.
 * @param {boolean} destroy
 * @abstract
 * @protected
 */
exports.prototype.removeAllCesiumObjects = function(destroy) {};


/**
 * @param {olcsx.LayerWithParents} olLayerWithParents
 * @return {?Array.<T>}
 * @abstract
 * @protected
 */
exports.prototype.createSingleLayerCounterparts = function(olLayerWithParents) {};
export default exports;