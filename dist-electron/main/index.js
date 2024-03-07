"use strict";var Ae=Object.defineProperty;var Te=(r,e,t)=>e in r?Ae(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var p=(r,e,t)=>(Te(r,typeof e!="symbol"?e+"":e,t),t);const f=require("electron"),Pe=require("node:os"),w=require("node:path"),T=require("electron-updater"),_=require("os"),S=require("path"),j=require("fs"),Ce=require("util"),pe=require("events"),Ie=require("http"),Me=require("https"),fe=require("child_process"),he=require("fs-extra");function Re(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var de={exports:{}};const z=_,Ne=S;let l;try{l=require("electron")}catch{l=null}var A={getAppUserDataPath(){return K("userData")},getName:Z,getPath:K,getVersion:X,getVersions(){return{app:`${Z()} ${X()}`,electron:`Electron ${process.versions.electron}`,os:We()}},isDev(){const r=C();return(r==null?void 0:r.isPackaged)!==void 0?!r.isPackaged:typeof process.execPath=="string"?Ne.basename(process.execPath).toLowerCase().startsWith("electron"):process.env.NODE_ENV==="development"||process.env.ELECTRON_IS_DEV==="1"},isElectron(){return!!process.versions.electron},onAppEvent(r,e){var t;return(t=l==null?void 0:l.app)==null||t.on(r,e),()=>{var n;(n=l==null?void 0:l.app)==null||n.off(r,e)}},onEveryWebContentsEvent(r,e){var n,o;return(n=l==null?void 0:l.webContents)==null||n.getAllWebContents().forEach(s=>{s.on(r,e)}),(o=l==null?void 0:l.app)==null||o.on("web-contents-created",t),()=>{var s,i;(s=l==null?void 0:l.webContents)==null||s.getAllWebContents().forEach(a=>{a.off(r,e)}),(i=l==null?void 0:l.app)==null||i.off("web-contents-created",t)};function t(s,i){i.on(r,e)}},onIpc(r,e){var t;(t=U())==null||t.on(r,e)},onIpcInvoke(r,e){var t,n;(n=(t=U())==null?void 0:t.handle)==null||n.call(t,r,e)},openUrl(r,e=console.error){var t;(t=k("shell"))==null||t.openExternal(r).catch(e)},setPreloadFileForSessions({filePath:r,includeFutureSession:e=!0,sessions:t=[(n=>(n=l==null?void 0:l.session)==null?void 0:n.defaultSession)()]}){var s;for(const i of t.filter(Boolean))o(i);e&&((s=l==null?void 0:l.app)==null||s.on("session-created",i=>{o(i)}));function o(i){i.setPreloads([...i.getPreloads(),r])}},sendIpc(r,e){process.type==="browser"?Ue(r,e):process.type==="renderer"&&ke(r,e)},showErrorBox(r,e){const t=k("dialog");t&&t.showErrorBox(r,e)},whenAppReady(){var r;return((r=l==null?void 0:l.app)==null?void 0:r.whenReady())||Promise.resolve()}};function C(){return k("app")}function Z(){const r=C();return r?"name"in r?r.name:r.getName():null}function k(r){return(l==null?void 0:l[r])||null}function U(){return process.type==="browser"&&(l!=null&&l.ipcMain)?l.ipcMain:process.type==="renderer"&&(l!=null&&l.ipcRenderer)?l.ipcRenderer:null}function X(){const r=C();return r?"version"in r?r.version:r.getVersion():null}function We(){let r=z.type().replace("_"," "),e=z.release();return r==="Darwin"&&(r="macOS",e=ze()),`${r} ${e}`}function ze(){const r=Number(z.release().split(".")[0]);return r<=19?`10.${r-4}`:r-9}function K(r){const e=C();if(!e)return null;try{return e.getPath(r)}catch{return null}}function ke(r,e){var t;(t=U())==null||t.send(r,e)}function Ue(r,e){var t;(t=l==null?void 0:l.BrowserWindow)==null||t.getAllWindows().forEach(n=>{var o;((o=n.webContents)==null?void 0:o.isDestroyed())===!1&&n.webContents.send(r,e)})}var ge={exports:{}};(function(r){let e={};try{e=require("electron")}catch{}e.ipcRenderer&&t(e),r.exports=t;function t({contextBridge:n,ipcRenderer:o}){if(!o)return;o.on("__ELECTRON_LOG_IPC__",(i,a)=>{window.postMessage({cmd:"message",...a})}),o.invoke("__ELECTRON_LOG__",{cmd:"getOptions"}).catch(i=>console.error(new Error(`electron-log isn't initialized in the main process. Please call log.initialize() before. ${i.message}`)));const s={sendToMain(i){try{o.send("__ELECTRON_LOG__",i)}catch(a){console.error("electronLog.sendToMain ",a,"data:",i),o.send("__ELECTRON_LOG__",{cmd:"errorHandler",error:{message:a==null?void 0:a.message,stack:a==null?void 0:a.stack},errorName:"sendToMain"})}},log(...i){s.sendToMain({data:i,level:"info"})}};for(const i of["error","warn","info","verbose","debug","silly"])s[i]=(...a)=>s.sendToMain({data:a,level:i});if(n&&process.contextIsolated)try{n.exposeInMainWorld("__electronLog",s)}catch{}typeof window=="object"?window.__electronLog=s:__electronLog=s}})(ge);var qe=ge.exports;const ee=j,Ve=_,te=S,P=A,Be=qe;var Je={initialize({logger:r,preload:e=!0,spyRendererConsole:t=!1}){P.whenAppReady().then(()=>{e&&He(e),t&&Ge(r)}).catch(r.warn)}};function He(r){let e=typeof r=="string"?r:te.resolve(__dirname,"../renderer/electron-log-preload.js");if(!ee.existsSync(e)){e=te.join(P.getAppUserDataPath()||Ve.tmpdir(),"electron-log-preload.js");const t=`
      try {
        (${Be.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;ee.writeFileSync(e,t,"utf8")}P.setPreloadFileForSessions({filePath:e})}function Ge(r){const e=["verbose","info","warning","error"];P.onEveryWebContentsEvent("console-message",(t,n,o)=>{r.processMessage({data:[o],level:e[n],variables:{processType:"renderer"}})})}var I={transform:Qe};function Qe({logger:r,message:e,transport:t,initialData:n=(e==null?void 0:e.data)||[],transforms:o=t==null?void 0:t.transforms}){return o.reduce((s,i)=>typeof i=="function"?i({data:s,logger:r,message:e,transport:t}):s,n)}const{transform:Ye}=I;var ye={concatFirstStringElements:Ze,formatScope:re,formatText:oe,formatVariables:ne,timeZoneFromOffset:me,format({message:r,logger:e,transport:t,data:n=r==null?void 0:r.data}){switch(typeof t.format){case"string":return Ye({message:r,logger:e,transforms:[ne,re,oe],transport:t,initialData:[t.format,...n]});case"function":return t.format({data:n,level:(r==null?void 0:r.level)||"info",logger:e,message:r,transport:t});default:return n}}};function Ze({data:r}){return typeof r[0]!="string"||typeof r[1]!="string"||r[0].match(/%[1cdfiOos]/)?r:[`${r[0]} ${r[1]}`,...r.slice(2)]}function me(r){const e=Math.abs(r),t=r>=0?"-":"+",n=Math.floor(e/60).toString().padStart(2,"0"),o=(e%60).toString().padStart(2,"0");return`${t}${n}:${o}`}function re({data:r,logger:e,message:t}){const{defaultLabel:n,labelLength:o}=(e==null?void 0:e.scope)||{},s=r[0];let i=t.scope;i||(i=n);let a;return i===""?a=o>0?"".padEnd(o+3):"":typeof i=="string"?a=` (${i})`.padEnd(o+3):a="",r[0]=s.replace("{scope}",a),r}function ne({data:r,message:e}){let t=r[0];if(typeof t!="string")return r;t=t.replace("{level}]",`${e.level}]`.padEnd(6," "));const n=e.date||new Date;return r[0]=t.replace(/\{(\w+)}/g,(o,s)=>{var i;switch(s){case"level":return e.level||"info";case"logId":return e.logId;case"y":return n.getFullYear().toString(10);case"m":return(n.getMonth()+1).toString(10).padStart(2,"0");case"d":return n.getDate().toString(10).padStart(2,"0");case"h":return n.getHours().toString(10).padStart(2,"0");case"i":return n.getMinutes().toString(10).padStart(2,"0");case"s":return n.getSeconds().toString(10).padStart(2,"0");case"ms":return n.getMilliseconds().toString(10).padStart(3,"0");case"z":return me(n.getTimezoneOffset());case"iso":return n.toISOString();default:return((i=e.variables)==null?void 0:i[s])||o}}).trim(),r}function oe({data:r}){const e=r[0];if(typeof e!="string")return r;if(e.lastIndexOf("{text}")===e.length-6)return r[0]=e.replace(/\s?{text}/,""),r[0]===""&&r.shift(),r;const n=e.split("{text}");let o=[];return n[0]!==""&&o.push(n[0]),o=o.concat(r.slice(1)),n[1]!==""&&o.push(n[1]),o}var ve={exports:{}};(function(r){const e=Ce;r.exports={serialize:n,maxDepth({data:o,transport:s,depth:i=(s==null?void 0:s.depth)??6}){if(!o)return o;if(i<1)return Array.isArray(o)?"[array]":typeof o=="object"&&o?"[object]":o;if(Array.isArray(o))return o.map(c=>r.exports.maxDepth({data:c,depth:i-1}));if(typeof o!="object"||o&&typeof o.toISOString=="function")return o;if(o===null)return null;if(o instanceof Error)return o;const a={};for(const c in o)Object.prototype.hasOwnProperty.call(o,c)&&(a[c]=r.exports.maxDepth({data:o[c],depth:i-1}));return a},toJSON({data:o}){return JSON.parse(JSON.stringify(o,t()))},toString({data:o,transport:s}){const i=(s==null?void 0:s.inspectOptions)||{},a=o.map(c=>{if(c!==void 0)try{const u=JSON.stringify(c,t(),"  ");return u===void 0?void 0:JSON.parse(u)}catch{return c}});return e.formatWithOptions(i,...a)}};function t(o={}){const s=new WeakSet;return function(i,a){if(typeof a=="object"&&a!==null){if(s.has(a))return;s.add(a)}return n(i,a,o)}}function n(o,s,i={}){const a=(i==null?void 0:i.serializeMapAndSet)!==!1;return s instanceof Error?s.stack:s&&(typeof s=="function"?`[function] ${s.toString()}`:a&&s instanceof Map&&Object.fromEntries?Object.fromEntries(s):a&&s instanceof Set&&Array.from?Array.from(s):s)}})(ve);var H=ve.exports,G={transformStyles:R,applyAnsiStyles({data:r}){return R(r,Xe,Ke)},removeStyles({data:r}){return R(r,()=>"")}};const we={unset:"\x1B[0m",black:"\x1B[30m",red:"\x1B[31m",green:"\x1B[32m",yellow:"\x1B[33m",blue:"\x1B[34m",magenta:"\x1B[35m",cyan:"\x1B[36m",white:"\x1B[37m"};function Xe(r){const e=r.replace(/color:\s*(\w+).*/,"$1").toLowerCase();return we[e]||""}function Ke(r){return r+we.unset}function R(r,e,t){const n={};return r.reduce((o,s,i,a)=>{if(n[i])return o;if(typeof s=="string"){let c=i,u=!1;s=s.replace(/%[1cdfiOos]/g,h=>{if(c+=1,h!=="%c")return h;const d=a[c];return typeof d=="string"?(n[c]=!0,u=!0,e(d,s)):h}),u&&t&&(s=t(s))}return o.push(s),o},[])}const{concatFirstStringElements:et,format:tt}=ye,{maxDepth:rt,toJSON:nt}=H,{applyAnsiStyles:ot,removeStyles:st}=G,{transform:it}=I,se={error:console.error,warn:console.warn,info:console.info,verbose:console.info,debug:console.debug,silly:console.debug,log:console.log};var at=be;const ct=process.platform==="win32"?">":"›",Q=`%c{h}:{i}:{s}.{ms}{scope}%c ${ct} {text}`;Object.assign(be,{DEFAULT_FORMAT:Q});function be(r){return Object.assign(e,{format:Q,level:"silly",transforms:[lt,tt,pt,et,rt,nt],useStyles:process.env.FORCE_STYLES,writeFn({message:t}){(se[t.level]||se.info)(...t.data)}});function e(t){const n=it({logger:r,message:t,transport:e});e.writeFn({message:{...t,data:n}})}}function lt({data:r,message:e,transport:t}){return t.format!==Q?r:[`color:${ft(e.level)}`,"color:unset",...r]}function ut(r,e){if(typeof r=="boolean")return r;const n=e==="error"||e==="warn"?process.stderr:process.stdout;return n&&n.isTTY}function pt(r){const{message:e,transport:t}=r;return(ut(t.useStyles,e.level)?ot:st)(r)}function ft(r){const e={error:"red",warn:"yellow",info:"cyan",default:"unset"};return e[r]||e.default}const ht=pe,b=j,ie=_;let dt=class extends ht{constructor({path:t,writeOptions:n={encoding:"utf8",flag:"a",mode:438},writeAsync:o=!1}){super();p(this,"asyncWriteQueue",[]);p(this,"bytesWritten",0);p(this,"hasActiveAsyncWriting",!1);p(this,"path",null);p(this,"initialSize");p(this,"writeOptions",null);p(this,"writeAsync",!1);this.path=t,this.writeOptions=n,this.writeAsync=o}get size(){return this.getSize()}clear(){try{return b.writeFileSync(this.path,"",{mode:this.writeOptions.mode,flag:"w"}),this.reset(),!0}catch(t){return t.code==="ENOENT"?!0:(this.emit("error",t,this),!1)}}crop(t){try{const n=gt(this.path,t||4096);this.clear(),this.writeLine(`[log cropped]${ie.EOL}${n}`)}catch(n){this.emit("error",new Error(`Couldn't crop file ${this.path}. ${n.message}`),this)}}getSize(){if(this.initialSize===void 0)try{const t=b.statSync(this.path);this.initialSize=t.size}catch{this.initialSize=0}return this.initialSize+this.bytesWritten}increaseBytesWrittenCounter(t){this.bytesWritten+=Buffer.byteLength(t,this.writeOptions.encoding)}isNull(){return!1}nextAsyncWrite(){const t=this;if(this.hasActiveAsyncWriting||this.asyncWriteQueue.length===0)return;const n=this.asyncWriteQueue.join("");this.asyncWriteQueue=[],this.hasActiveAsyncWriting=!0,b.writeFile(this.path,n,this.writeOptions,o=>{t.hasActiveAsyncWriting=!1,o?t.emit("error",new Error(`Couldn't write to ${t.path}. ${o.message}`),this):t.increaseBytesWrittenCounter(n),t.nextAsyncWrite()})}reset(){this.initialSize=void 0,this.bytesWritten=0}toString(){return this.path}writeLine(t){if(t+=ie.EOL,this.writeAsync){this.asyncWriteQueue.push(t),this.nextAsyncWrite();return}try{b.writeFileSync(this.path,t,this.writeOptions),this.increaseBytesWrittenCounter(t)}catch(n){this.emit("error",new Error(`Couldn't write to ${this.path}. ${n.message}`),this)}}};var Ee=dt;function gt(r,e){const t=Buffer.alloc(e),n=b.statSync(r),o=Math.min(n.size,e),s=Math.max(0,n.size-e),i=b.openSync(r,"r"),a=b.readSync(i,t,0,o,s);return b.closeSync(i),t.toString("utf8",0,a)}const yt=Ee;let mt=class extends yt{clear(){}crop(){}getSize(){return 0}isNull(){return!0}writeLine(){}};var vt=mt;const wt=pe,ae=j,ce=S,bt=Ee,Et=vt;let St=class extends wt{constructor(){super();p(this,"store",{});this.emitError=this.emitError.bind(this)}provide({filePath:t,writeOptions:n,writeAsync:o=!1}){let s;try{if(t=ce.resolve(t),this.store[t])return this.store[t];s=this.createFile({filePath:t,writeOptions:n,writeAsync:o})}catch(i){s=new Et({path:t}),this.emitError(i,s)}return s.on("error",this.emitError),this.store[t]=s,s}createFile({filePath:t,writeOptions:n,writeAsync:o}){return this.testFileWriting(t),new bt({path:t,writeOptions:n,writeAsync:o})}emitError(t,n){this.emit("error",t,n)}testFileWriting(t){ae.mkdirSync(ce.dirname(t),{recursive:!0}),ae.writeFileSync(t,"",{flag:"a"})}};var Ot=St;const Se=j,x=S;var Lt={readPackageJson:$t,tryReadJsonAt:O};function $t(){return O(require.main&&require.main.filename)||O(Ft())||O(process.resourcesPath,"app.asar")||O(process.resourcesPath,"app")||O(process.cwd())||{name:null,version:null}}function O(...r){if(!r[0])return null;try{const e=x.join(...r),t=xt("package.json",e);if(!t)return null;const n=JSON.parse(Se.readFileSync(t,"utf8")),o=n.productName||n.name;if(!o||o.toLowerCase()==="electron")return null;if(n.productName||n.name)return{name:o,version:n.version}}catch{return null}}function xt(r,e){let t=e;for(;;){const n=x.parse(t),o=n.root,s=n.dir;if(Se.existsSync(x.join(t,r)))return x.resolve(x.join(t,r));if(t===o)return null;t=s}}function Ft(){const r=process.argv.filter(t=>t.indexOf("--user-data-dir=")===0);return r.length===0||typeof r[0]!="string"?null:r[0].replace("--user-data-dir=","")}const q=_,v=S,E=A,Dt=Lt;var _t={getAppData:D,getLibraryDefaultDir:Oe,getLibraryTemplate:Le,getNameAndVersion:$e,getPathVariables:jt,getUserData:Y};function D(r){const e=E.getPath("appData");if(e)return e;const t=M();switch(r){case"darwin":return v.join(t,"Library/Application Support");case"win32":return process.env.APPDATA||v.join(t,"AppData/Roaming");default:return process.env.XDG_CONFIG_HOME||v.join(t,".config")}}function M(){return q.homedir?q.homedir():process.env.HOME}function Oe(r,e){return r==="darwin"?v.join(M(),"Library/Logs",e):v.join(Y(r,e),"logs")}function Le(r){return r==="darwin"?v.join(M(),"Library/Logs","{appName}"):v.join(D(r),"{appName}","logs")}function $e(){let r=E.getName()||"",e=E.getVersion();if(r.toLowerCase()==="electron"&&(r="",e=""),r&&e)return{name:r,version:e};const t=Dt.readPackageJson();return r||(r=t.name),e||(e=t.version),r||(r="Electron"),{name:r,version:e}}function jt(r){const e=$e(),t=e.name,n=e.version;return{appData:D(r),appName:t,appVersion:n,get electronDefaultDir(){return E.getPath("logs")},home:M(),libraryDefaultDir:Oe(r,t),libraryTemplate:Le(r),temp:E.getPath("temp")||q.tmpdir(),userData:Y(r,t)}}function Y(r,e){return E.getName()!==e?v.join(D(r),e):E.getPath("userData")||v.join(D(r),e)}const N=j,$=S,At=_,Tt=Ot,Pt=_t,{transform:Ct}=I,{removeStyles:It}=G,{format:Mt}=ye,{toString:Rt}=H;var Nt=zt;const Wt=new Tt;function zt(r,e=Wt){let t;return e.listenerCount("error")<1&&e.on("error",(c,u)=>{s(`Can't write to ${u}`,c)}),Object.assign(n,{fileName:kt(r.variables.processType),format:"[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",getFile:i,inspectOptions:{depth:5},level:"silly",maxSize:1024**2,readAllLogs:a,sync:!0,transforms:[It,Mt,Rt],writeOptions:{flag:"a",mode:438,encoding:"utf8"},archiveLogFn(c){const u=c.toString(),h=$.parse(u);try{N.renameSync(u,$.join(h.dir,`${h.name}.old${h.ext}`))}catch(d){s("Could not rotate log",d);const y=Math.round(n.maxSize/4);c.crop(Math.min(y,256*1024))}},resolvePathFn(c){return $.join(c.libraryDefaultDir,c.fileName)}});function n(c){const u=i(c);n.maxSize>0&&u.size>n.maxSize&&(n.archiveLogFn(u),u.reset());const d=Ct({logger:r,message:c,transport:n});u.writeLine(d)}function o(){t||(t=Object.create(Object.prototype,{...Object.getOwnPropertyDescriptors(Pt.getPathVariables(process.platform)),fileName:{get(){return n.fileName},enumerable:!0}}),typeof n.archiveLog=="function"&&(n.archiveLogFn=n.archiveLog,s("archiveLog is deprecated. Use archiveLogFn instead")),typeof n.resolvePath=="function"&&(n.resolvePathFn=n.resolvePath,s("resolvePath is deprecated. Use resolvePathFn instead")))}function s(c,u=null,h="error"){const d=[`electron-log.transports.file: ${c}`];u&&d.push(u),r.transports.console({data:d,date:new Date,level:h})}function i(c){o();const u=n.resolvePathFn(t,c);return e.provide({filePath:u,writeAsync:!n.sync,writeOptions:n.writeOptions})}function a({fileFilter:c=u=>u.endsWith(".log")}={}){const u=$.dirname(n.resolvePathFn(t));return N.readdirSync(u).map(h=>$.join(u,h)).filter(c).map(h=>{try{return{path:h,lines:N.readFileSync(h,"utf8").split(At.EOL)}}catch{return null}}).filter(Boolean)}}function kt(r=process.type){switch(r){case"renderer":return"renderer.log";case"worker":return"worker.log";default:return"main.log"}}const Ut=Ie,qt=Me,{transform:Vt}=I,{removeStyles:Bt}=G,{toJSON:Jt,maxDepth:Ht}=H;var Gt=Qt;function Qt(r){return Object.assign(e,{client:{name:"electron-application"},depth:6,level:!1,requestOptions:{},transforms:[Bt,Jt,Ht],makeBodyFn({message:t}){return JSON.stringify({client:e.client,data:t.data,date:t.date.getTime(),level:t.level,scope:t.scope,variables:t.variables})},processErrorFn({error:t}){r.processMessage({data:[`electron-log: can't POST ${e.url}`,t],level:"warn"},{transports:["console","file"]})},sendRequestFn({serverUrl:t,requestOptions:n,body:o}){const i=(t.startsWith("https:")?qt:Ut).request(t,{method:"POST",...n,headers:{"Content-Type":"application/json","Content-Length":o.length,...n.headers}});return i.write(o),i.end(),i}});function e(t){if(!e.url)return;const n=e.makeBodyFn({logger:r,message:{...t,data:Vt({logger:r,message:t,transport:e})},transport:e}),o=e.sendRequestFn({serverUrl:e.url,requestOptions:e.requestOptions,body:Buffer.from(n,"utf8")});o.on("error",s=>e.processErrorFn({error:s,logger:r,message:t,request:o,transport:e}))}}var Yt=Zt;function Zt(r){return Object.defineProperties(e,{defaultLabel:{value:"",writable:!0},labelPadding:{value:!0,writable:!0},maxLabelLength:{value:0,writable:!0},labelLength:{get(){switch(typeof e.labelPadding){case"boolean":return e.labelPadding?e.maxLabelLength:0;case"number":return e.labelPadding;default:return 0}}}});function e(t){e.maxLabelLength=Math.max(e.maxLabelLength,t.length);const n={};for(const o of[...r.levels,"log"])n[o]=(...s)=>r.logData(s,{level:o,scope:t});return n}}const Xt=Yt,F=class F{constructor({allowUnknownLevel:e=!1,errorHandler:t,eventLogger:n,initializeFn:o,isDev:s=!1,levels:i=["error","warn","info","verbose","debug","silly"],logId:a,transportFactories:c={},variables:u}={}){p(this,"errorHandler",null);p(this,"eventLogger",null);p(this,"functions",{});p(this,"hooks",[]);p(this,"isDev",!1);p(this,"levels",null);p(this,"logId",null);p(this,"scope",null);p(this,"transports",{});p(this,"variables",{});this.addLevel=this.addLevel.bind(this),this.create=this.create.bind(this),this.logData=this.logData.bind(this),this.processMessage=this.processMessage.bind(this),this.allowUnknownLevel=e,this.initializeFn=o,this.isDev=s,this.levels=i,this.logId=a,this.transportFactories=c,this.variables=u||{},this.scope=Xt(this),this.addLevel("log",!1);for(const h of this.levels)this.addLevel(h,!1);this.errorHandler=t,t==null||t.setOptions({logFn:this.error}),this.eventLogger=n,n==null||n.setOptions({logger:this});for(const[h,d]of Object.entries(c))this.transports[h]=d(this);F.instances[a]=this}static getInstance({logId:e}){return this.instances[e]||this.instances.default}addLevel(e,t=this.levels.length){t!==!1&&this.levels.splice(t,0,e),this[e]=(...n)=>this.logData(n,{level:e}),this.functions[e]=this[e]}catchErrors(e){return this.processMessage({data:["log.catchErrors is deprecated. Use log.errorHandler instead"],level:"warn"},{transports:["console"]}),this.errorHandler.startCatching(e)}create(e){return typeof e=="string"&&(e={logId:e}),new F({...e,errorHandler:this.errorHandler,initializeFn:this.initializeFn,isDev:this.isDev,transportFactories:this.transportFactories,variables:{...this.variables}})}compareLevels(e,t,n=this.levels){const o=n.indexOf(e),s=n.indexOf(t);return s===-1||o===-1?!0:s<=o}initialize({preload:e=!0,spyRendererConsole:t=!1}={}){this.initializeFn({logger:this,preload:e,spyRendererConsole:t})}logData(e,t={}){this.processMessage({data:e,...t})}processMessage(e,{transports:t=this.transports}={}){if(e.cmd==="errorHandler"){this.errorHandler.handle(e.error,{errorName:e.errorName,processType:"renderer",showDialog:!!e.showDialog});return}let n=e.level;this.allowUnknownLevel||(n=this.levels.includes(e.level)?e.level:"info");const o={date:new Date,...e,level:n,variables:{...this.variables,...e.variables}};for(const[s,i]of this.transportEntries(t))if(!(typeof i!="function"||i.level===!1)&&this.compareLevels(i.level,e.level))try{const a=this.hooks.reduce((c,u)=>c&&u(c,i,s),o);a&&i({...a,data:[...a.data]})}catch(a){this.processInternalErrorFn(a)}}processInternalErrorFn(e){}transportEntries(e=this.transports){return(Array.isArray(e)?e:Object.entries(e)).map(n=>{switch(typeof n){case"string":return this.transports[n]?[n,this.transports[n]]:null;case"function":return[n.name,n];default:return Array.isArray(n)?n:null}}).filter(Boolean)}};p(F,"instances",{});let V=F;var Kt=V;const W=A;class er{constructor({logFn:e=null,onError:t=null,showDialog:n=!0}={}){p(this,"isActive",!1);p(this,"logFn",null);p(this,"onError",null);p(this,"showDialog",!0);this.createIssue=this.createIssue.bind(this),this.handleError=this.handleError.bind(this),this.handleRejection=this.handleRejection.bind(this),this.setOptions({logFn:e,onError:t,showDialog:n}),this.startCatching=this.startCatching.bind(this),this.stopCatching=this.stopCatching.bind(this)}handle(e,{logFn:t=this.logFn,onError:n=this.onError,processType:o="browser",showDialog:s=this.showDialog,errorName:i=""}={}){e=tr(e);try{if(typeof n=="function"){const a=W.getVersions(),c=this.createIssue;if(n({createIssue:c,error:e,errorName:i,processType:o,versions:a})===!1)return}i?t(i,e):t(e),s&&!i.includes("rejection")&&W.showErrorBox(`A JavaScript error occurred in the ${o} process`,e.stack)}catch{console.error(e)}}setOptions({logFn:e,onError:t,showDialog:n}){typeof e=="function"&&(this.logFn=e),typeof t=="function"&&(this.onError=t),typeof n=="boolean"&&(this.showDialog=n)}startCatching({onError:e,showDialog:t}={}){this.isActive||(this.isActive=!0,this.setOptions({onError:e,showDialog:t}),process.on("uncaughtException",this.handleError),process.on("unhandledRejection",this.handleRejection))}stopCatching(){this.isActive=!1,process.removeListener("uncaughtException",this.handleError),process.removeListener("unhandledRejection",this.handleRejection)}createIssue(e,t){W.openUrl(`${e}?${new URLSearchParams(t).toString()}`)}handleError(e){this.handle(e,{errorName:"Unhandled"})}handleRejection(e){const t=e instanceof Error?e:new Error(JSON.stringify(e));this.handle(t,{errorName:"Unhandled rejection"})}}function tr(r){if(r instanceof Error)return r;if(r&&typeof r=="object"){if(r.message)return Object.assign(new Error(r.message),r);try{return new Error(JSON.stringify(r))}catch(e){return new Error(`Couldn't normalize error ${String(r)}: ${e}`)}}return new Error(`Can't normalize error ${String(r)}`)}var rr=er;const le=A;class nr{constructor(e={}){p(this,"disposers",[]);p(this,"format","{eventSource}#{eventName}:");p(this,"formatters",{app:{"certificate-error":({args:e})=>this.arrayToObject(e.slice(1,4),["url","error","certificate"]),"child-process-gone":({args:e})=>e.length===1?e[0]:e,"render-process-gone":({args:[e,t]})=>t&&typeof t=="object"?{...t,...this.getWebContentsDetails(e)}:[]},webContents:{"console-message":({args:[e,t,n,o]})=>{if(!(e<3))return{message:t,source:`${o}:${n}`}},"did-fail-load":({args:e})=>this.arrayToObject(e,["errorCode","errorDescription","validatedURL","isMainFrame","frameProcessId","frameRoutingId"]),"did-fail-provisional-load":({args:e})=>this.arrayToObject(e,["errorCode","errorDescription","validatedURL","isMainFrame","frameProcessId","frameRoutingId"]),"plugin-crashed":({args:e})=>this.arrayToObject(e,["name","version"]),"preload-error":({args:e})=>this.arrayToObject(e,["preloadPath","error"])}});p(this,"events",{app:{"certificate-error":!0,"child-process-gone":!0,"render-process-gone":!0},webContents:{"did-fail-load":!0,"did-fail-provisional-load":!0,"plugin-crashed":!0,"preload-error":!0,unresponsive:!0}});p(this,"level","error");p(this,"scope","");this.setOptions(e)}setOptions({events:e,level:t,logger:n,format:o,formatters:s,scope:i}){typeof e=="object"&&(this.events=e),typeof t=="string"&&(this.level=t),typeof n=="object"&&(this.logger=n),(typeof o=="string"||typeof o=="function")&&(this.format=o),typeof s=="object"&&(this.formatters=s),typeof i=="string"&&(this.scope=i)}startLogging(e={}){this.setOptions(e),this.disposeListeners();for(const t of this.getEventNames(this.events.app))this.disposers.push(le.onAppEvent(t,(...n)=>{this.handleEvent({eventSource:"app",eventName:t,handlerArgs:n})}));for(const t of this.getEventNames(this.events.webContents))this.disposers.push(le.onEveryWebContentsEvent(t,(...n)=>{this.handleEvent({eventSource:"webContents",eventName:t,handlerArgs:n})}))}stopLogging(){this.disposeListeners()}arrayToObject(e,t){const n={};return t.forEach((o,s)=>{n[o]=e[s]}),e.length>t.length&&(n.unknownArgs=e.slice(t.length)),n}disposeListeners(){this.disposers.forEach(e=>e()),this.disposers=[]}formatEventLog({eventName:e,eventSource:t,handlerArgs:n}){var h;const[o,...s]=n;if(typeof this.format=="function")return this.format({args:s,event:o,eventName:e,eventSource:t});const i=(h=this.formatters[t])==null?void 0:h[e];let a=s;if(typeof i=="function"&&(a=i({args:s,event:o,eventName:e,eventSource:t})),!a)return;const c={};return Array.isArray(a)?c.args=a:typeof a=="object"&&Object.assign(c,a),t==="webContents"&&Object.assign(c,this.getWebContentsDetails(o==null?void 0:o.sender)),[this.format.replace("{eventSource}",t==="app"?"App":"WebContents").replace("{eventName}",e),c]}getEventNames(e){return!e||typeof e!="object"?[]:Object.entries(e).filter(([t,n])=>n).map(([t])=>t)}getWebContentsDetails(e){if(!(e!=null&&e.loadURL))return{};try{return{webContents:{id:e.id,url:e.getURL()}}}catch{return{}}}handleEvent({eventName:e,eventSource:t,handlerArgs:n}){var s;const o=this.formatEventLog({eventName:e,eventSource:t,handlerArgs:n});if(o){const i=this.scope?this.logger.scope(this.scope):this.logger;(s=i==null?void 0:i[this.level])==null||s.call(i,...o)}}}var or=nr;(function(r){const e=A,{initialize:t}=Je,n=at,o=Nt,s=Gt,i=Kt,a=rr,c=or,u=new i({errorHandler:new a,eventLogger:new c,initializeFn:t,isDev:e.isDev(),logId:"default",transportFactories:{console:n,file:o,remote:s},variables:{processType:"main"}});u.processInternalErrorFn=d=>{u.transports.console.writeFn({data:["Unhandled electron-log error",d],level:"error"})},r.exports=u,r.exports.Logger=i,r.exports.default=r.exports,e.onIpc("__ELECTRON_LOG__",(d,y)=>{y.scope&&i.getInstance(y).scope(y.scope);const L=new Date(y.date);h({...y,date:L.getTime()?L:new Date})}),e.onIpcInvoke("__ELECTRON_LOG__",(d,{cmd:y="",logId:L})=>{switch(y){case"getOptions":return{levels:i.getInstance({logId:L}).levels,logId:L};default:return h({data:[`Unknown cmd '${y}'`],level:"error"}),{}}});function h(d){var y;(y=i.getInstance(d))==null||y.processMessage(d)}})(de);var sr=de.exports;const ir=sr;var ar=ir;const m=Re(ar),g={main:null,tray:null};function xe(r,...e){var t;(t=g.main)==null||t.webContents.send(r,...e)}const cr=f.app.isPackaged?process.resourcesPath:process.cwd(),Fe=S.join(cr,"app-files","iconTemplate.png");m.info("iconPath",Fe);const lr=f.app.getVersion().includes("beta");function ur(r){T.autoUpdater.autoDownload=!0,T.autoUpdater.logger=m,f.app.isPackaged&&T.autoUpdater.checkForUpdatesAndNotify(),g.tray=new f.Tray(Fe),g.tray.getIgnoreDoubleClickEvents(),g.tray.setToolTip("Metadata Fixer");const e=f.Menu.buildFromTemplate([{label:"Show",click:()=>{r.show(),r.focus()}},{label:"Check for updates",click:()=>{T.autoUpdater.checkForUpdates()}},{type:"separator"},{label:"Quit",click:()=>{f.app.quit()}},...lr?[{label:"Open DevTools",click:()=>{r.webContents.openDevTools()}}]:[]]);g.tray.setContextMenu(e),f.crashReporter.start({productName:"Metadata Fixer",submitURL:"",uploadToServer:!1})}m.initialize({preload:!0});const pr=!f.app.isPackaged,fr=process.platform==="win32",ue=pr?process.cwd():w.resolve(process.resourcesPath),B=fr?w.join(ue,"exiftool.exe","exiftool.exe"):w.join(ue,"exiftool.pl","exiftool");process.env.DIST_ELECTRON=w.join(__dirname,"../");process.env.DIST=w.join(process.env.DIST_ELECTRON,"../dist");process.env.VITE_PUBLIC=process.env.VITE_DEV_SERVER_URL?w.join(process.env.DIST_ELECTRON,"../public"):process.env.DIST;Pe.release().startsWith("6.1")&&f.app.disableHardwareAcceleration();process.platform==="win32"&&f.app.setAppUserModelId(f.app.getName());f.app.requestSingleInstanceLock()||(f.app.quit(),process.exit(0));process.env.ELECTRON_DISABLE_SECURITY_WARNINGS="true";const De=w.join(__dirname,"../preload/index.js"),J=process.env.VITE_DEV_SERVER_URL,_e=w.join(process.env.DIST,"index.html");async function je(){g.main=new f.BrowserWindow({title:"Metadata Viewer",icon:w.join(process.env.VITE_PUBLIC,"icon.ico"),width:1080,height:680,frame:!0,trafficLightPosition:{x:10,y:8},webPreferences:{preload:De,nodeIntegration:!0,contextIsolation:!1,sandbox:!1}}),J?g.main.loadURL(J):g.main.loadFile(_e),g.main.webContents.on("render-process-gone",(r,e)=>{m.error("render-process-gone",e)}),g.main.webContents.setWindowOpenHandler(({url:r})=>(r.startsWith("https:")&&f.shell.openExternal(r),{action:"deny"})),he.unlinkSync(m.transports.file.getFile().path),hr(),ur(g.main)}f.app.whenReady().then(je);f.app.on("window-all-closed",()=>{g.main=null,process.platform!=="darwin"&&f.app.quit()});f.app.on("second-instance",()=>{g.main&&(g.main.isMinimized()&&g.main.restore(),g.main.focus())});f.app.on("activate",()=>{const r=f.BrowserWindow.getAllWindows();r.length?r[0].focus():je()});function hr(){const e=[{label:"File",submenu:[process.platform==="darwin"?{role:"close"}:{role:"quit"}]},{label:"View",submenu:[{role:"reload"},{role:"forceReload"},{role:"toggleDevTools"},{type:"separator"},{role:"resetZoom"},{role:"zoomIn"},{role:"zoomOut"}]},{role:"help",submenu:[{label:"Email Support",click:async()=>{await f.shell.openExternal("mailto:hello@metadatafixer.com")}}]}],t=f.Menu.buildFromTemplate(e);f.Menu.setApplicationMenu(t)}f.ipcMain.handle("open-win",(r,e)=>{const t=new f.BrowserWindow({webPreferences:{preload:De,nodeIntegration:!0,contextIsolation:!1}});process.env.VITE_DEV_SERVER_URL?t.loadURL(`${J}#${e}`):t.loadFile(_e,{hash:e})});f.ipcMain.handle("scan-folder",async(r,e)=>{const t={title:"Select the folder to scan",buttonLabel:"Select",properties:["openDirectory","createDirectory","promptToCreate"]};return f.dialog.showOpenDialog(t).then(async n=>{if(m.info("Chose directory",JSON.stringify(n)),!n||n.canceled||!n.filePaths)return;let o=[];try{o=he.readdirSync(n.filePaths[0])}catch(s){console.error(s),m.error("Failed to open dialog ",s.toString())}return xe("read-folder",{folder:n.filePaths[0],files:o}),{folder:n.filePaths[0],files:o}})});f.ipcMain.handle("scan-file",async(r,e)=>{const{path:t}=e;let n="";await new Promise(s=>{const i=fe.spawn(B,[t].filter(a=>a));i.stdout.on("data",a=>{n+=a.toString()}),i.stderr.on("data",a=>{m.info(`Exiftool stderr: ${a.toString()}`)}),i.on("exit",a=>{m.info(`Exiftool description child process exited with code ${a.toString()}`),s()})});const o=n.trim().split(`
`).map((s,i)=>{const a=s.split(":");return{index:i,type:a[0].trim(),value:a.slice(1).join(":").trim()}});return xe("read-file",o),o});f.ipcMain.handle("save-file",async(r,e)=>{const{command:t}=e;return m.info(B,t),await new Promise(n=>{const o=fe.spawn(B,[t].filter(s=>s));o.stderr.on("data",s=>(m.info(`Exiftool stderr: ${s.toString()}`),"error")),o.on("exit",s=>{m.info(`Exiftool description child process exited with code ${s.toString()}`),n()})}),"success"});
