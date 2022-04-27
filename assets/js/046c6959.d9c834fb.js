"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[595],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return d}});var r=n(7294);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,s=function(e,t){if(null==e)return{};var n,r,s={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,s=e.mdxType,o=e.originalType,l=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),m=u(n),d=s,f=m["".concat(l,".").concat(d)]||m[d]||p[d]||o;return n?r.createElement(f,i(i({ref:t},c),{},{components:n})):r.createElement(f,i({ref:t},c))}));function d(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var o=n.length,i=new Array(o);i[0]=m;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a.mdxType="string"==typeof e?e:s,i[1]=a;for(var u=2;u<o;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7881:function(e,t,n){n.r(t),n.d(t,{assets:function(){return c},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return a},metadata:function(){return u},toc:function(){return p}});var r=n(7462),s=n(3366),o=(n(7294),n(3905)),i=["components"],a={sidebar_position:1},l="The Basics",u={unversionedId:"writing-tests/the-basics",id:"writing-tests/the-basics",title:"The Basics",description:'"Returns" / "Resolves" Statements',source:"@site/docs/writing-tests/the-basics.md",sourceDirName:"writing-tests",slug:"/writing-tests/the-basics",permalink:"/website/docs/writing-tests/the-basics",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/writing-tests/the-basics.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Intro",permalink:"/website/docs/intro"},next:{title:"Higher Order Functions",permalink:"/website/docs/writing-tests/higher-order-functions"}},c={},p=[{value:"&quot;Returns&quot; / &quot;Resolves&quot; Statements",id:"returns--resolves-statements",level:2},{value:"Complex Conditions",id:"complex-conditions",level:3},{value:"Snapshots",id:"snapshots",level:2},{value:"Throws / Rejects",id:"throws--rejects",level:2}],m={toc:p};function d(e){var t=e.components,n=(0,s.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"the-basics"},"The Basics"),(0,o.kt)("h2",{id:"returns--resolves-statements"},'"Returns" / "Resolves" Statements'),(0,o.kt)("p",null,'In Pineapple, test cases are introduced as JSDoc annotations above a function. The most simple conditional test case is a "returns" statement.'),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test 1 returns 1\n * @test 2 returns 2\n * @test 5 returns 8\n */\nfunction fibonacci (n) {\n  return n < 2 ? 1 : fibonacci(n - 1) + fibonacci(n - 2)\n}\n\n/**\n * @test 1 resolves to 1\n * @test 2 resolves to 2\n * @test 5 resolves to 8\n */\nfunction async_fibonacci (n) {\n  return n < 2 ? 1 : await async_fibonacci(n - 1) + await async_fibonacci(n - 2)\n}\n")),(0,o.kt)("p",null,"This will run the fibonacci function with each specified set of arguments, in this case 1, then 2, then 5, and compare the result to the right side."),(0,o.kt)("p",null,"To make it easier to express this common type of test case clearly, you are able to express this type of test in several ways."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"For synchronous functions: ",(0,o.kt)("inlineCode",{parentName:"strong"},"is"),", ",(0,o.kt)("inlineCode",{parentName:"strong"},"to")," and ",(0,o.kt)("inlineCode",{parentName:"strong"},"returns")," each do the same thing.")," ",(0,o.kt)("strong",{parentName:"p"},"For asynchronous functions: ",(0,o.kt)("inlineCode",{parentName:"strong"},"resolves"),", ",(0,o.kt)("inlineCode",{parentName:"strong"},"resolves to")," each do the same thing.")),(0,o.kt)("p",null,"You may also compare against objects, as it will automatically perform a deep equals operation for comparison purposes."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test 'name', 'Morty' is { name: 'Morty' }\n * @test 'name', 'Rick' is { name: 'Rick' }\n * @test 'count', 20 is { count: 20 }\n */\nfunction wrap (attr, value) {\n  return { [attr]: value }\n}\n")),(0,o.kt)("h3",{id:"complex-conditions"},"Complex Conditions"),(0,o.kt)("p",null,"If you need to be able to write a more complex test, rather than specifying a value, you may instead write out an expression. Expressions use an ",(0,o.kt)("inlineCode",{parentName:"p"},"@")," symbol to represent the value of the computed result."),(0,o.kt)("p",null,"If an expression is provided, the test will pass if the result is truthy."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test 'Joe' resolves @.friends.length === 0 and @ as { friends: string[] }\n * @test 'Luke' resolves @.friends.length === 3 and @ as { friends: string[] }\n */\nasync function getFriends(name) {\n  // no one but luke has friends in this test.\n  if (name !== 'Luke') return { friends: [] } \n  return {\n    friends: [\n      'Han',\n      'Leia',\n      'Chewbacca'\n    ]\n  }\n}\n")),(0,o.kt)("p",null,"You may use ",(0,o.kt)("inlineCode",{parentName:"p"},"and"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"or"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"&&")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"||")," and most of the common operators."),(0,o.kt)("p",null,"Additionally, as seen above, you may do some schema validation by using ",(0,o.kt)("inlineCode",{parentName:"p"},"as <schema>"),". The schema may either be a valid JSON Schema, a simple typescript definition (unions currently unsupported)."),(0,o.kt)("p",null,"You may also use some shorthand expressions such as ",(0,o.kt)("inlineCode",{parentName:"p"},"truthy")," & ",(0,o.kt)("inlineCode",{parentName:"p"},"falsey")," / ",(0,o.kt)("inlineCode",{parentName:"p"},"falsy")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test 'password1' is truthy and @ is string\n * @test 'p@ssingPa$$word1' is falsy and @ is string\n * @returns {string} An empty string if valid, or a list of issues if invalid.\n */\nfunction checkPassword(pw) { \n//  ... \n}\n")),(0,o.kt)("h2",{id:"snapshots"},"Snapshots"),(0,o.kt)("p",null,"Snapshots are probably one of the better conveniences provided by pineapple. To use them, just specify a test case without any conditions whatsoever."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test -1, 1\n * @test 5, 8\n * @test '6', 39\n */\nfunction add(a, b) {\n  if (typeof a !== 'number' || typeof b !== 'number') throws new Error('Not a number.')\n  return a + b\n}\n")),(0,o.kt)("p",null,"Pineapple will see these test cases, and will prompt you for whether the computed result is correct."),(0,o.kt)("p",null,"If so, it will preserve this result & compare it on all future runs."),(0,o.kt)("p",null,"If the result changes, it will prompt you again to see if you'd like to update the snapshot, unless the test is being run from a continuous integration pipeline (in which is will immediately fail the test)."),(0,o.kt)("p",null,"Snapshots are not just for capturing values, they may also capture whether a specific function is supposed to throw an exception (and with what exception it threw with)."),(0,o.kt)("h2",{id:"throws--rejects"},"Throws / Rejects"),(0,o.kt)("p",null,"In some tests, you may wish to confirm whether a function throws or not,"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"class InfinityError extends Error { \n  // ... \n}\n\n/**\n * @test '6', 39 throws\n * @test 5, Infinity throws InfinityError\n * @test 5, '31' throws \"Not a number.\"\n */\nfunction add(a, b) {\n  if (a === Infinity || b === Infinity) throw new InfinityError()\n  if (typeof a !== 'number' || typeof b !== 'number') throws new Error('Not a number.')\n  return a + b\n}\n")),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"throws")," / ",(0,o.kt)("inlineCode",{parentName:"p"},"rejects")," by itself will merely check if the function threw, but if you specify either a string or an identifier afterwards, it will try to check the constructor name of the error & the message to see if the expected error occurred."))}d.isMDXComponent=!0}}]);