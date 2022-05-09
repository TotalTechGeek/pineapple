"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[282],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),f=u(n),d=o,m=f["".concat(l,".").concat(d)]||f[d]||c[d]||a;return n?r.createElement(m,i(i({ref:t},p),{},{components:n})):r.createElement(m,i({ref:t},p))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=f;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var u=2;u<a;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},6320:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return s},metadata:function(){return u},toc:function(){return c}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],s={sidebar_position:5},l="Setup and Teardown",u={unversionedId:"writing-tests/setup-and-teardown",id:"writing-tests/setup-and-teardown",title:"Setup and Teardown",description:"Continuing down the path of writing more complex tests with Pineapple, there may be certain situations where you need to perform some additional setup & teardown. While not strictly required, these are recommended to be embedded in a .test.js file.",source:"@site/docs/writing-tests/setup-and-teardown.md",sourceDirName:"writing-tests",slug:"/writing-tests/setup-and-teardown",permalink:"/pineapple/docs/writing-tests/setup-and-teardown",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/writing-tests/setup-and-teardown.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Adding Methods to Pineapple",permalink:"/pineapple/docs/writing-tests/adding-methods-to-pineapple"}},p={},c=[{value:"Before / After all of the tests",id:"before--after-all-of-the-tests",level:2},{value:"Before / After tests within a function",id:"before--after-tests-within-a-function",level:2},{value:"Before / After",id:"before--after",level:3},{value:"BeforeEach / AfterEach",id:"beforeeach--aftereach",level:3},{value:"Caveat Emptor",id:"caveat-emptor",level:2}],f={toc:c};function d(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"setup-and-teardown"},"Setup and Teardown"),(0,a.kt)("p",null,"Continuing down the path of writing more complex tests with Pineapple, there may be certain situations where you need to perform some additional setup & teardown. While not strictly required, these are recommended to be embedded in a ",(0,a.kt)("inlineCode",{parentName:"p"},".test.js")," file."),(0,a.kt)("h2",{id:"before--after-all-of-the-tests"},"Before / After all of the tests"),(0,a.kt)("p",null,"If you wish to run a function before / after all of the tests are run (like an initial setup for every single test you're going to run), you are able to simply add a JSDoc annotation to a function without any other descriptors."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * A function that sets up some records in a mock database, or creates instances\n * of some objects you may need.\n * @beforeAll\n */\nasync function setup() {\n    ...\n}\n")),(0,a.kt)("p",null,"The annotations for this are ",(0,a.kt)("inlineCode",{parentName:"p"},"beforeAll")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"afterAll"),". You may define multiple functions to be invoked."),(0,a.kt)("h2",{id:"before--after-tests-within-a-function"},"Before / After tests within a function"),(0,a.kt)("p",null,"If you need to run the setup with the function itself, you have multiple options; these annotation require you to specify what you'd like to have executed (usually methods imported using ",(0,a.kt)("inlineCode",{parentName:"p"},"pineapple_import"),")."),(0,a.kt)("h3",{id:"before--after"},"Before / After"),(0,a.kt)("p",null,"These annotations will run before / after all of the test cases associated with the function."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"\n/**\n * @pineapple_import\n */\nexport async function setupExample (name) {\n    await db.initialize()\n    await db.insert({\n        name\n    })\n}\n\n/**\n *  @pineapple_import\n */\nexport async function destroyExample (name) {\n    await db.remove({ name })\n}\n\n/**\n * Silly example, but shows how to invoke.\n * @before setupExample('Jesse')\n * @after destroyExample('Jesse')\n * @test 'Jesse' returns 1\n * @test 'John' returns 0\n */\nexport async function example(name) {\n    const people = await db.find({ name })\n    return people.length\n}\n")),(0,a.kt)("h3",{id:"beforeeach--aftereach"},"BeforeEach / AfterEach"),(0,a.kt)("p",null,"If you'd prefer for it to run before / after each test case,"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"let person\n\n/**\n * Sets a file-scoped variable to be a new person object.\n * @pineapple_import\n */\nfunction createPerson (name, level) {\n    person = {\n        name,\n        level: 1\n    }\n}\n\n/**\n * Another silly example to demonstrate the use of beforeEach\n * @beforeEach createPerson('John', 5)\n * @test 3 returns @.age === 8\n * @test 1 returns @.age === 4\n */\nfunction levelUp(amount) {\n    person.level += amount\n    return person\n}\n")),(0,a.kt)("h2",{id:"caveat-emptor"},"Caveat Emptor"),(0,a.kt)("p",null,"In general, I'd encourage you to avoid using these annotations. They have been added to the framework to introduce flexibility, but if your tests necessitate the use of setup & teardown, you likely have a use-case that unit tests aren't ideal for. Scenario Tests with a framework like Cucumber would likely be far more fitting."),(0,a.kt)("p",null,"There might be some use-cases where ",(0,a.kt)("inlineCode",{parentName:"p"},"@beforeAll")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"@afterAll")," might make sense, but please be mindful that there may be better options."))}d.isMDXComponent=!0}}]);