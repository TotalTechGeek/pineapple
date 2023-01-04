"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4014],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),g=p(n),d=a,m=g["".concat(l,".").concat(d)]||g[d]||c[d]||i;return n?r.createElement(m,s(s({ref:t},u),{},{components:n})):r.createElement(m,s({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,s=new Array(i);s[0]=g;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var p=2;p<i;p++)s[p]=n[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"},26:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>c,frontMatter:()=>i,metadata:()=>o,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const i={sidebar_position:3},s="Fuzz Testing",o={unversionedId:"writing-tests/fuzzing-property-based",id:"writing-tests/fuzzing-property-based",title:"Fuzz Testing",description:"General Use",source:"@site/docs/writing-tests/fuzzing-property-based.md",sourceDirName:"writing-tests",slug:"/writing-tests/fuzzing-property-based",permalink:"/docs/writing-tests/fuzzing-property-based",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/writing-tests/fuzzing-property-based.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Higher Order Functions",permalink:"/docs/writing-tests/higher-order-functions"},next:{title:"More Complex Tests",permalink:"/docs/writing-tests/more-complex-tests"}},l={},p=[{value:"General Use",id:"general-use",level:2},{value:"Applying Operations to an Arbitrary",id:"applying-operations-to-an-arbitrary",level:2},{value:"Adding new Arbitraries",id:"adding-new-arbitraries",level:2}],u={toc:p};function c(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"fuzz-testing"},"Fuzz Testing"),(0,a.kt)("h2",{id:"general-use"},"General Use"),(0,a.kt)("p",null,"Leveraging the technology from the amazing ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/dubzzz/fast-check"},"fast-check")," npm package, Pineapple enables you to write rather comprehensive tests in a small, single statements."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * Adds two numbers together\n * @test #integer, #integer returns @ as number\n * @test #integer, #string throws\n * @test #string, #integer throws\n * @param {number} a\n * @param {number} b\n */\nexport function add (a, b) {\n  if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Not numbers')\n  return a + b\n}\n")),(0,a.kt)("p",null,"By using a ",(0,a.kt)("inlineCode",{parentName:"p"},"#arbitrary")," tag, you're able to describe what information should be tested, Pineapple + Fast-Check will try a handful of test cases against your function and try to find any counter-examples where your condition fails."),(0,a.kt)("p",null,"This technology also works with snapshots."),(0,a.kt)("p",null,"You may also invoke the ",(0,a.kt)("inlineCode",{parentName:"p"},"#arbitrary")," tags with arguments, as if it were a function call, and construct objects / tuples from them. You may also use ",(0,a.kt)("inlineCode",{parentName:"p"},"args")," to refer to the arguments that were used to call the function, which is particularly useful for fuzzed-test cases."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/*\n * @test { name: #string, age: #integer(1, 20) } throws\n * @test { name: #string, age: #integer(21, 80) } returns cat(args.0.name, ' is drinking age.')\n */\nexport function drinkingAge ({ name, age }) {\n  if (age >= 21) return `${name} is drinking age.`\n  throw new Error(`${name} is not drinking age.`)\n}\n")),(0,a.kt)("p",null,"If a counter-example is found, ",(0,a.kt)("inlineCode",{parentName:"p"},"fast-check")," will use a shrinking algorithm to find the smallest possible test-case to trigger the error, for example, if you wrote a sum function like so:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * A simple template function.\n * @test 'Hello $0' ~> #string returns cat('Hello ', args.0)\n * @param {string} templateString\n */\nexport function template (templateString) {\n  /** @param {string} replace */\n  return replace => templateString.replace(/\\$0/g, replace)\n}\n")),(0,a.kt)("p",null,"It would generate the following:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"\u2716 Failed test (template): 'Hello $0' ~> #string returns cat('Hello ', args.0)\n>> file:///Users/jesse/Documents/Projects/pineapple/test/fuzz.js:35\n- Expected\n+ Received\n\n- Hello $$\n+ Hello $\nFailing Example: [\n  \"$$\"\n]\nShrunk 4 times.\nSeed: -2121637705\n")),(0,a.kt)("p",null,'Which should help isolate the nature of the issue (in this case, "$" is special in the replace function, therefore it needs to be escaped with another dollar sign). In this case, the shrinking helps deduce the nature of the issue & reproduce it easily.'),(0,a.kt)("p",null,"You may see a list of ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/dubzzz/fast-check/blob/main/documentation/Arbitraries.md"},"all built-in arbitraries here"),"."),(0,a.kt)("h2",{id:"applying-operations-to-an-arbitrary"},"Applying Operations to an Arbitrary"),(0,a.kt)("p",null,"In some cases, you may wish to apply operations to the fuzzed value, Pineapple will parse & handle this use case."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test #integer(1, 10000) ** 2 returns true\n */\nexport function isSquare (num) {\n  return Math.sqrt(num) % 1 === 0\n}\n")),(0,a.kt)("h2",{id:"adding-new-arbitraries"},"Adding new Arbitraries"),(0,a.kt)("p",null,"If you wish to generate complex data structures, or need to introduce a new type of data-set to fuzz against, you are able to do so by implementing a new arbitrary type, and returning it from a function tagged with ",(0,a.kt)("inlineCode",{parentName:"p"},"pineapple_define"),"."),(0,a.kt)("p",null,"You may read up on how to implement them ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/dubzzz/fast-check/blob/main/documentation/AdvancedArbitraries.md"},"under fast-check's documentation"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import fc from 'fast-check' \n\n/**\n * @pineapple_define\n */\nfunction arbitraries () {\n    return {\n        // you can pass in an arbitrary, a function that returns an arbitrary, or a value that'll be constant.\n        // it will be named the value that you define here in the Pineapple engine.\n        person: fc.record({ id: fc.integer(), name: fc.string(), age: fc.integer(12, 80) }) \n    }\n}\n\n/**\n * @test #person returns args.0.age > 21\n */\nfunction ofAge (person) {\n    return person.age > 21\n}\n")),(0,a.kt)("p",null,"It is also possible to provide namespaces for your arbitraries:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @pineapple_define tavern\n */\nfunction arbitraries () {\n    return {\n        // you can pass in an arbitrary, a function that returns an arbitrary, or a value that'll be constant.\n        // it will be named the value that you define here in the Pineapple engine.\n        person: fc.record({ id: fc.integer(), name: fc.string(), age: fc.integer(12, 80) }) \n    }\n}\n\n/**\n * @test #tavern.person returns args.0.age > 21\n */\nfunction ofAge (person) {\n    return person.age > 21\n}\n")),(0,a.kt)("p",null,"This should make it simpler to organize some of your static / generated data sets that you would like to use for your tests."))}c.isMDXComponent=!0}}]);