"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/extends"),r=require("react"),t=require("three"),n=require("@react-three/fiber"),o=require("../materials/WireframeMaterial.cjs.js");function i(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function a(e){if(e&&e.__esModule)return e;var r=Object.create(null);return e&&Object.keys(e).forEach((function(t){if("default"!==t){var n=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,n.get?n:{enumerable:!0,get:function(){return e[t]}})}})),r.default=e,Object.freeze(r)}require("./shaderMaterial.cjs.js");var u=i(e),f=a(r),s=a(t);function c(e){return void 0!==(null==e?void 0:e.current)}function l(e){return"WireframeGeometry"===e.type}function m(e){const r=null!=(t=e)&&t.current?e.current:e;var t;if(function(e){return!(null==e||!e.isBufferGeometry)}(r))return r;{if(l(r))throw new Error("Wireframe: WireframeGeometry is not supported.");const e=r.parent;if(function(e){return!(null==e||!e.geometry)}(e)){if(l(e.geometry))throw new Error("Wireframe: WireframeGeometry is not supported.");return e.geometry}}}function d(e,r){if(e.index){console.warn("Wireframe: Requires non-indexed geometry, converting to non-indexed geometry.");const r=e.toNonIndexed();e.copy(r),e.setIndex(null)}const t=function(e,r){const t=e.getAttribute("position").count,n=[];for(let e=0;e<t;e++){const t=r?1:0;e%2==0?n.push(0,0,1,0,1,0,1,0,t):n.push(0,1,0,0,0,1,1,0,t)}return new s.BufferAttribute(Float32Array.from(n),3)}(e,r);e.setAttribute("barycentric",t)}function y({geometry:e,simplify:r=!1,...t}){n.extend({MeshWireframeMaterial:o.WireframeMaterial});const[i,a]=f.useState(null);f.useLayoutEffect((()=>{const t=m(e);if(!t)throw new Error("Wireframe: geometry prop must be a BufferGeometry or a ref to a BufferGeometry.");d(t,r),c(e)&&a(t)}),[r,e]);const l=c(e)?i:e;return f.createElement(f.Fragment,null,l&&f.createElement("mesh",{geometry:l},f.createElement("meshWireframeMaterial",u.default({attach:"material",transparent:!0,side:s.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-4},t,{extensions:{derivatives:!0,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1}}))))}function p({simplify:e=!1,...r}){const t=f.useRef(null),n=f.useMemo((()=>function(){const e={};for(const r in o.WireframeMaterialShaders.uniforms)e[r]={value:o.WireframeMaterialShaders.uniforms[r]};return e}()),[o.WireframeMaterialShaders.uniforms]);return o.useWireframeUniforms(n,r),f.useLayoutEffect((()=>{const r=m(t);if(!r)throw new Error("Wireframe: Must be a child of a Mesh, Line or Points object or specify a geometry prop.");const n=r.clone();return d(r,e),()=>{r.copy(n),n.dispose()}}),[e]),f.useLayoutEffect((()=>{const e=t.current.parent,r=e.material.clone();return o.setWireframeOverride(e.material,n),()=>{e.material.dispose(),e.material=r}}),[]),f.createElement("object3D",{ref:t})}exports.Wireframe=function({geometry:e,...r}){return e?f.createElement(y,u.default({geometry:e},r)):f.createElement(p,r)};
