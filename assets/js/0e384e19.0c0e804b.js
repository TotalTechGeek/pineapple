"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9671],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(n),m=o,f=d["".concat(l,".").concat(m)]||d[m]||u[m]||a;return n?r.createElement(f,i(i({ref:t},c),{},{components:n})):r.createElement(f,i({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var p=2;p<a;p++)i[p]=n[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9881:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>p});var r=n(7462),o=(n(7294),n(3905));const a={sidebar_position:1},i="Intro",s={unversionedId:"intro",id:"intro",title:"Intro",description:"What is this?",source:"@site/docs/intro.md",sourceDirName:".",slug:"/intro",permalink:"/pineapple/docs/intro",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"The Basics",permalink:"/pineapple/docs/writing-tests/the-basics"}},l={},p=[{value:"What is this?",id:"what-is-this",level:2},{value:"To Install",id:"to-install",level:2},{value:"To Run",id:"to-run",level:2},{value:"Example",id:"example",level:4}],c={toc:p};function u(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"intro"},"Intro"),(0,o.kt)("h2",{id:"what-is-this"},"What is this?"),(0,o.kt)("p",null,"Pineapple is a test framework designed to remove the cruft from writing unit tests and creating snapshots."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"/**\n * Adds numbers together for the sake of demonstrating pineapple.\n * @test 1, 2 returns 3\n * @test '1', 2 throws \"Not a number\"\n * @param {number} a \n * @param {number} b\n */\nexport function add(a, b) {\n    if (typeof a !== 'number' || typeof b !== 'number') throw new Error('Not a number')\n    return a + b\n}\n")),(0,o.kt)("p",null,"Pineapple allows you to embed a few example test-cases in your JSDocs, making it easier to focus on your code and less on defining ",(0,o.kt)("inlineCode",{parentName:"p"},"it")," & ",(0,o.kt)("inlineCode",{parentName:"p"},"expect")," chains."),(0,o.kt)("p",null,"When you omit conditions from your test cases, Pineapple will automatically capture the result of your test & snapshot it, making it easier to preserve expected behavior in your applications, and even easier for users to find examples on how to call your code."),(0,o.kt)("img",{alt:"An example of the snapshot functionality where the code is modified and the snapshot fails due to a renamed attribute",src:"../img/snapshot.gif",width:"60%"}),(0,o.kt)("h2",{id:"to-install"},"To Install"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"npm i pineapple --save-dev\n")),(0,o.kt)("p",null,"or"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"yarn add pineapple --dev\n")),(0,o.kt)("p",null,"Alternatively, you may install the runner globally (add a ",(0,o.kt)("inlineCode",{parentName:"p"},"-g")," flag)."),(0,o.kt)("h2",{id:"to-run"},"To Run"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},'Usage: pineapple [options]\n\nOptions:\n  -V, --version             output the version number\n  -i, --include <files...>  Comma separated globs of files.\n  -a, --accept-all          Accept all snapshots.\n  -u, --update-all          Update all snapshots.\n  -t, --typescript          Enables typescript (slower).\n  --only <lines...>         Allows you to specify which tests you would like to\n                            run.\n  -f, --format <format>     The output format (choices: "json", "console",\n                            default: "console")\n  -h, --help                display help for command\n')),(0,o.kt)("h4",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"pineapple -i src/**/*.js\n")))}u.isMDXComponent=!0}}]);