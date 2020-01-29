/* This file is automatically rebuilt by the Cesium build process. */
define(['./defined-26bd4a03', './Check-da037458', './freezeObject-2d83f591', './defaultValue-f2e68450', './Math-fa6e45cb', './Cartesian2-2a723276', './defineProperties-6f7a50f2', './Transforms-a312718d', './RuntimeError-ad75c885', './WebGLConstants-497deb20', './ComponentDatatype-69643096', './GeometryAttribute-bb8a556c', './when-ee12a2cb', './GeometryAttributes-eecc9f43', './AttributeCompression-87682214', './GeometryPipeline-5fbc4143', './EncodedCartesian3-8b2b90d0', './IndexDatatype-3de60176', './IntersectionTests-a83a53f7', './Plane-c601d1ec', './GeometryInstance-2aa4ff3c', './arrayRemoveDuplicates-dd708d81', './EllipsoidTangentPlane-d5dafbca', './OrientedBoundingBox-f789932a', './CoplanarPolygonGeometryLibrary-36d4bda9', './ArcType-d521909b', './EllipsoidRhumbLine-c6cdbfd3', './PolygonPipeline-c1943379', './PolygonGeometryLibrary-8fe70054'], function (defined, Check, freezeObject, defaultValue, _Math, Cartesian2, defineProperties, Transforms, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, when, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, GeometryInstance, arrayRemoveDuplicates, EllipsoidTangentPlane, OrientedBoundingBox, CoplanarPolygonGeometryLibrary, ArcType, EllipsoidRhumbLine, PolygonPipeline, PolygonGeometryLibrary) { 'use strict';

    function createGeometryFromPositions(positions){
            var length = positions.length;
            var flatPositions = new Float64Array(length * 3);
            var indices = IndexDatatype.IndexDatatype.createTypedArray(length, length * 2);

            var positionIndex = 0;
            var index = 0;

            for (var i = 0; i < length; i++) {
                var position = positions[i];
                flatPositions[positionIndex++] = position.x;
                flatPositions[positionIndex++] = position.y;
                flatPositions[positionIndex++] = position.z;

                indices[index++] = i;
                indices[index++] = (i + 1) % length;
            }

            var attributes = new GeometryAttributes.GeometryAttributes({
                position: new GeometryAttribute.GeometryAttribute({
                    componentDatatype : ComponentDatatype.ComponentDatatype.DOUBLE,
                    componentsPerAttribute : 3,
                    values : flatPositions
                })
            });

            return new GeometryAttribute.Geometry({
                attributes : attributes,
                indices : indices,
                primitiveType : GeometryAttribute.PrimitiveType.LINES
            });
        }

        /**
         * A description of the outline of a polygon composed of arbitrary coplanar positions.
         *
         * @alias CoplanarPolygonOutlineGeometry
         * @constructor
         *
         * @param {Object} options Object with the following properties:
         * @param {PolygonHierarchy} options.polygonHierarchy A polygon hierarchy that can include holes.
         *
         * @see CoplanarPolygonOutlineGeometry.createGeometry
         *
         * @example
         * var polygonOutline = new Cesium.CoplanarPolygonOutlineGeometry({
         *   positions : Cesium.Cartesian3.fromDegreesArrayHeights([
         *      -90.0, 30.0, 0.0,
         *      -90.0, 30.0, 1000.0,
         *      -80.0, 30.0, 1000.0,
         *      -80.0, 30.0, 0.0
         *   ])
         * });
         * var geometry = Cesium.CoplanarPolygonOutlineGeometry.createGeometry(polygonOutline);
         */
        function CoplanarPolygonOutlineGeometry(options) {
            options = defaultValue.defaultValue(options, defaultValue.defaultValue.EMPTY_OBJECT);
            var polygonHierarchy = options.polygonHierarchy;
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('options.polygonHierarchy', polygonHierarchy);
            //>>includeEnd('debug');

            this._polygonHierarchy = polygonHierarchy;
            this._workerName = 'createCoplanarPolygonOutlineGeometry';

            /**
             * The number of elements used to pack the object into an array.
             * @type {Number}
             */
            this.packedLength = PolygonGeometryLibrary.PolygonGeometryLibrary.computeHierarchyPackedLength(polygonHierarchy) + 1;
        }

        /**
         * A description of a coplanar polygon outline from an array of positions.
         *
         * @param {Object} options Object with the following properties:
         * @param {Cartesian3[]} options.positions An array of positions that defined the corner points of the polygon.
         * @returns {CoplanarPolygonOutlineGeometry}
         */
        CoplanarPolygonOutlineGeometry.fromPositions = function(options) {
            options = defaultValue.defaultValue(options, defaultValue.defaultValue.EMPTY_OBJECT);

            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('options.positions', options.positions);
            //>>includeEnd('debug');

            var newOptions = {
                polygonHierarchy : {
                    positions : options.positions
                }
            };
            return new CoplanarPolygonOutlineGeometry(newOptions);
        };

        /**
         * Stores the provided instance into the provided array.
         *
         * @param {CoplanarPolygonOutlineGeometry} value The value to pack.
         * @param {Number[]} array The array to pack into.
         * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
         *
         * @returns {Number[]} The array that was packed into
         */
        CoplanarPolygonOutlineGeometry.pack = function(value, array, startingIndex) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.typeOf.object('value', value);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

            startingIndex = PolygonGeometryLibrary.PolygonGeometryLibrary.packPolygonHierarchy(value._polygonHierarchy, array, startingIndex);

            array[startingIndex] = value.packedLength;

            return array;
        };

        var scratchOptions = {
            polygonHierarchy : {}
        };
        /**
         * Retrieves an instance from a packed array.
         *
         * @param {Number[]} array The packed array.
         * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
         * @param {CoplanarPolygonOutlineGeometry} [result] The object into which to store the result.
         * @returns {CoplanarPolygonOutlineGeometry} The modified result parameter or a new CoplanarPolygonOutlineGeometry instance if one was not provided.
         */
        CoplanarPolygonOutlineGeometry.unpack = function(array, startingIndex, result) {
            //>>includeStart('debug', pragmas.debug);
            Check.Check.defined('array', array);
            //>>includeEnd('debug');

            startingIndex = defaultValue.defaultValue(startingIndex, 0);

            var polygonHierarchy = PolygonGeometryLibrary.PolygonGeometryLibrary.unpackPolygonHierarchy(array, startingIndex);
            startingIndex = polygonHierarchy.startingIndex;
            delete polygonHierarchy.startingIndex;
            var packedLength = array[startingIndex];

            if (!defined.defined(result)) {
                result = new CoplanarPolygonOutlineGeometry(scratchOptions);
            }

            result._polygonHierarchy = polygonHierarchy;
            result.packedLength = packedLength;

            return result;
        };

        /**
         * Computes the geometric representation of an arbitrary coplanar polygon, including its vertices, indices, and a bounding sphere.
         *
         * @param {CoplanarPolygonOutlineGeometry} polygonGeometry A description of the polygon.
         * @returns {Geometry|undefined} The computed vertices and indices.
         */
        CoplanarPolygonOutlineGeometry.createGeometry = function(polygonGeometry) {
            var polygonHierarchy = polygonGeometry._polygonHierarchy;

            var outerPositions = polygonHierarchy.positions;
            outerPositions = arrayRemoveDuplicates.arrayRemoveDuplicates(outerPositions, Cartesian2.Cartesian3.equalsEpsilon, true);
            if (outerPositions.length < 3) {
                return;
            }
            var isValid = CoplanarPolygonGeometryLibrary.CoplanarPolygonGeometryLibrary.validOutline(outerPositions);
            if (!isValid) {
                return undefined;
            }

            var polygons = PolygonGeometryLibrary.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(polygonHierarchy, false);

            if (polygons.length === 0) {
                return undefined;
            }

            var geometries = [];

            for (var i = 0; i < polygons.length; i++) {
                var geometryInstance = new GeometryInstance.GeometryInstance({
                    geometry : createGeometryFromPositions(polygons[i])
                });
                geometries.push(geometryInstance);
            }

            var geometry = GeometryPipeline.GeometryPipeline.combineInstances(geometries)[0];
            var boundingSphere = Transforms.BoundingSphere.fromPoints(polygonHierarchy.positions);

            return new GeometryAttribute.Geometry({
                attributes : geometry.attributes,
                indices : geometry.indices,
                primitiveType : geometry.primitiveType,
                boundingSphere : boundingSphere
            });
        };

    function createCoplanarPolygonOutlineGeometry(polygonGeometry, offset) {
            if (defined.defined(offset)) {
                polygonGeometry = CoplanarPolygonOutlineGeometry.unpack(polygonGeometry, offset);
            }
            polygonGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(polygonGeometry._ellipsoid);
            return CoplanarPolygonOutlineGeometry.createGeometry(polygonGeometry);
        }

    return createCoplanarPolygonOutlineGeometry;

});
