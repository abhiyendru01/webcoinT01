"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var n=require("@babel/runtime/helpers/extends"),e=require("three"),t=require("react"),a=require("@react-three/fiber"),r=require("./useFBO.cjs.js"),o=require("../materials/DiscardMaterial.cjs.js");function i(n){return n&&"object"==typeof n&&"default"in n?n:{default:n}}function s(n){if(n&&n.__esModule)return n;var e=Object.create(null);return n&&Object.keys(n).forEach((function(t){if("default"!==t){var a=Object.getOwnPropertyDescriptor(n,t);Object.defineProperty(e,t,a.get?a:{enumerable:!0,get:function(){return n[t]}})}})),e.default=n,Object.freeze(e)}require("./shaderMaterial.cjs.js");var l=i(n),c=s(e),m=s(t);class u extends c.MeshPhysicalMaterial{constructor(n=6,e=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new c.Color("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=t=>{t.uniforms={...t.uniforms,...this.uniforms},this.anisotropy>0&&(t.defines.USE_ANISOTROPY=""),e?t.defines.USE_SAMPLER="":t.defines.USE_TRANSMISSION="",t.fragmentShader="\n      uniform float chromaticAberration;         \n      uniform float anisotropicBlur;      \n      uniform float time;\n      uniform float distortion;\n      uniform float distortionScale;\n      uniform float temporalDistortion;\n      uniform sampler2D buffer;\n\n      vec3 random3(vec3 c) {\n        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));\n        vec3 r;\n        r.z = fract(512.0*j);\n        j *= .125;\n        r.x = fract(512.0*j);\n        j *= .125;\n        r.y = fract(512.0*j);\n        return r-0.5;\n      }\n\n      float seed = 0.0;\n      uint hash( uint x ) {\n        x += ( x << 10u );\n        x ^= ( x >>  6u );\n        x += ( x <<  3u );\n        x ^= ( x >> 11u );\n        x += ( x << 15u );\n        return x;\n      }\n\n      // Compound versions of the hashing algorithm I whipped together.\n      uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }\n      uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }\n      uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }\n\n      // Construct a float with half-open range [0:1] using low 23 bits.\n      // All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.\n      float floatConstruct( uint m ) {\n        const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask\n        const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32\n        m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)\n        m |= ieeeOne;                          // Add fractional part to 1.0\n        float  f = uintBitsToFloat( m );       // Range [1:2]\n        return f - 1.0;                        // Range [0:1]\n      }\n\n      // Pseudo-random value in half-open range [0:1].\n      float random( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }\n      float random( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }\n      float random( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }\n      float random( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }\n\n      float rand() {\n        float result = random(vec3(gl_FragCoord.xy, seed));\n        seed += 1.0;\n        return result;\n      }\n\n      const float F3 =  0.3333333;\n      const float G3 =  0.1666667;\n\n      float snoise(vec3 p) {\n        vec3 s = floor(p + dot(p, vec3(F3)));\n        vec3 x = p - s + dot(s, vec3(G3));\n        vec3 e = step(vec3(0.0), x - x.yzx);\n        vec3 i1 = e*(1.0 - e.zxy);\n        vec3 i2 = 1.0 - e.zxy*(1.0 - e);\n        vec3 x1 = x - i1 + G3;\n        vec3 x2 = x - i2 + 2.0*G3;\n        vec3 x3 = x - 1.0 + 3.0*G3;\n        vec4 w, d;\n        w.x = dot(x, x);\n        w.y = dot(x1, x1);\n        w.z = dot(x2, x2);\n        w.w = dot(x3, x3);\n        w = max(0.6 - w, 0.0);\n        d.x = dot(random3(s), x);\n        d.y = dot(random3(s + i1), x1);\n        d.z = dot(random3(s + i2), x2);\n        d.w = dot(random3(s + 1.0), x3);\n        w *= w;\n        w *= w;\n        d *= w;\n        return dot(d, vec4(52.0));\n      }\n\n      float snoiseFractal(vec3 m) {\n        return 0.5333333* snoise(m)\n              +0.2666667* snoise(2.0*m)\n              +0.1333333* snoise(4.0*m)\n              +0.0666667* snoise(8.0*m);\n      }\n"+t.fragmentShader,t.fragmentShader=t.fragmentShader.replace("#include <transmission_pars_fragment>","\n        #ifdef USE_TRANSMISSION\n          // Transmission code is based on glTF-Sampler-Viewer\n          // https://github.com/KhronosGroup/glTF-Sample-Viewer\n          uniform float _transmission;\n          uniform float thickness;\n          uniform float attenuationDistance;\n          uniform vec3 attenuationColor;\n          #ifdef USE_TRANSMISSIONMAP\n            uniform sampler2D transmissionMap;\n          #endif\n          #ifdef USE_THICKNESSMAP\n            uniform sampler2D thicknessMap;\n          #endif\n          uniform vec2 transmissionSamplerSize;\n          uniform sampler2D transmissionSamplerMap;\n          uniform mat4 modelMatrix;\n          uniform mat4 projectionMatrix;\n          varying vec3 vWorldPosition;\n          vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {\n            // Direction of refracted light.\n            vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );\n            // Compute rotation-independant scaling of the model matrix.\n            vec3 modelScale;\n            modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );\n            modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );\n            modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );\n            // The thickness is specified in local space.\n            return normalize( refractionVector ) * thickness * modelScale;\n          }\n          float applyIorToRoughness( const in float roughness, const in float ior ) {\n            // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and\n            // an IOR of 1.5 results in the default amount of microfacet refraction.\n            return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );\n          }\n          vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {\n            float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );            \n            #ifdef USE_SAMPLER\n              #ifdef texture2DLodEXT\n                return texture2DLodEXT(transmissionSamplerMap, fragCoord.xy, framebufferLod);\n              #else\n                return texture2D(transmissionSamplerMap, fragCoord.xy, framebufferLod);\n              #endif\n            #else\n              return texture2D(buffer, fragCoord.xy);\n            #endif\n          }\n          vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {\n            if ( isinf( attenuationDistance ) ) {\n              // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.\n              return radiance;\n            } else {\n              // Compute light attenuation using Beer's law.\n              vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;\n              vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law\n              return transmittance * radiance;\n            }\n          }\n          vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,\n            const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,\n            const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,\n            const in vec3 attenuationColor, const in float attenuationDistance ) {\n            vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );\n            vec3 refractedRayExit = position + transmissionRay;\n            // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.\n            vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n            vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n            refractionCoords += 1.0;\n            refractionCoords /= 2.0;\n            // Sample framebuffer to get pixel the refracted ray hits.\n            vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );\n            vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );\n            // Get the specular component.\n            vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );\n            return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );\n          }\n        #endif\n"),t.fragmentShader=t.fragmentShader.replace("#include <transmission_fragment>",`  \n        // Improve the refraction to use the world pos\n        material.transmission = _transmission;\n        material.transmissionAlpha = 1.0;\n        material.thickness = thickness;\n        material.attenuationDistance = attenuationDistance;\n        material.attenuationColor = attenuationColor;\n        #ifdef USE_TRANSMISSIONMAP\n          material.transmission *= texture2D( transmissionMap, vUv ).r;\n        #endif\n        #ifdef USE_THICKNESSMAP\n          material.thickness *= texture2D( thicknessMap, vUv ).g;\n        #endif\n        \n        vec3 pos = vWorldPosition;\n        vec3 v = normalize( cameraPosition - pos );\n        vec3 n = inverseTransformDirection( normal, viewMatrix );\n        vec3 transmission = vec3(0.0);\n        float transmissionR, transmissionB, transmissionG;\n        float randomCoords = rand();\n        float thickness_smear = thickness * max(pow(roughnessFactor, 0.33), anisotropicBlur);\n        vec3 distortionNormal = vec3(0.0);\n        vec3 temporalOffset = vec3(time, -time, -time) * temporalDistortion;\n        if (distortion > 0.0) {\n          distortionNormal = distortion * vec3(snoiseFractal(vec3((pos * distortionScale + temporalOffset))), snoiseFractal(vec3(pos.zxy * distortionScale - temporalOffset)), snoiseFractal(vec3(pos.yxz * distortionScale + temporalOffset)));\n        }\n        for (float i = 0.0; i < ${n}.0; i ++) {\n          vec3 sampleNorm = normalize(n + roughnessFactor * roughnessFactor * 2.0 * normalize(vec3(rand() - 0.5, rand() - 0.5, rand() - 0.5)) * pow(rand(), 0.33) + distortionNormal);\n          transmissionR = getIBLVolumeRefraction(\n            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,\n            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness  + thickness_smear * (i + randomCoords) / float(${n}),\n            material.attenuationColor, material.attenuationDistance\n          ).r;\n          transmissionG = getIBLVolumeRefraction(\n            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,\n            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior  * (1.0 + chromaticAberration * (i + randomCoords) / float(${n})) , material.thickness + thickness_smear * (i + randomCoords) / float(${n}),\n            material.attenuationColor, material.attenuationDistance\n          ).g;\n          transmissionB = getIBLVolumeRefraction(\n            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,\n            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * chromaticAberration * (i + randomCoords) / float(${n})), material.thickness + thickness_smear * (i + randomCoords) / float(${n}),\n            material.attenuationColor, material.attenuationDistance\n          ).b;\n          transmission.r += transmissionR;\n          transmission.g += transmissionG;\n          transmission.b += transmissionB;\n        }\n        transmission /= ${n}.0;\n        totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );\n`)},Object.keys(this.uniforms).forEach((n=>Object.defineProperty(this,n,{get:()=>this.uniforms[n].value,set:e=>this.uniforms[n].value=e})))}}const f=m.forwardRef((({buffer:n,transmissionSampler:e=!1,backside:t=!1,side:i=c.FrontSide,transmission:s=1,thickness:f=0,backsideThickness:d=0,samples:v=10,resolution:h,backsideResolution:p,background:x,anisotropy:g,anisotropicBlur:S,...M},C)=>{a.extend({MeshTransmissionMaterial:u});const b=m.useRef(null),[y]=m.useState((()=>new o.DiscardMaterial)),w=r.useFBO(p||h),k=r.useFBO(h);let D,R,T;return a.useFrame((n=>{b.current.time=n.clock.getElapsedTime(),b.current.buffer!==k.texture||e||(T=b.current.__r3f.parent,T&&(R=n.gl.toneMapping,D=n.scene.background,n.gl.toneMapping=c.NoToneMapping,x&&(n.scene.background=x),T.material=y,t&&(n.gl.setRenderTarget(w),n.gl.render(n.scene,n.camera),T.material=b.current,T.material.buffer=w.texture,T.material.thickness=d,T.material.side=c.BackSide),n.gl.setRenderTarget(k),n.gl.render(n.scene,n.camera),T.material=b.current,T.material.thickness=f,T.material.side=i,T.material.buffer=k.texture,n.scene.background=D,n.gl.setRenderTarget(null),n.gl.toneMapping=R))})),m.useImperativeHandle(C,(()=>b.current),[]),m.createElement("meshTransmissionMaterial",l.default({args:[v,e],ref:b},M,{buffer:n||k.texture,_transmission:s,anisotropicBlur:null!=S?S:g,transmission:e?s:0,thickness:f,side:i}))}));exports.MeshTransmissionMaterial=f;
