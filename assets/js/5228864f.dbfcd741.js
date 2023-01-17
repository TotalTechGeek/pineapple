"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3248],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>h});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=p(n),h=a,g=m["".concat(s,".").concat(h)]||m[h]||u[h]||o;return n?r.createElement(g,l(l({ref:t},c),{},{components:n})):r.createElement(g,l({ref:t},c))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=m;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var p=2;p<o;p++)l[p]=n[p];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9050:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const o={tags:["v0.7.0","patch","major"],sidebar_position:3,date:new Date("2022-05-17T00:00:00.000Z"),authors:[{name:"Jesse Mitchell",title:"Developer of Pineapple",url:"https://github.com/TotalTechGeek",image_url:"https://github.com/TotalTechGeek.png"}]},l="Improving Snapshots (v0.7.0)",i={permalink:"/blog/v0.7.0",editUrl:"https://github.com/TotalTechGeek/pineapple/tree/master/website/blog/v0.7.0.md",source:"@site/blog/v0.7.0.md",title:"Improving Snapshots (v0.7.0)",description:"Hi all!",date:"2022-05-17T00:00:00.000Z",formattedDate:"May 17, 2022",tags:[{label:"v0.7.0",permalink:"/blog/tags/v-0-7-0"},{label:"patch",permalink:"/blog/tags/patch"},{label:"major",permalink:"/blog/tags/major"}],readingTime:.725,hasTruncateMarker:!1,authors:[{name:"Jesse Mitchell",title:"Developer of Pineapple",url:"https://github.com/TotalTechGeek",image_url:"https://github.com/TotalTechGeek.png",imageURL:"https://github.com/TotalTechGeek.png"}],frontMatter:{tags:["v0.7.0","patch","major"],sidebar_position:3,date:"2022-05-17T00:00:00.000Z",authors:[{name:"Jesse Mitchell",title:"Developer of Pineapple",url:"https://github.com/TotalTechGeek",image_url:"https://github.com/TotalTechGeek.png",imageURL:"https://github.com/TotalTechGeek.png"}]},prevItem:{title:"Extending Interchange Formats & Subset Testing (v0.8.0)",permalink:"/blog/v0.8.0"},nextItem:{title:"Introducing Class Tests (v0.6.3)",permalink:"/blog/v0.6.3"}},s={authorsImageUrls:[void 0]},p=[],c={toc:p};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Hi all!"),(0,a.kt)("p",null,"This minor patch improves the developer experience around snapshots by making the output readable (as opposed to the Jest Serialization mechanism that it used in previous versions)."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "fib(1) [dRX81e0Zt9zxfAdy4cKtrrKMfyO/nvL9WF+XRAOtEB0=]": {\n    "value": 1,\n    "async": false\n  },\n  "fib(3) [KTjgP0vq5dR61BJFF+PbmmL0idLvto8mYF5cAbndz5k=]": {\n    "value": 2,\n    "async": false\n  },\n  "fib(10) [RDou6nU/Mgg9Olsl1Kd1FGLxi1Ij/V+3bw0spgCqCnY=]": {\n    "value": 55,\n    "async": false\n  },\n  "add(1, 2) [O6M1izKkUUPb7fRhfnhMZ8VxO25LxM0bS6rw/tGm5YA=]": {\n    "value": 3,\n    "async": false\n  },\n  "add(-1, 1) [hnYzkbZiJjMD0YnEHZer8Pwyyf32Pd3dus2/O70SBZk=]": {\n    "value": 0,\n    "async": false\n  },\n  "mul(3, 5) [3uLRCxaVjev70tv9IFOlLrFQMM2wYWl0A1q5WwoopjE=]": {\n    "value": 15,\n    "async": false\n  }\n}\n')),(0,a.kt)("p",null,"This should make it simpler to review snapshots for the purposes of pull-requests."),(0,a.kt)("p",null,"The syntax is json-like, in that it actually uses Pineapple's grammar & functions to parse it, which will make it easier to support things like dates & bigints, or other types of values later on."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'{\n    "addAsync(5n, 3n) [X76+w3gcfI4QVFELW0Sgv2OKYXurpbbu3cu+5ki2IfM=]": {\n        "value": 8n,\n        "async": true\n    }\n}\n')))}u.isMDXComponent=!0}}]);