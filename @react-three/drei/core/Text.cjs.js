"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@babel/runtime/helpers/extends"),t=require("react"),r=require("troika-three-text"),n=require("@react-three/fiber"),o=require("suspend-react");function c(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}function u(e){if(e&&e.__esModule)return e;var t=Object.create(null);return e&&Object.keys(e).forEach((function(r){if("default"!==r){var n=Object.getOwnPropertyDescriptor(e,r);Object.defineProperty(t,r,n.get?n:{enumerable:!0,get:function(){return e[r]}})}})),t.default=e,Object.freeze(t)}var a=c(e),i=u(t);const f=i.forwardRef((({sdfGlyphSize:e=64,anchorX:t="center",anchorY:c="middle",font:u,fontSize:f=1,children:s,characters:d,onSync:l,...p},h)=>{const b=n.useThree((({invalidate:e})=>e)),[y]=i.useState((()=>new r.Text)),[j,m]=i.useMemo((()=>{const e=[];let t="";return i.Children.forEach(s,(r=>{"string"==typeof r||"number"==typeof r?t+=r:e.push(r)})),[e,t]}),[s]);return o.suspend((()=>new Promise((e=>r.preloadFont({font:u,characters:d},e)))),["troika-text",u,d]),i.useLayoutEffect((()=>{y.sync((()=>{b(),l&&l(y)}))})),i.useEffect((()=>()=>y.dispose()),[y]),i.createElement("primitive",a.default({object:y,ref:h,font:u,text:m,anchorX:t,anchorY:c,fontSize:f,sdfGlyphSize:e},p),j)}));exports.Text=f;
