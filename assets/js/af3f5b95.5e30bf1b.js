"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[208],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return d}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),u=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=u(n),d=o,h=m["".concat(l,".").concat(d)]||m[d]||c[d]||r;return n?a.createElement(h,i(i({ref:t},p),{},{components:n})):a.createElement(h,i({ref:t},p))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var u=2;u<r;u++)i[u]=n[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},5853:function(e,t,n){n.r(t),n.d(t,{assets:function(){return p},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return s},metadata:function(){return u},toc:function(){return c}});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),i=["components"],s={tags:["introduction"],sidebar_position:1,date:new Date("2022-05-09T00:00:00.000Z"),authors:[{name:"Jesse Mitchell",title:"Developer of Pineapple",url:"https://github.com/TotalTechGeek",image_url:"https://github.com/TotalTechGeek.png"}]},l="Introducing Pineapple",u={permalink:"/pineapple/blog/introducing-pineapple",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/introducing-pineapple.md",source:"@site/blog/introducing-pineapple.md",title:"Introducing Pineapple",description:"The Pineapple Logo",date:"2022-05-09T00:00:00.000Z",formattedDate:"May 9, 2022",tags:[{label:"introduction",permalink:"/pineapple/blog/tags/introduction"}],readingTime:4.095,truncated:!1,authors:[{name:"Jesse Mitchell",title:"Developer of Pineapple",url:"https://github.com/TotalTechGeek",image_url:"https://github.com/TotalTechGeek.png",imageURL:"https://github.com/TotalTechGeek.png"}],frontMatter:{tags:["introduction"],sidebar_position:1,date:"2022-05-09T00:00:00.000Z",authors:[{name:"Jesse Mitchell",title:"Developer of Pineapple",url:"https://github.com/TotalTechGeek",image_url:"https://github.com/TotalTechGeek.png",imageURL:"https://github.com/TotalTechGeek.png"}]},prevItem:{title:"Introducing Class Tests (v0.6.3)",permalink:"/pineapple/blog/v0.6.3"}},p={authorsImageUrls:[void 0]},c=[{value:"What in the world is Pineapple?",id:"what-in-the-world-is-pineapple",level:2},{value:"But... why?",id:"but-why",level:2},{value:"Got slightly more complex examples?",id:"got-slightly-more-complex-examples",level:2}],m={toc:c};function d(e){var t=e.components,s=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},m,s,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"The Pineapple Logo",src:n(5030).Z,width:"386",height:"393"})),(0,r.kt)("h2",{id:"what-in-the-world-is-pineapple"},"What in the world is Pineapple?"),(0,r.kt)("p",null,"Pineapple is a test framework designed to remove the cruft from writing unit tests and creating snapshots."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * Adds numbers together for the sake of demonstrating pineapple.\n * @test 1, 2 returns 3\n * @test '1', 2 throws \"Not a number\"\n * @param {number} a \n * @param {number} b\n */\nexport function add(a, b) {\n    if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Not a number')\n    return a + b\n}\n")),(0,r.kt)("p",null,"It allows you to embed a few example test-cases in your JSDocs, making it easier to focus on your code and less on defining ",(0,r.kt)("inlineCode",{parentName:"p"},"it")," & ",(0,r.kt)("inlineCode",{parentName:"p"},"expect")," chains. "),(0,r.kt)("p",null,"When you omit conditions from your test cases, it'll automatically capture the result of your test & snapshot it, making it easier to preserve expected behavior in your applications, and even easier for users to find examples on how to call your code."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"An example of the snapshot functionality where the code is modified and the snapshot fails due to a renamed attribute",src:n(7786).Z,width:"1888",height:"1110"})),(0,r.kt)("h2",{id:"but-why"},"But... why?"),(0,r.kt)("p",null,"While there are a lot of great test frameworks out there with solid communities and support, I've found it difficult to introduce testing to certain teams due to the cruft & ergonomics involved."),(0,r.kt)("p",null,"Pineapple is an attempt to make it easier to write your tests, to get more people into the habit of writing them. The idea is that if it's simple (or at least less of a pain) to write a few test cases & also flesh out your documentation, more people will take the opportunity to write them."),(0,r.kt)("p",null,"While frameworks like Mocha are pretty nice, writing some checks idiomatically tends to lead to verbose test-cases. "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"const { add } = require('../../modules/math')\n\ndescribe('A description of your test suite', () => {\n    it('Should be able to add two numbers together', () => {\n        assert.equals(add(1, 2), 3)\n    })\n\n    it('Should throw if one of the parameters is a string', () => {\n        expect(add(1, '2')).to.throw()\n        expect(add('1', 2)).to.throw()\n        expect(add('1', '2')).to.throw()\n    })\n\n    it('should be able to add negative numbers', () => {\n        assert.equals(add(-3, 5), 2)\n    })\n})\n")),(0,r.kt)("p",null,"vs writing"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test 1, 2 returns 3\n * @test 1, '2' throws\n * @test -3, 5 returns 2\n */\nfunction add(a, b) { ... }\n")),(0,r.kt)("p",null,"And sometimes the added verbosity is nice! But sometimes it'd be a little easier to be able to get to the point & provide examples of how to call your functions."),(0,r.kt)("p",null,"I also wanted to make it simple to perform snapshots, because in a handful of cases (particularly on functions with more complex types), I've seen people run the functions & copy-paste the output into an expect clause."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"// Snapshots by default if no conditions are specified :)\n/**\n * @test { name: 'Jesse', term: '8mo' }\n */\nexport async function generateDocument({ name, term }) {\n    return {\n        name,\n        term,\n        lease: await acquireLease({ name, term })\n    }\n}\n")),(0,r.kt)("h2",{id:"got-slightly-more-complex-examples"},"Got slightly more complex examples?"),(0,r.kt)("p",null,"In some cases, you may want to set up a more complex test, these are the times that ",(0,r.kt)("inlineCode",{parentName:"p"},".test.js")," files are warranted in Pineapple."),(0,r.kt)("p",null,"This allows you to compose a handful of test cases on the same code, while remaining true to vanilla javascript. Ideally the tests that would be created would be a function that you might find in a real-world implementation of your APIs."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'/**\n * @test "HelloWorld"\n * @test "Hello1" returns truthy\n * @test "Hello" returns truthy\n * @test "th1ng$Here" returns falsy\n */\nexport function commonRule (pw) {\n    return password(\n        min(8),\n        max(16),\n        hasDigits(1),\n        hasSpecial(1),\n        hasLowerCase(1),\n        hasUpperCase(1)\n    )(pw)\n}\n')),(0,r.kt)("p",null,"Pineapple can also be used to test classes, though if you get to a point where you're needing to compose numerous scenarios across multiple entities, it might be ideal to start exploring a Scenario Testing framework like Cucumber. :)"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * A basic bank account class that allows for withdrawing & depositing money.\n *\n * @test 100 \n * ~> $.withdraw(10) \n * ~> $.deposit(20) returns $.balance === 110\n * \n * @test 0 \n * ~> $.withdraw(100) throws 'Insufficient funds'\n * ~> $.deposit(50) returns 50\n * ~> $.withdraw(20) returns 30\n * \n * @test 100 \n * ~> $.withdraw(-10) throws \n * ~> $.deposit(-10) throws\n */\n export class Account {\n    constructor(balance) {\n        this.balance = balance\n    }\n\n    withdraw (amount) {\n        if (amount < 0) throw new Error('Amount must be greater than zero')\n        if (this.balance < amount) throw new Error('Insufficient funds')\n        return this.balance -= amount\n    }\n\n    deposit (amount) {\n        if (amount < 0) throw new Error('Amount must be greater than zero')\n        return this.balance += amount\n    }\n}\n")),(0,r.kt)("p",null,"Pineapple isn't meant to replace all forms of testing; just your basic unit tests & similar."),(0,r.kt)("p",null,"As of May 9th 2022, the project still has not had a v1.0 release, thus should still be considered experimental. There are still some edges to round out before a stable release, but the technology is functional. :)"))}d.isMDXComponent=!0},5030:function(e,t,n){t.Z=n.p+"assets/images/pineapple-d497998e89eb8d86a909f81cd783d3b6.png"},7786:function(e,t,n){t.Z=n.p+"assets/images/snapshot-9e4fdb67d4bd16ddbd686aecf477d0df.gif"}}]);