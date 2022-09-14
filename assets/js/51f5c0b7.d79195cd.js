"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2256],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,s=e.originalType,p=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),m=l(n),f=a,d=m["".concat(p,".").concat(f)]||m[f]||u[f]||s;return n?r.createElement(d,o(o({ref:t},c),{},{components:n})):r.createElement(d,o({ref:t},c))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=n.length,o=new Array(s);o[0]=m;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var l=2;l<s;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},690:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return p},default:function(){return f},frontMatter:function(){return i},metadata:function(){return l},toc:function(){return u}});var r=n(7462),a=n(3366),s=(n(7294),n(3905)),o=["components"],i={tags:["v0.8.0","patch","major"],sidebar_position:4,date:new Date("2022-05-18T00:00:00.000Z"),authors:[{name:"Jesse Mitchell",title:"Developer of Pineapple",url:"https://github.com/TotalTechGeek",image_url:"https://github.com/TotalTechGeek.png"}]},p="Extending Interchange Formats & Subset Testing (v0.8.0)",l={permalink:"/pineapple/blog/v0.8.0",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/v0.8.0.md",source:"@site/blog/v0.8.0.md",title:"Extending Interchange Formats & Subset Testing (v0.8.0)",description:"Hello!",date:"2022-05-18T00:00:00.000Z",formattedDate:"May 18, 2022",tags:[{label:"v0.8.0",permalink:"/pineapple/blog/tags/v-0-8-0"},{label:"patch",permalink:"/pineapple/blog/tags/patch"},{label:"major",permalink:"/pineapple/blog/tags/major"}],readingTime:.93,truncated:!1,authors:[{name:"Jesse Mitchell",title:"Developer of Pineapple",url:"https://github.com/TotalTechGeek",image_url:"https://github.com/TotalTechGeek.png",imageURL:"https://github.com/TotalTechGeek.png"}],frontMatter:{tags:["v0.8.0","patch","major"],sidebar_position:4,date:"2022-05-18T00:00:00.000Z",authors:[{name:"Jesse Mitchell",title:"Developer of Pineapple",url:"https://github.com/TotalTechGeek",image_url:"https://github.com/TotalTechGeek.png",imageURL:"https://github.com/TotalTechGeek.png"}]},prevItem:{title:"Supercharging Pineapple with Property Based Testing (v0.9.0)",permalink:"/pineapple/blog/v0.9.0"},nextItem:{title:"Improving Snapshots (v0.7.0)",permalink:"/pineapple/blog/v0.7.0"}},c={authorsImageUrls:[void 0]},u=[],m={toc:u};function f(e){var t=e.components,n=(0,a.Z)(e,o);return(0,s.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Hello!"),(0,s.kt)("p",null,"This patch introduces the ability to select your output format, which should help with editor integrations in the future."),(0,s.kt)("p",null,"If you use ",(0,s.kt)("inlineCode",{parentName:"p"},"OUTPUT_FORMAT=JSON")," or ",(0,s.kt)("inlineCode",{parentName:"p"},"-f json"),", you are able to have Pineapple output to an ndjson stream which should be more easily parsable by a program."),(0,s.kt)("p",null,"For reference:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},"\u2714 Passed test (fib): 1\n\u2714 Passed test (fib): 3\n\u2714 Passed test (fib): 10\n\u2714 Passed test (add): 1, 2\n\u2714 Passed test (add): '4', 3 throws\n\u2714 Passed test (add): 1, '0' throws\n\u2714 Passed test (add): -1, 1\n\u2714 Passed test (add): -1, 1 to 0\n\u2716 Failed test (add): -1, 1 to -1\n")),(0,s.kt)("p",null,"Will become the following in JSON mode:"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre"},'{"type":"Success","name":"fib","input":"1","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:39"}\n{"type":"Success","name":"fib","input":"3","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:40"}\n{"type":"Success","name":"fib","input":"10","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:41"}\n{"type":"Success","name":"add","input":"1, 2","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:2"}\n{"type":"Success","name":"add","input":"\'4\', 3 throws","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:3"}\n{"type":"Success","name":"add","input":"1, \'0\' throws","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:4"}\n{"type":"Success","name":"add","input":"-1, 1","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:5"}\n{"type":"Success","name":"add","input":"-1, 1 to 0","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:6"}\n{"type":"Failure","name":"add","input":"-1, 1 to -1","message":"- Expected\\n+ Received\\n\\n- -1\\n+ 0","file":"file:///Users/jesse/Documents/Projects/pineapple/test/math.js:7"\n')),(0,s.kt)("p",null,"This release also introduces the ability to run a subset of tests using the ",(0,s.kt)("inlineCode",{parentName:"p"},"--only")," flag."),(0,s.kt)("p",null,"Additionally, it adds the file name & line number to failed test output (even in pretty mode), which should make it easier to jump to your test cases."))}f.isMDXComponent=!0}}]);