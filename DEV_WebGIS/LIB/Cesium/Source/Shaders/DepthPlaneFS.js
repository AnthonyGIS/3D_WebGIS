//This file is automatically rebuilt by the Cesium build process.
export default "varying vec4 positionEC;\n\
\n\
void main()\n\
{\n\
    vec3 direction = normalize(positionEC.xyz);\n\
    czm_ray ray = czm_ray(vec3(0.0), direction);\n\
\n\
    vec3 ellipsoid_center = czm_view[3].xyz;\n\
\n\
    czm_raySegment intersection = czm_rayEllipsoidIntersectionInterval(ray, ellipsoid_center, czm_ellipsoidInverseRadii);\n\
    if (!czm_isEmpty(intersection))\n\
    {\n\
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n\
    }\n\
    else\n\
    {\n\
        discard;\n\
    }\n\
\n\
    czm_writeLogDepth();\n\
}\n\
";
