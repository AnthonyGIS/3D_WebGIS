//This file is automatically rebuilt by the Cesium build process.
export default "// emulated noperspective\n\
#ifndef LOG_DEPTH\n\
varying float v_WindowZ;\n\
#endif\n\
\n\
/**\n\
 * Clamps a vertex to the near and far planes.\n\
 *\n\
 * @name czm_depthClamp\n\
 * @glslFunction\n\
 *\n\
 * @param {vec4} coords The vertex in clip coordinates.\n\
 * @returns {vec4} The vertex clipped to the near and far planes.\n\
 *\n\
 * @example\n\
 * gl_Position = czm_depthClamp(czm_modelViewProjection * vec4(position, 1.0));\n\
 *\n\
 * @see czm_writeDepthClamp\n\
 */\n\
vec4 czm_depthClamp(vec4 coords)\n\
{\n\
#ifndef LOG_DEPTH\n\
    v_WindowZ = (0.5 * (coords.z / coords.w) + 0.5) * coords.w;\n\
    coords.z = clamp(coords.z, -coords.w, +coords.w);\n\
#endif\n\
    return coords;\n\
}\n\
";
