"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("three"),r=require("react"),t=require("@react-three/fiber"),n=require("suspend-react");function o(e){if(e&&e.__esModule)return e;var r=Object.create(null);return e&&Object.keys(e).forEach((function(t){if("default"!==t){var n=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(r,t,n.get?n:{enumerable:!0,get:function(){return e[t]}})}})),r.default=e,Object.freeze(r)}var u=o(e);exports.useVideoTexture=function(e,o){const{unsuspend:s,start:c,crossOrigin:i,muted:a,loop:d,...p}={unsuspend:"loadedmetadata",crossOrigin:"Anonymous",muted:!0,loop:!0,start:!0,playsInline:!0,...o},l=t.useThree((e=>e.gl)),f=n.suspend((()=>new Promise(((r,t)=>{const n=Object.assign(document.createElement("video"),{src:"string"==typeof e&&e||void 0,srcObject:e instanceof MediaStream&&e||void 0,crossOrigin:i,loop:d,muted:a,...p}),o=new u.VideoTexture(n);"colorSpace"in o?o.colorSpace=l.outputColorSpace:o.encoding=l.outputEncoding,n.addEventListener(s,(()=>r(o)))}))),[e]);return r.useEffect((()=>{c&&f.image.play()}),[f,c]),f};
