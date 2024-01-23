"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/extends"),n=require("react"),o=require("three"),i=require("react-merge-refs"),r=require("@react-three/fiber"),t=require("./shaderMaterial.cjs.js"),l=require("../helpers/constants.cjs.js");function a(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function s(e){if(e&&e.__esModule)return e;var n=Object.create(null);return e&&Object.keys(e).forEach((function(o){if("default"!==o){var i=Object.getOwnPropertyDescriptor(e,o);Object.defineProperty(n,o,i.get?i:{enumerable:!0,get:function(){return e[o]}})}})),n.default=e,Object.freeze(n)}var c=a(e),f=s(n),d=s(o),u=a(i);const m=t.shaderMaterial({cellSize:.5,sectionSize:1,fadeDistance:100,fadeStrength:1,cellThickness:.5,sectionThickness:1,cellColor:new d.Color,sectionColor:new d.Color,infiniteGrid:!1,followCamera:!1,worldCamProjPosition:new d.Vector3,worldPlanePosition:new d.Vector3},"\n    varying vec3 localPosition;\n    varying vec4 worldPosition;\n\n    uniform vec3 worldCamProjPosition;\n    uniform vec3 worldPlanePosition;\n    uniform float fadeDistance;\n    uniform bool infiniteGrid;\n    uniform bool followCamera;\n\n    void main() {\n      localPosition = position.xzy;\n      if (infiniteGrid) localPosition *= 1.0 + fadeDistance;\n      \n      worldPosition = modelMatrix * vec4(localPosition, 1.0);\n      if (followCamera) {\n        worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);\n        localPosition = (inverse(modelMatrix) * worldPosition).xyz;\n      }\n\n      gl_Position = projectionMatrix * viewMatrix * worldPosition;\n    }\n  ",`\n    varying vec3 localPosition;\n    varying vec4 worldPosition;\n\n    uniform vec3 worldCamProjPosition;\n    uniform float cellSize;\n    uniform float sectionSize;\n    uniform vec3 cellColor;\n    uniform vec3 sectionColor;\n    uniform float fadeDistance;\n    uniform float fadeStrength;\n    uniform float cellThickness;\n    uniform float sectionThickness;\n\n    float getGrid(float size, float thickness) {\n      vec2 r = localPosition.xz / size;\n      vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);\n      float line = min(grid.x, grid.y) + 1.0 - thickness;\n      return 1.0 - min(line, 1.0);\n    }\n\n    void main() {\n      float g1 = getGrid(cellSize, cellThickness);\n      float g2 = getGrid(sectionSize, sectionThickness);\n\n      float dist = distance(worldCamProjPosition, worldPosition.xyz);\n      float d = 1.0 - min(dist / fadeDistance, 1.0);\n      vec3 color = mix(cellColor, sectionColor, min(1.0, sectionThickness * g2));\n\n      gl_FragColor = vec4(color, (g1 + g2) * pow(d, fadeStrength));\n      gl_FragColor.a = mix(0.75 * gl_FragColor.a, gl_FragColor.a, g2);\n      if (gl_FragColor.a <= 0.0) discard;\n\n      #include <tonemapping_fragment>\n      #include <${l.version>=154?"colorspace_fragment":"encodings_fragment"}>\n    }\n  `),g=f.forwardRef((({args:e,cellColor:n="#000000",sectionColor:o="#2080ff",cellSize:i=.5,sectionSize:t=1,followCamera:l=!1,infiniteGrid:a=!1,fadeDistance:s=100,fadeStrength:g=1,cellThickness:P=.5,sectionThickness:w=1,side:v=d.BackSide,...C},h)=>{r.extend({GridMaterial:m});const p=f.useRef(null),x=new d.Plane,j=new d.Vector3(0,1,0),z=new d.Vector3(0,0,0);r.useFrame((e=>{x.setFromNormalAndCoplanarPoint(j,z).applyMatrix4(p.current.matrixWorld);const n=p.current.material,o=n.uniforms.worldCamProjPosition,i=n.uniforms.worldPlanePosition;x.projectPoint(e.camera.position,o.value),i.value.set(0,0,0).applyMatrix4(p.current.matrixWorld)}));const y={cellSize:i,sectionSize:t,cellColor:n,sectionColor:o,cellThickness:P,sectionThickness:w},S={fadeDistance:s,fadeStrength:g,infiniteGrid:a,followCamera:l};return f.createElement("mesh",c.default({ref:u.default([p,h]),frustumCulled:!1},C),f.createElement("gridMaterial",c.default({transparent:!0,"extensions-derivatives":!0,side:v},y,S)),f.createElement("planeGeometry",{args:e}))}));exports.Grid=g;
