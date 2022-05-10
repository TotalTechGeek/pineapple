"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[675],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var s=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,s)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,s,r=function(e,t){if(null==e)return{};var n,s,r={},a=Object.keys(e);for(s=0;s<a.length;s++)n=a[s],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(s=0;s<a.length;s++)n=a[s],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=s.createContext({}),l=function(e){var t=s.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=l(e.components);return s.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return s.createElement(s.Fragment,{},t)}},d=s.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=l(n),m=r,h=d["".concat(c,".").concat(m)]||d[m]||p[m]||a;return n?s.createElement(h,o(o({ref:t},u),{},{components:n})):s.createElement(h,o({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var l=2;l<a;l++)o[l]=n[l];return s.createElement.apply(null,o)}return s.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3573:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return i},metadata:function(){return l},toc:function(){return p}});var s=n(7462),r=n(3366),a=(n(7294),n(3905)),o=["components"],i={sidebar_position:4},c="Testing Classes",l={unversionedId:"writing-tests/testing-classes",id:"writing-tests/testing-classes",title:"Testing Classes",description:"Normal Classes",source:"@site/docs/writing-tests/testing-classes.md",sourceDirName:"writing-tests",slug:"/writing-tests/testing-classes",permalink:"/pineapple/docs/writing-tests/testing-classes",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/writing-tests/testing-classes.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"More Complex Tests",permalink:"/pineapple/docs/writing-tests/more-complex-tests"},next:{title:"Adding Methods to Pineapple",permalink:"/pineapple/docs/writing-tests/adding-methods-to-pineapple"}},u={},p=[{value:"Normal Classes",id:"normal-classes",level:2},{value:"Static Methods in Classes",id:"static-methods-in-classes",level:2},{value:"Classes that return Functions",id:"classes-that-return-functions",level:2}],d={toc:p};function m(e){var t=e.components,n=(0,r.Z)(e,o);return(0,a.kt)("wrapper",(0,s.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"testing-classes"},"Testing Classes"),(0,a.kt)("h2",{id:"normal-classes"},"Normal Classes"),(0,a.kt)("p",null,"Starting in version ",(0,a.kt)("inlineCode",{parentName:"p"},"v0.6.1"),", you are now able to test classes using the Higher-Order Function syntax. "),(0,a.kt)("p",null,"This allows you to test more complex processes & functionality, and avoid too much cruft."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * A basic bank account class; allows for withdrawing & depositing money.\n * \n * @test 100 \n * ~> $.withdraw(10) \n * ~> $.deposit(20) returns $.balance === 110\n * \n * @test 0 ~> $.withdraw(100) throws 'Insufficient funds'\n * \n * @test 0 \n * ~> $.deposit(30) \n * ~> $.deposit(10) returns $.balance === 40 \n * ~> $.withdraw(20) \n * ~> $.withdraw(30) throws 'Insufficient funds'\n * \n * @test 100 \n * ~> $.withdraw(-10) throws \n * ~> $.deposit(-10) throws\n */\n export class Account {\n    constructor(balance) {\n        this.balance = balance\n    }\n\n    withdraw (amount) {\n        if (amount < 0) throw new Error('Amount must be greater than zero')\n        if (this.balance < amount) throw new Error('Insufficient funds')\n        this.balance -= amount\n    }\n\n    deposit (amount) {\n        if (amount < 0) throw new Error('Amount must be greater than zero')\n        this.balance += amount\n    }\n}\n")),(0,a.kt)("p",null,"The first part in the chain will be the arguments that are passed into the constructor, and from then on you'll be able to invoke functions on the class by using ",(0,a.kt)("inlineCode",{parentName:"p"},"$.funcName(...arguments)"),". "),(0,a.kt)("p",null,"At each step in the chain, you will be able to test conditions (for example, to check the current balance of the class instance, or the result of the function call)."),(0,a.kt)("p",null,"Let's examine a slightly better ",(0,a.kt)("inlineCode",{parentName:"p"},"Account")," implementation,"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * A basic bank account class; allows for withdrawing & depositing money.\n * \n * @test 50 \n * ~> $.deposit(30) returns 80 \n * ~> $.withdraw(20) returns 60\n * \n * @test 0 \n * ~> $.deposit(10) \n * ~> $.deposit(30) returns 40 \n * ~> $.withdraw(5) returns @ === 35 and $.transactions === 3\n */\n export class Account2 {\n    constructor(balance) {\n        this.balance = balance\n        this.transactions = 0\n    }\n\n    withdraw (amount) {\n        if (amount < 0) throw new Error('Amount must be greater than zero')\n        if (this.balance < amount) throw new Error('Insufficient funds')\n        this.balance -= amount\n        this.transactions++\n        return this.balance\n    }\n\n    deposit (amount) {\n        if (amount < 0) throw new Error('Amount must be greater than zero')\n        this.balance += amount\n        this.transactions++\n        return this.balance\n    }\n}\n")),(0,a.kt)("p",null,"As you can see, each step in the chain can be tested separately. If writing a complex condition, you may use ",(0,a.kt)("inlineCode",{parentName:"p"},"@")," to reference the result of the function call, and ",(0,a.kt)("inlineCode",{parentName:"p"},"$")," to reference the current instance of the class."),(0,a.kt)("p",null,"Functions on a class may only be invoked from the left-hand side of the expression, and its properties may only be accessed on the right side."),(0,a.kt)("h2",{id:"static-methods-in-classes"},"Static Methods in Classes"),(0,a.kt)("p",null,"Static methods in classes may be tested using ",(0,a.kt)("inlineCode",{parentName:"p"},"@test_static"),". "),(0,a.kt)("p",null,"You do not need to provide arguments for a constructor like you typically would for a class test."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test_static $.add(5, 3) returns 8\n * @test_static $.getPrevious() returns 8\n */\nexport class Math {\n    static previousResult = null\n    static add(a, b) {\n        return this.previousResult = a + b\n    }\n\n    static getPrevious() {\n        return this.previousResult\n    }\n}\n")),(0,a.kt)("h2",{id:"classes-that-return-functions"},"Classes that return Functions"),(0,a.kt)("p",null,"If you have a case where a class returns a function, you may invoke the result by just passing arguments in the next step,"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @test 10 ~> $.getAdd() ~> 5 returns 15\n */\nexport class Adder {\n    constructor(value) {\n        this.value = value\n    }\n\n    getAdd () {\n        return num => num + this.value \n    }\n}\n")))}m.isMDXComponent=!0}}]);