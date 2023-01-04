"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1623],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),d=l(n),m=i,f=d["".concat(p,".").concat(m)]||d[m]||u[m]||o;return n?r.createElement(f,s(s({ref:t},c),{},{components:n})):r.createElement(f,s({ref:t},c))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,s=new Array(o);s[0]=d;var a={};for(var p in t)hasOwnProperty.call(t,p)&&(a[p]=t[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var l=2;l<o;l++)s[l]=n[l];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},6975:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var r=n(7462),i=(n(7294),n(3905));const o={sidebar_position:5},s="Adding Methods to Pineapple",a={unversionedId:"writing-tests/adding-methods-to-pineapple",id:"writing-tests/adding-methods-to-pineapple",title:"Adding Methods to Pineapple",description:"Because there may be situations where you wish to use additional functions inside of your test cases, Pineapple gives you the ability to expose new methods to the test clauses.",source:"@site/docs/writing-tests/adding-methods-to-pineapple.md",sourceDirName:"writing-tests",slug:"/writing-tests/adding-methods-to-pineapple",permalink:"/docs/writing-tests/adding-methods-to-pineapple",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/writing-tests/adding-methods-to-pineapple.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Testing Classes",permalink:"/docs/writing-tests/testing-classes"},next:{title:"Setup and Teardown",permalink:"/docs/writing-tests/setup-and-teardown"}},p={},l=[],c={toc:l};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"adding-methods-to-pineapple"},"Adding Methods to Pineapple"),(0,i.kt)("p",null,"Because there may be situations where you wish to use additional functions inside of your test cases, Pineapple gives you the ability to expose new methods to the test clauses."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * Checks whether a number is prime or not. \n * @pineapple_import\n */\nexport function isPrime(n) {\n    ...\n}\n\n\n/**\n * Generates a prime larger than the given number.\n * @test 100 returns isPrime(@) and @ > 100\n */\nexport function generatePrime(n) {\n    ...\n}\n")),(0,i.kt)("p",null,"This should give you plenty of flexibility to implement descriptive and simple test cases."),(0,i.kt)("p",null,"If you wish to change the name of the function import from within the logic engine, you may specify the name as ",(0,i.kt)("inlineCode",{parentName:"p"},"@pineapple_import nameToUseInTestClause"),", otherwise it will infer it to be the same as the function name."))}u.isMDXComponent=!0}}]);