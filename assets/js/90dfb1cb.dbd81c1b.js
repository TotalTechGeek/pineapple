"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6545],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>h});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},b=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),b=c(n),h=a,d=b["".concat(l,".").concat(h)]||b[h]||u[h]||o;return n?r.createElement(d,i(i({ref:t},p),{},{components:n})):r.createElement(d,i({ref:t},p))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=b;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}b.displayName="MDXCreateElement"},2682:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:3},i="Data Tables",s={unversionedId:"scenario-testing/tables",id:"scenario-testing/tables",title:"Data Tables",description:"Since data tables are common in scenario frameworks, Pineapple exposes a few utilities for importing data tables as arbitraries (which makes it easier to try a handful of possibilities).",source:"@site/docs/scenario-testing/tables.md",sourceDirName:"scenario-testing",slug:"/scenario-testing/tables",permalink:"/docs/scenario-testing/tables",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/scenario-testing/tables.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Changes from Cucumber",permalink:"/docs/scenario-testing/differences"},next:{title:"Output Format",permalink:"/docs/framework-documentation/output-format"}},l={},c=[{value:"Header Table",id:"header-table",level:2},{value:"Array Table",id:"array-table",level:2},{value:"Example Usage",id:"example-usage",level:2}],p={toc:c};function u(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"data-tables"},"Data Tables"),(0,a.kt)("p",null,"Since data tables are common in scenario frameworks, Pineapple exposes a few utilities for importing data tables as arbitraries (which makes it easier to try a handful of possibilities)."),(0,a.kt)("p",null,"The library tries to support both Cucumber-style tables and markdown-style tables."),(0,a.kt)("h2",{id:"header-table"},"Header Table"),(0,a.kt)("p",null,'If you\'d like the entries to be read in as objects, use "Header Table" to indicate that the first row should be parsed as keys for the table.'),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @pineapple_define\n */\nexport const Books = HeaderTable('Books', `\n| title                                | author      |\n| ------------------------------------ | ----------- |\n| The Devil in the White City          | Erik Larson |\n| The Lion, the Witch and the Wardrobe | C.S. Lewis  |\n| In the Garden of Beasts              | Erik Larson |\n`)\n")),(0,a.kt)("p",null,"This will pull each of the entries into ",(0,a.kt)("inlineCode",{parentName:"p"},"#Books"),", the name given in the method."),(0,a.kt)("h2",{id:"array-table"},"Array Table"),(0,a.kt)("p",null,"If there is no header, and you'd prefer for each row to be split into an array, use ",(0,a.kt)("inlineCode",{parentName:"p"},"ArrayTable"),"."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * @pineapple_define\n */\nexport const ArrayBooks = HeaderTable('ArrayBooks', `\n| The Devil in the White City          | Erik Larson |\n| The Lion, the Witch and the Wardrobe | C.S. Lewis  |\n| In the Garden of Beasts              | Erik Larson |\n`)\n")),(0,a.kt)("h2",{id:"example-usage"},"Example Usage"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { Steps, HeaderTable } from 'pineapple'\nimport assert from 'assert'\n\ntype Book = { title: string, author: string }\nconst { Given, When, Then, Scenario } = Steps<{ book: Book, inStock: number }>()\n\nGiven(\"a book titled {title} written by {author}\", function ({ title, author }) {\n    this.book = { title, author }\n    this.inStock = library.getCountInStock(this.book)\n})\n\nWhen(\"I return the book to the library\", function () {\n    library.return(this.book)\n})\n\nThen(\"there should be one more of this book available in the library\", function () {\n    assert.equal(this.inStock + 1, library.getCountInStock(this.book))\n})\n\n/**\n * @pineapple_define\n */\n export const Books = HeaderTable('Books', `\n | title                                | author      |\n | ------------------------------------ | ----------- |\n | The Devil in the White City          | Erik Larson |\n | The Lion, the Witch and the Wardrobe | C.S. Lewis  |\n | In the Garden of Beasts              | Erik Larson |\n `)\n\n\n/**\n * The following will run the scenario with each of the books\n * in the table.\n * @test #Books resolves\n */\nexport const ReturnBooks = Scenario`\nGiven a book titled {title} written by {author}\nWhen I return the book to the library\nThen there should be one more of this book available in the library`\n")))}u.isMDXComponent=!0}}]);