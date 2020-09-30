/**
 * @module ol/renderer/canvas/VectorTileLayer
 */
import {getUid} from '../../util.js';
import TileState from '../../TileState.js';
import ViewHint from '../../ViewHint.js';
import {listen, unlistenByKey} from '../../events.js';
import EventType from '../../events/EventType.js';
import {buffer, containsCoordinate, equals, getIntersection, intersects, containsExtent, getWidth, getTopLeft} from '../../extent.js';
import VectorTileRenderType from '../../layer/VectorTileRenderType.js';
import ReplayType from '../../render/canvas/BuilderType.js';
import CanvasBuilderGroup from '../../render/canvas/BuilderGroup.js';
import CanvasTileLayerRenderer from './TileLayer.js';
import {toSize} from '../../size.js';
import {getSquaredTolerance as getSquaredRenderTolerance, renderFeature} from '../vector.js';
import {
  apply as applyTransform,
  create as createTransform,
  reset as resetTransform,
  scale as scaleTransform,
  translate as translateTransform,
  multiply,
  scale
} from '../../transform.js';
import CanvasExecutorGroup, {replayDeclutter} from '../../render/canvas/ExecutorGroup.js';
import {clear} from '../../obj.js';
import {createHitDetectionImageData, hitDetect} from '../../render/canvas/hitdetect.js';


/**
 * @type {!Object<string, Array<import("../../render/canvas/BuilderType.js").default>>}
 */
const IMAGE_REPLAYS = {
  'image': [ReplayType.POLYGON, ReplayType.CIRCLE,
    ReplayType.LINE_STRING, ReplayType.IMAGE, ReplayType.TEXT],
  'hybrid': [ReplayType.POLYGON, ReplayType.LINE_STRING]
};


/**
 * @type {!Object<string, Array<import("../../render/canvas/BuilderType.js").default>>}
 */
const VECTOR_REPLAYS = {
  'image': [ReplayType.DEFAULT],
  'hybrid': [ReplayType.IMAGE, ReplayType.TEXT, ReplayType.DEFAULT]
};


/**
 * @classdesc
 * Canvas renderer for vector tile layers.
 * @api
 */
class CanvasVectorTileLayerRenderer extends CanvasTileLayerRenderer {

  /**
   * @param {import("../../layer/VectorTile.js").default} layer VectorTile layer.
   */
  constructor(layer) {
    super(layer);

    /** @private */
    this.boundHandleStyleImageChange_ = this.handleStyleImageChange_.bind(this);

    /**
     * @private
     * @type {boolean}
     */
    this.dirty_ = false;

    /**
     * @private
     * @type {number}
     */
    this.renderedLayerRevision_;

    /**
     * @private
     * @type {import("../../transform").Transform}
     */
    this.renderedPixelToCoordinateTransform_ = null;

    /**
     * @private
     * @type {number}
     */
    this.renderedRotation_;

    /**
     * @private
     * @type {!Object<string, import("../../VectorRenderTile.js").default>}
     */
    this.renderTileImageQueue_ = {};

    /**
     * @type {Object<string, import("../../events.js").EventsKey>}
     */
    this.tileListenerKeys_ = {};

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.tmpTransform_ = createTransform();
  }

  /**
   * @param {import("../../VectorRenderTile.js").default} tile Tile.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../proj/Projection").default} projection Projection.
   * @param {boolean} queue Queue tile for rendering.
   * @return {boolean|undefined} Tile needs to be rendered.
   */
  prepareTile(tile, pixelRatio, projection, queue) {
    let render;
    const tileUid = getUid(tile);
    const state = tile.getState();
    if (((state === TileState.LOADED && tile.hifi) ||
        state === TileState.ERROR || state === TileState.ABORT) &&
        tileUid in this.tileListenerKeys_) {
      unlistenByKey(this.tileListenerKeys_[tileUid]);
      delete this.tileListenerKeys_[tileUid];
    }
    if (state === TileState.LOADED || state === TileState.ERROR) {
      this.updateExecutorGroup_(tile, pixelRatio, projection);
      if (this.tileImageNeedsRender_(tile, pixelRatio, projection)) {
        render = true;
        if (queue) {
          this.renderTileImageQueue_[tileUid] = tile;
        }
      }
    }
    return render;
  }

  /**
   * @inheritDoc
   */
  getTile(z, x, y, frameState) {
    const tile = /** @type {import("../../VectorRenderTile.js").default} */ (super.getTile(z, x, y, frameState));
    const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    const resolution = viewState.resolution;
    const projection = viewState.projection;
    if (tile.getState() < TileState.LOADED) {
      tile.wantedResolution = resolution;
      const tileUid = getUid(tile);
      if (!(tileUid in this.tileListenerKeys_)) {
        const listenerKey = listen(tile, EventType.CHANGE, this.prepareTile.bind(this, tile, pixelRatio, projection, true));
        this.tileListenerKeys_[tileUid] = listenerKey;
      }
    } else {
      const viewHints = frameState.viewHints;
      const hifi = !(viewHints[ViewHint.ANIMATING] || viewHints[ViewHint.INTERACTING]);
      if (hifi || !tile.wantedResolution) {
        tile.wantedResolution = resolution;
      }
      const render = this.prepareTile(tile, pixelRatio, projection, false);
      if (render) {
        this.renderTileImage_(tile, frameState);
      }
    }
    return tile;
  }

  /**
   * @inheritdoc
   */
  isDrawableTile(tile) {
    return super.isDrawableTile(tile) && tile.hasContext(this.getLayer());
  }

  /**
   * @inheritDoc
   */
  getTileImage(tile) {
    return tile.getImage(this.getLayer());
  }

  /**
   * @inheritDoc
   */
  prepareFrame(frameState) {
    const layerRevision = this.getLayer().getRevision();
    if (this.renderedLayerRevision_ != layerRevision) {
      this.renderedTiles.length = 0;
    }
    this.renderedLayerRevision_ = layerRevision;
    return super.prepareFrame(frameState);
  }

  /**
   * @param {import("../../VectorRenderTile.js").default} tile Tile.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../proj/Projection.js").default} projection Projection.
   * @private
   */
  updateExecutorGroup_(tile, pixelRatio, projection) {
    const layer = /** @type {import("../../layer/VectorTile.js").default} */ (this.getLayer());
    const revision = layer.getRevision();
    const renderOrder = layer.getRenderOrder() || null;

    const resolution = tile.wantedResolution;
    const builderState = tile.getReplayState(layer);
    if (!builderState.dirty && builderState.renderedResolution === resolution &&
        builderState.renderedRevision == revision &&
        builderState.renderedRenderOrder == renderOrder && builderState.renderedZ === tile.sourceZ) {
      return;
    }

    const source = layer.getSource();
    const sourceTileGrid = source.getTileGrid();
    const tileGrid = source.getTileGridForProjection(projection);
    const tileExtent = tileGrid.getTileCoordExtent(tile.wrappedTileCoord);

    const sourceTiles = source.getSourceTiles(pixelRatio, projection, tile);
    const layerUid = getUid(layer);
    const executorGroups = tile.executorGroups[layerUid];
    if (executorGroups) {
      for (let i = 0, ii = executorGroups.length; i < ii; ++i) {
        executorGroups[i].dispose();
      }
    }
    tile.hitDetectionImageData = null;
    tile.executorGroups[layerUid] = [];
    for (let t = 0, tt = sourceTiles.length; t < tt; ++t) {
      const sourceTile = sourceTiles[t];
      if (sourceTile.getState() != TileState.LOADED) {
        continue;
      }
      const sourceTileCoord = sourceTile.tileCoord;
      const sourceTileExtent = sourceTileGrid.getTileCoordExtent(sourceTileCoord);
      const sharedExtent = getIntersection(tileExtent, sourceTileExtent);
      const bufferedExtent = equals(sourceTileExtent, sharedExtent) ? null :
        buffer(sharedExtent, layer.getRenderBuffer() * resolution, this.tmpExtent);
      builderState.dirty = false;
      const builderGroup = new CanvasBuilderGroup(0, sharedExtent, resolution,
        pixelRatio, layer.getDeclutter());
      const squaredTolerance = getSquaredRenderTolerance(resolution, pixelRatio);

      /**
       * @param {import("../../Feature.js").FeatureLike} feature Feature.
       * @this {CanvasVectorTileLayerRenderer}
       */
      const render = function(feature) {
        let styles;
        const styleFunction = feature.getStyleFunction() || layer.getStyleFunction();
        if (styleFunction) {
          styles = styleFunction(feature, resolution);
        }
        if (styles) {
          const dirty = this.renderFeature(feature, squaredTolerance, styles, builderGroup);
          this.dirty_ = this.dirty_ || dirty;
          builderState.dirty = builderState.dirty || dirty;
        }
      };

      const features = sourceTile.getFeatures();
      if (renderOrder && renderOrder !== builderState.renderedRenderOrder) {
        features.sort(renderOrder);
      }
      for (let i = 0, ii = features.length; i < ii; ++i) {
        const feature = features[i];
        if (!bufferedExtent || intersects(bufferedExtent, feature.getGeometry().getExtent())) {
          render.call(this, feature);
        }
      }
      const executorGroupInstructions = builderGroup.finish();
      // no need to clip when the render tile is covered by a single source tile
      const replayExtent = layer.getDeclutter() && sourceTiles.length === 1 ?
        null :
        sharedExtent;
      const renderingReplayGroup = new CanvasExecutorGroup(replayExtent, resolution,
        pixelRatio, source.getOverlaps(), executorGroupInstructions, layer.getRenderBuffer());
      tile.executorGroups[layerUid].push(renderingReplayGroup);
    }
    builderState.renderedRevision = revision;
    builderState.renderedZ = tile.sourceZ;
    builderState.renderedRenderOrder = renderOrder;
    builderState.renderedResolution = resolution;
  }

  /**
   * @inheritDoc
   */
  forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, declutteredFeatures) {
    const resolution = frameState.viewState.resolution;
    const rotation = frameState.viewState.rotation;
    hitTolerance = hitTolerance == undefined ? 0 : hitTolerance;
    const layer = /** @type {import("../../layer/VectorTile.js").default} */ (this.getLayer());
    const declutter = layer.getDeclutter();
    const source = layer.getSource();
    const tileGrid = source.getTileGridForProjection(frameState.viewState.projection);
    /** @type {!Object<string, boolean>} */
    const features = {};

    const renderedTiles = /** @type {Array<import("../../VectorRenderTile.js").default>} */ (this.renderedTiles);

    let found;
    let i, ii;
    for (i = 0, ii = renderedTiles.length; i < ii; ++i) {
      const tile = renderedTiles[i];
      const tileExtent = tileGrid.getTileCoordExtent(tile.wrappedTileCoord);
      const tileContainsCoordinate = containsCoordinate(tileExtent, coordinate);

      if (!declutter) {
        // When not decluttering, we only need to consider the tile that contains the given
        // coordinate, because each feature will be rendered for each tile that contains it.
        if (!tileContainsCoordinate) {
          continue;
        }
      }
      const executorGroups = tile.executorGroups[getUid(layer)];
      for (let t = 0, tt = executorGroups.length; t < tt; ++t) {
        const executorGroup = executorGroups[t];
        found = found || executorGroup.forEachFeatureAtCoordinate(coordinate, resolution, rotation, hitTolerance,
          /**
           * @param {import("../../Feature.js").FeatureLike} feature Feature.
           * @return {?} Callback result.
           */
          function(feature) {
            if (tileContainsCoordinate || (declutteredFeatures && declutteredFeatures.indexOf(feature) !== -1)) {
              let key = feature.getId();
              if (key === undefined) {
                key = getUid(feature);
              }
              if (!(key in features)) {
                features[key] = true;
                return callback(feature, layer);
              }
            }
          }, layer.getDeclutter() ? declutteredFeatures : null);
      }
    }
    return found;
  }

  /**
   * @inheritDoc
   */
  getFeatures(pixel) {
    return new Promise(function(resolve, reject) {
      const layer = /** @type {import("../../layer/VectorTile.js").default} */ (this.getLayer());
      const source = layer.getSource();
      const projection = this.renderedProjection;
      const projectionExtent = projection.getExtent();
      const resolution = this.renderedResolution;
      const tileGrid = source.getTileGridForProjection(projection);
      const coordinate = applyTransform(this.renderedPixelToCoordinateTransform_, pixel.slice());
      const tileCoord = tileGrid.getTileCoordForCoordAndResolution(coordinate, resolution);
      let tile;
      for (let i = 0, ii = this.renderedTiles.length; i < ii; ++i) {
        if (tileCoord.toString() === this.renderedTiles[i].tileCoord.toString()) {
          tile = this.renderedTiles[i];
          if (tile.getState() === TileState.LOADED && tile.hifi) {
            const extent = tileGrid.getTileCoordExtent(tile.tileCoord);
            if (source.getWrapX() && projection.canWrapX() && !containsExtent(projectionExtent, extent)) {
              const worldWidth = getWidth(projectionExtent);
              const worldsAway = Math.floor((coordinate[0] - projectionExtent[0]) / worldWidth);
              coordinate[0] -= (worldsAway * worldWidth);
            }
            break;
          }
          tile = undefined;
        }
      }
      if (!tile) {
        resolve([]);
        return;
      }
      const extent = tileGrid.getTileCoordExtent(tile.wrappedTileCoord);
      const corner = getTopLeft(extent);
      const tilePixel = [
        (coordinate[0] - corner[0]) / resolution,
        (corner[1] - coordinate[1]) / resolution
      ];
      const features = tile.getSourceTiles().reduce(function(accumulator, sourceTile) {
        return accumulator.concat(sourceTile.getFeatures());
      }, []);
      if (!tile.hitDetectionImageData) {
        const tileSize = toSize(tileGrid.getTileSize(tileGrid.getZForResolution(resolution)));
        const size = [tileSize[0] / 2, tileSize[1] / 2];
        const rotation = this.renderedRotation_;
        const transforms = [
          this.getRenderTransform(tileGrid.getTileCoordCenter(tile.wrappedTileCoord),
            resolution, 0, 0.5, size[0], size[1], 0)
        ];
        requestAnimationFrame(function() {
          tile.hitDetectionImageData = createHitDetectionImageData(tileSize, transforms,
            features, layer.getStyleFunction(),
            tileGrid.getTileCoordExtent(tile.wrappedTileCoord),
            tile.getReplayState(layer).renderedResolution, rotation);
          resolve(hitDetect(tilePixel, features, tile.hitDetectionImageData));
        });
      } else {
        resolve(hitDetect(tilePixel, features, tile.hitDetectionImageData));
      }
    }.bind(this));
  }

  /**
   * @inheritDoc
   */
  handleFontsChanged() {
    clear(this.renderTileImageQueue_);
    const layer = this.getLayer();
    if (layer.getVisible() && this.renderedLayerRevision_ !== undefined) {
      layer.changed();
    }
  }

  /**
   * Handle changes in image style state.
   * @param {import("../../events/Event.js").default} event Image style change event.
   * @private
   */
  handleStyleImageChange_(event) {
    this.renderIfReadyAndVisible();
  }

  /**
   * @inheritDoc
   */
  renderFrame(frameState, target) {
    const viewHints = frameState.viewHints;
    const hifi = !(viewHints[ViewHint.ANIMATING] || viewHints[ViewHint.INTERACTING]);
    this.renderQueuedTileImages_(hifi, frameState);

    super.renderFrame(frameState, target);
    this.renderedPixelToCoordinateTransform_ = frameState.pixelToCoordinateTransform.slice();
    this.renderedRotation_ = frameState.viewState.rotation;


    const layer = /** @type {import("../../layer/VectorTile.js").default} */ (this.getLayer());
    const renderMode = layer.getRenderMode();
    if (renderMode === VectorTileRenderType.IMAGE) {
      return this.container;
    }

    const source = layer.getSource();
    // Unqueue tiles from the image queue when we don't need any more
    const usedTiles = frameState.usedTiles[getUid(source)];
    for (const tileUid in this.renderTileImageQueue_) {
      if (!usedTiles || !(tileUid in usedTiles)) {
        delete this.renderTileImageQueue_[tileUid];
      }
    }

    const context = this.context;
    const declutterReplays = layer.getDeclutter() ? {} : null;
    const replayTypes = VECTOR_REPLAYS[renderMode];
    const pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    const center = viewState.center;
    const resolution = viewState.resolution;
    const rotation = viewState.rotation;
    const size = frameState.size;

    const width = Math.round(size[0] * pixelRatio);
    const height = Math.round(size[1] * pixelRatio);

    const tiles = this.renderedTiles;
    const tileGrid = source.getTileGridForProjection(frameState.viewState.projection);
    const clips = [];
    const clipZs = [];
    for (let i = tiles.length - 1; i >= 0; --i) {
      const tile = /** @type {import("../../VectorRenderTile.js").default} */ (tiles[i]);
      if (tile.getState() == TileState.ABORT) {
        continue;
      }
      const tileCoord = tile.tileCoord;
      const tileExtent = tileGrid.getTileCoordExtent(tile.wrappedTileCoord);
      const worldOffset = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent)[0] - tileExtent[0];
      const transform = multiply(
        scale(this.inversePixelTransform.slice(), 1 / pixelRatio, 1 / pixelRatio),
        this.getRenderTransform(center, resolution, rotation, pixelRatio, width, height, worldOffset)
      );
      const executorGroups = tile.executorGroups[getUid(layer)];
      let clipped = false;
      for (let t = 0, tt = executorGroups.length; t < tt; ++t) {
        const executorGroup = executorGroups[t];
        if (!executorGroup.hasExecutors(replayTypes)) {
          // sourceTile has no instructions of the types we want to render
          continue;
        }
        const currentZ = tile.tileCoord[0];
        let currentClip;
        if (!declutterReplays && !clipped) {
          currentClip = executorGroup.getClipCoords(transform);
          context.save();

          // Create a clip mask for regions in this low resolution tile that are
          // already filled by a higher resolution tile
          for (let j = 0, jj = clips.length; j < jj; ++j) {
            const clip = clips[j];
            if (currentZ < clipZs[j]) {
              context.beginPath();
              // counter-clockwise (outer ring) for current tile
              context.moveTo(currentClip[0], currentClip[1]);
              context.lineTo(currentClip[2], currentClip[3]);
              context.lineTo(currentClip[4], currentClip[5]);
              context.lineTo(currentClip[6], currentClip[7]);
              // clockwise (inner ring) for higher resolution tile
              context.moveTo(clip[6], clip[7]);
              context.lineTo(clip[4], clip[5]);
              context.lineTo(clip[2], clip[3]);
              context.lineTo(clip[0], clip[1]);
              context.clip();
            }
          }
        }
        executorGroup.execute(context, transform, rotation, hifi, replayTypes, declutterReplays);
        if (!declutterReplays && !clipped) {
          context.restore();
          clips.push(currentClip);
          clipZs.push(currentZ);
          clipped = true;
        }
      }
    }
    if (declutterReplays) {
      const layerState = frameState.layerStatesArray[frameState.layerIndex];
      replayDeclutter(declutterReplays, context, rotation, layerState.opacity, hifi, frameState.declutterItems);
    }

    return this.container;
  }

  /**
   * @param {boolean} hifi We have time to render a high fidelity map image.
   * @param {import('../../PluggableMap.js').FrameState} frameState Frame state.
   */
  renderQueuedTileImages_(hifi, frameState) {
    // When we don't have time to render hifi, only render tiles until we have used up
    // half of the frame budget of 16 ms
    for (const uid in this.renderTileImageQueue_) {
      if (!hifi && Date.now() - frameState.time > 8) {
        frameState.animate = true;
        break;
      }
      const tile = this.renderTileImageQueue_[uid];
      delete this.renderTileImageQueue_[uid];
      this.renderTileImage_(tile, frameState);
    }
  }

  /**
   * @param {import("../../Feature.js").FeatureLike} feature Feature.
   * @param {number} squaredTolerance Squared tolerance.
   * @param {import("../../style/Style.js").default|Array<import("../../style/Style.js").default>} styles The style or array of styles.
   * @param {import("../../render/canvas/BuilderGroup.js").default} executorGroup Replay group.
   * @return {boolean} `true` if an image is loading.
   */
  renderFeature(feature, squaredTolerance, styles, executorGroup) {
    if (!styles) {
      return false;
    }
    let loading = false;
    if (Array.isArray(styles)) {
      for (let i = 0, ii = styles.length; i < ii; ++i) {
        loading = renderFeature(
          executorGroup, feature, styles[i], squaredTolerance,
          this.boundHandleStyleImageChange_) || loading;
      }
    } else {
      loading = renderFeature(
        executorGroup, feature, styles, squaredTolerance,
        this.boundHandleStyleImageChange_);
    }
    return loading;
  }

  /**
   * @param {import("../../VectorRenderTile.js").default} tile Tile.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../proj/Projection.js").default} projection Projection.
   * @return {boolean} A new tile image was rendered.
   * @private
   */
  tileImageNeedsRender_(tile, pixelRatio, projection) {
    const layer = /** @type {import("../../layer/VectorTile.js").default} */ (this.getLayer());
    const replayState = tile.getReplayState(layer);
    const revision = layer.getRevision();
    const sourceZ = tile.sourceZ;
    const resolution = tile.wantedResolution;
    return replayState.renderedTileResolution !== resolution || replayState.renderedTileRevision !== revision || replayState.renderedTileZ !== sourceZ;
  }

  /**
   * @param {import("../../VectorRenderTile.js").default} tile Tile.
   * @param {import("../../PluggableMap").FrameState} frameState Frame state.
   * @private
   */
  renderTileImage_(tile, frameState) {
    const layer = /** @type {import("../../layer/VectorTile.js").default} */ (this.getLayer());
    const replayState = tile.getReplayState(layer);
    const revision = layer.getRevision();
    const executorGroups = tile.executorGroups[getUid(layer)];
    replayState.renderedTileRevision = revision;
    replayState.renderedTileZ = tile.sourceZ;

    const tileCoord = tile.wrappedTileCoord;
    const z = tileCoord[0];
    const source = layer.getSource();
    let pixelRatio = frameState.pixelRatio;
    const viewState = frameState.viewState;
    const projection = viewState.projection;
    const tileGrid = source.getTileGridForProjection(projection);
    const tileResolution = tileGrid.getResolution(tile.tileCoord[0]);
    const renderPixelRatio = frameState.pixelRatio / tile.wantedResolution * tileResolution;
    const resolution = tileGrid.getResolution(z);
    const context = tile.getContext(layer);

    // Increase tile size when overzooming for low pixel ratio, to avoid blurry tiles
    pixelRatio = Math.max(pixelRatio, renderPixelRatio / pixelRatio);
    const size = source.getTilePixelSize(z, pixelRatio, projection);
    context.canvas.width = size[0];
    context.canvas.height = size[1];
    const renderScale = pixelRatio / renderPixelRatio;
    if (renderScale !== 1) {
      const canvasTransform = resetTransform(this.tmpTransform_);
      scaleTransform(canvasTransform, renderScale, renderScale);
      context.setTransform.apply(context, canvasTransform);
    }
    const tileExtent = tileGrid.getTileCoordExtent(tileCoord, this.tmpExtent);
    const pixelScale = renderPixelRatio / resolution;
    const transform = resetTransform(this.tmpTransform_);
    scaleTransform(transform, pixelScale, -pixelScale);
    translateTransform(transform, -tileExtent[0], -tileExtent[3]);
    for (let i = 0, ii = executorGroups.length; i < ii; ++i) {
      const executorGroup = executorGroups[i];
      executorGroup.execute(context, transform, 0, true, IMAGE_REPLAYS[layer.getRenderMode()]);
    }
    replayState.renderedTileResolution = tile.wantedResolution;
  }

}


export default CanvasVectorTileLayerRenderer;
