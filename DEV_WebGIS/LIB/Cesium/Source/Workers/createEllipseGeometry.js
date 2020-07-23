/* This file is automatically rebuilt by the Cesium build process. */
define(['./when-e6985d2a', './Check-24cae389', './Math-392d0035', './Cartesian2-27e3267e', './Transforms-df227093', './RuntimeError-61701d3e', './WebGLConstants-34c08bc0', './ComponentDatatype-cb08e294', './GeometryAttribute-c6bd73d5', './GeometryAttributes-d6ea8c2b', './AttributeCompression-c6a20ed1', './GeometryPipeline-43170b82', './EncodedCartesian3-fa90d4bd', './IndexDatatype-1be7d1f8', './IntersectionTests-a2506214', './Plane-cd2fd16b', './GeometryOffsetAttribute-9c46b133', './VertexFormat-2df57ea4', './EllipseGeometryLibrary-0c6ee6ef', './GeometryInstance-daeadf73', './EllipseGeometry-4a4f88f2'], function (when, Check, _Math, Cartesian2, Transforms, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, GeometryOffsetAttribute, VertexFormat, EllipseGeometryLibrary, GeometryInstance, EllipseGeometry) { 'use strict';

  function createEllipseGeometry(ellipseGeometry, offset) {
    if (when.defined(offset)) {
      ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Cartesian2.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseGeometry.EllipseGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseGeometry;

});
