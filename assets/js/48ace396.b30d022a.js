"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5682],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var r=n(7294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,s=function(e,t){if(null==e)return{};var n,r,s={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var c=r.createContext({}),l=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,s=e.mdxType,o=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=l(n),f=s,d=m["".concat(c,".").concat(f)]||m[f]||p[f]||o;return n?r.createElement(d,a(a({ref:t},u),{},{components:n})):r.createElement(d,a({ref:t},u))}));function f(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var o=n.length,a=new Array(o);a[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:s,a[1]=i;for(var l=2;l<o;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2887:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return i},metadata:function(){return l},toc:function(){return p}});var r=n(7462),s=n(3366),o=(n(7294),n(3905)),a=["components"],i={sidebar_position:3},c=void 0,l={unversionedId:"writing-tests/more-complex-tests",id:"writing-tests/more-complex-tests",title:"more-complex-tests",description:"While in many cases, you should be able to write your test cases inline writing Pineapple test declarations, you may come across cases where your unit test may require a bit more setup than just invoking a function.",source:"@site/docs/writing-tests/more-complex-tests.md",sourceDirName:"writing-tests",slug:"/writing-tests/more-complex-tests",permalink:"/pineapple/docs/writing-tests/more-complex-tests",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/writing-tests/more-complex-tests.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"fuzzing-property-based",permalink:"/pineapple/docs/writing-tests/fuzzing-property-based"},next:{title:"testing-classes",permalink:"/pineapple/docs/writing-tests/testing-classes"}},u={},p=[],m={toc:p};function f(e){var t=e.components,n=(0,s.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"more-complex-tests"},"More Complex Tests"),(0,o.kt)("p",null,"While in many cases, you should be able to write your test cases inline writing Pineapple test declarations, you may come across cases where your unit test may require a bit more setup than just invoking a function."),(0,o.kt)("p",null,"Rather than going in the direction of ",(0,o.kt)("inlineCode",{parentName:"p"},"it")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"describe")," like test specifications, Pineapple encourages users to write test code as vanilla functions that can be invoked."),(0,o.kt)("p",null,"So imagine you had a declarative API for a password rules module that makes heavy use of higher order functions, and features a ",(0,o.kt)("inlineCode",{parentName:"p"},"password")," function that takes in a list of functions that each return a string if the password fails a particular check."),(0,o.kt)("p",null,"Since this password module requires a slightly more complex setup, it might be easier to create a ",(0,o.kt)("inlineCode",{parentName:"p"},"password_module.test.js")," file, and write a few vanilla functions that make use of the module."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'/**\n * @test "HelloWorld"\n * @test "Hello1" returns truthy\n * @test "Hello" returns truthy\n * @test "th1ng$Here" returns falsy\n */\nexport function commonRule (pw) {\n    return password(\n        min(8),\n        max(16),\n        hasDigits(1),\n        hasSpecial(1),\n        hasLowerCase(1),\n        hasUpperCase(1)\n    )(pw)\n}\n')),(0,o.kt)("p",null,"While this approach still encourages the creation of a ",(0,o.kt)("inlineCode",{parentName:"p"},".test.js")," file, this ",(0,o.kt)("inlineCode",{parentName:"p"},".test.js")," file still follows the rules & patterns of everything else in your codebase, and it makes it simpler to run a handful of test cases against your setup."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test 'Poison' returns @ < 25\n * @test 'Water' returns 25\n * @test 'Rock' throws\n * @test 'Ambrosia' returns @ > 25\n */\nfunction personConsumes (substance) {\n    const rick = new Person('Rick', 25)\n    rick.consume(substance)\n    return rick.health\n}\n")),(0,o.kt)("p",null,"However, much like in real life Pineapples are not always the best pairing for certain use cases."),(0,o.kt)("p",null,"If you are going to be testing more complex scenarios against something stateful, it might be ideal to consider an option like ",(0,o.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/@cucumber/cucumber"},"Cucumber"),". Pineapple's goal is not to replace all forms of testing, but instead make unit testing a more digestable experience."))}f.isMDXComponent=!0}}]);