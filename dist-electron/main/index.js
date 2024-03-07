"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const electron$1 = require("electron");
const node_os = require("node:os");
const path$6 = require("node:path");
const electronUpdater = require("electron-updater");
const require$$0 = require("os");
const require$$1 = require("path");
const require$$0$1 = require("fs");
const require$$0$2 = require("util");
const require$$0$3 = require("events");
const require$$0$4 = require("http");
const require$$1$1 = require("https");
const child_process = require("child_process");
const fs$5 = require("fs-extra");
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var main$1 = { exports: {} };
const os$4 = require$$0;
const path$5 = require$$1;
let electron;
try {
  electron = require("electron");
} catch {
  electron = null;
}
var electronApi$4 = {
  getAppUserDataPath() {
    return getPath("userData");
  },
  getName,
  getPath,
  getVersion,
  getVersions() {
    return {
      app: `${getName()} ${getVersion()}`,
      electron: `Electron ${process.versions.electron}`,
      os: getOsVersion()
    };
  },
  isDev() {
    const app = getApp();
    if ((app == null ? void 0 : app.isPackaged) !== void 0) {
      return !app.isPackaged;
    }
    if (typeof process.execPath === "string") {
      const execFileName = path$5.basename(process.execPath).toLowerCase();
      return execFileName.startsWith("electron");
    }
    return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
  },
  isElectron() {
    return Boolean(process.versions.electron);
  },
  onAppEvent(eventName, handler) {
    var _a;
    (_a = electron == null ? void 0 : electron.app) == null ? void 0 : _a.on(eventName, handler);
    return () => {
      var _a2;
      (_a2 = electron == null ? void 0 : electron.app) == null ? void 0 : _a2.off(eventName, handler);
    };
  },
  onEveryWebContentsEvent(eventName, handler) {
    var _a, _b;
    (_a = electron == null ? void 0 : electron.webContents) == null ? void 0 : _a.getAllWebContents().forEach((webContents) => {
      webContents.on(eventName, handler);
    });
    (_b = electron == null ? void 0 : electron.app) == null ? void 0 : _b.on("web-contents-created", onWebContentsCreated);
    return () => {
      var _a2, _b2;
      (_a2 = electron == null ? void 0 : electron.webContents) == null ? void 0 : _a2.getAllWebContents().forEach((webContents) => {
        webContents.off(eventName, handler);
      });
      (_b2 = electron == null ? void 0 : electron.app) == null ? void 0 : _b2.off("web-contents-created", onWebContentsCreated);
    };
    function onWebContentsCreated(_, webContents) {
      webContents.on(eventName, handler);
    }
  },
  /**
   * Listen to async messages sent from opposite process
   * @param {string} channel
   * @param {function} listener
   */
  onIpc(channel, listener) {
    var _a;
    (_a = getIpc()) == null ? void 0 : _a.on(channel, listener);
  },
  onIpcInvoke(channel, listener) {
    var _a, _b;
    (_b = (_a = getIpc()) == null ? void 0 : _a.handle) == null ? void 0 : _b.call(_a, channel, listener);
  },
  /**
   * @param {string} url
   * @param {Function} [logFunction]
   */
  openUrl(url2, logFunction = console.error) {
    var _a;
    (_a = getElectronModule("shell")) == null ? void 0 : _a.openExternal(url2).catch(logFunction);
  },
  setPreloadFileForSessions({
    filePath,
    includeFutureSession = true,
    sessions = [((_a) => (_a = electron == null ? void 0 : electron.session) == null ? void 0 : _a.defaultSession)()]
  }) {
    var _a2;
    for (const session of sessions.filter(Boolean)) {
      setPreload(session);
    }
    if (includeFutureSession) {
      (_a2 = electron == null ? void 0 : electron.app) == null ? void 0 : _a2.on("session-created", (session) => {
        setPreload(session);
      });
    }
    function setPreload(session) {
      session.setPreloads([...session.getPreloads(), filePath]);
    }
  },
  /**
   * Sent a message to opposite process
   * @param {string} channel
   * @param {any} message
   */
  sendIpc(channel, message) {
    if (process.type === "browser") {
      sendIpcToRenderer(channel, message);
    } else if (process.type === "renderer") {
      sendIpcToMain(channel, message);
    }
  },
  showErrorBox(title, message) {
    const dialog = getElectronModule("dialog");
    if (!dialog)
      return;
    dialog.showErrorBox(title, message);
  },
  whenAppReady() {
    var _a;
    return ((_a = electron == null ? void 0 : electron.app) == null ? void 0 : _a.whenReady()) || Promise.resolve();
  }
};
function getApp() {
  return getElectronModule("app");
}
function getName() {
  const app = getApp();
  if (!app)
    return null;
  return "name" in app ? app.name : app.getName();
}
function getElectronModule(name) {
  return (electron == null ? void 0 : electron[name]) || null;
}
function getIpc() {
  if (process.type === "browser" && (electron == null ? void 0 : electron.ipcMain)) {
    return electron.ipcMain;
  }
  if (process.type === "renderer" && (electron == null ? void 0 : electron.ipcRenderer)) {
    return electron.ipcRenderer;
  }
  return null;
}
function getVersion() {
  const app = getApp();
  if (!app)
    return null;
  return "version" in app ? app.version : app.getVersion();
}
function getOsVersion() {
  let osName = os$4.type().replace("_", " ");
  let osVersion = os$4.release();
  if (osName === "Darwin") {
    osName = "macOS";
    osVersion = getMacOsVersion();
  }
  return `${osName} ${osVersion}`;
}
function getMacOsVersion() {
  const release = Number(os$4.release().split(".")[0]);
  if (release <= 19) {
    return `10.${release - 4}`;
  }
  return release - 9;
}
function getPath(name) {
  const app = getApp();
  if (!app)
    return null;
  try {
    return app.getPath(name);
  } catch (e) {
    return null;
  }
}
function sendIpcToMain(channel, message) {
  var _a;
  (_a = getIpc()) == null ? void 0 : _a.send(channel, message);
}
function sendIpcToRenderer(channel, message) {
  var _a;
  (_a = electron == null ? void 0 : electron.BrowserWindow) == null ? void 0 : _a.getAllWindows().forEach((wnd) => {
    var _a2;
    if (((_a2 = wnd.webContents) == null ? void 0 : _a2.isDestroyed()) === false) {
      wnd.webContents.send(channel, message);
    }
  });
}
var electronLogPreload = { exports: {} };
(function(module2) {
  let electron2 = {};
  try {
    electron2 = require("electron");
  } catch (e) {
  }
  if (electron2.ipcRenderer) {
    initialize2(electron2);
  }
  {
    module2.exports = initialize2;
  }
  function initialize2({ contextBridge, ipcRenderer }) {
    if (!ipcRenderer) {
      return;
    }
    ipcRenderer.on("__ELECTRON_LOG_IPC__", (_, message) => {
      window.postMessage({ cmd: "message", ...message });
    });
    ipcRenderer.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((e) => console.error(new Error(
      `electron-log isn't initialized in the main process. Please call log.initialize() before. ${e.message}`
    )));
    const electronLog = {
      sendToMain(message) {
        try {
          ipcRenderer.send("__ELECTRON_LOG__", message);
        } catch (e) {
          console.error("electronLog.sendToMain ", e, "data:", message);
          ipcRenderer.send("__ELECTRON_LOG__", {
            cmd: "errorHandler",
            error: { message: e == null ? void 0 : e.message, stack: e == null ? void 0 : e.stack },
            errorName: "sendToMain"
          });
        }
      },
      log(...data) {
        electronLog.sendToMain({ data, level: "info" });
      }
    };
    for (const level of ["error", "warn", "info", "verbose", "debug", "silly"]) {
      electronLog[level] = (...data) => electronLog.sendToMain({
        data,
        level
      });
    }
    if (contextBridge && process.contextIsolated) {
      try {
        contextBridge.exposeInMainWorld("__electronLog", electronLog);
      } catch {
      }
    }
    if (typeof window === "object") {
      window.__electronLog = electronLog;
    } else {
      __electronLog = electronLog;
    }
  }
})(electronLogPreload);
var electronLogPreloadExports = electronLogPreload.exports;
const fs$4 = require$$0$1;
const os$3 = require$$0;
const path$4 = require$$1;
const electronApi$3 = electronApi$4;
const preloadInitializeFn = electronLogPreloadExports;
var initialize = {
  initialize({ logger, preload: preload2 = true, spyRendererConsole = false }) {
    electronApi$3.whenAppReady().then(() => {
      if (preload2) {
        initializePreload(preload2);
      }
      if (spyRendererConsole) {
        initializeSpyRendererConsole(logger);
      }
    }).catch(logger.warn);
  }
};
function initializePreload(preloadOption) {
  let preloadPath = typeof preloadOption === "string" ? preloadOption : path$4.resolve(__dirname, "../renderer/electron-log-preload.js");
  if (!fs$4.existsSync(preloadPath)) {
    preloadPath = path$4.join(
      electronApi$3.getAppUserDataPath() || os$3.tmpdir(),
      "electron-log-preload.js"
    );
    const preloadCode = `
      try {
        (${preloadInitializeFn.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
    fs$4.writeFileSync(preloadPath, preloadCode, "utf8");
  }
  electronApi$3.setPreloadFileForSessions({ filePath: preloadPath });
}
function initializeSpyRendererConsole(logger) {
  const levels = ["verbose", "info", "warning", "error"];
  electronApi$3.onEveryWebContentsEvent(
    "console-message",
    (event, level, message) => {
      logger.processMessage({
        data: [message],
        level: levels[level],
        variables: { processType: "renderer" }
      });
    }
  );
}
var transform_1 = { transform: transform$4 };
function transform$4({
  logger,
  message,
  transport,
  initialData = (message == null ? void 0 : message.data) || [],
  transforms = transport == null ? void 0 : transport.transforms
}) {
  return transforms.reduce((data, trans) => {
    if (typeof trans === "function") {
      return trans({ data, logger, message, transport });
    }
    return data;
  }, initialData);
}
const { transform: transform$3 } = transform_1;
var format$2 = {
  concatFirstStringElements: concatFirstStringElements$1,
  formatScope,
  formatText,
  formatVariables,
  timeZoneFromOffset,
  format({ message, logger, transport, data = message == null ? void 0 : message.data }) {
    switch (typeof transport.format) {
      case "string": {
        return transform$3({
          message,
          logger,
          transforms: [formatVariables, formatScope, formatText],
          transport,
          initialData: [transport.format, ...data]
        });
      }
      case "function": {
        return transport.format({
          data,
          level: (message == null ? void 0 : message.level) || "info",
          logger,
          message,
          transport
        });
      }
      default: {
        return data;
      }
    }
  }
};
function concatFirstStringElements$1({ data }) {
  if (typeof data[0] !== "string" || typeof data[1] !== "string") {
    return data;
  }
  if (data[0].match(/%[1cdfiOos]/)) {
    return data;
  }
  return [`${data[0]} ${data[1]}`, ...data.slice(2)];
}
function timeZoneFromOffset(minutesOffset) {
  const minutesPositive = Math.abs(minutesOffset);
  const sign = minutesOffset >= 0 ? "-" : "+";
  const hours = Math.floor(minutesPositive / 60).toString().padStart(2, "0");
  const minutes = (minutesPositive % 60).toString().padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}
function formatScope({ data, logger, message }) {
  const { defaultLabel, labelLength } = (logger == null ? void 0 : logger.scope) || {};
  const template = data[0];
  let label = message.scope;
  if (!label) {
    label = defaultLabel;
  }
  let scopeText;
  if (label === "") {
    scopeText = labelLength > 0 ? "".padEnd(labelLength + 3) : "";
  } else if (typeof label === "string") {
    scopeText = ` (${label})`.padEnd(labelLength + 3);
  } else {
    scopeText = "";
  }
  data[0] = template.replace("{scope}", scopeText);
  return data;
}
function formatVariables({ data, message }) {
  let template = data[0];
  if (typeof template !== "string") {
    return data;
  }
  template = template.replace("{level}]", `${message.level}]`.padEnd(6, " "));
  const date = message.date || /* @__PURE__ */ new Date();
  data[0] = template.replace(/\{(\w+)}/g, (substring, name) => {
    var _a;
    switch (name) {
      case "level":
        return message.level || "info";
      case "logId":
        return message.logId;
      case "y":
        return date.getFullYear().toString(10);
      case "m":
        return (date.getMonth() + 1).toString(10).padStart(2, "0");
      case "d":
        return date.getDate().toString(10).padStart(2, "0");
      case "h":
        return date.getHours().toString(10).padStart(2, "0");
      case "i":
        return date.getMinutes().toString(10).padStart(2, "0");
      case "s":
        return date.getSeconds().toString(10).padStart(2, "0");
      case "ms":
        return date.getMilliseconds().toString(10).padStart(3, "0");
      case "z":
        return timeZoneFromOffset(date.getTimezoneOffset());
      case "iso":
        return date.toISOString();
      default: {
        return ((_a = message.variables) == null ? void 0 : _a[name]) || substring;
      }
    }
  }).trim();
  return data;
}
function formatText({ data }) {
  const template = data[0];
  if (typeof template !== "string") {
    return data;
  }
  const textTplPosition = template.lastIndexOf("{text}");
  if (textTplPosition === template.length - 6) {
    data[0] = template.replace(/\s?{text}/, "");
    if (data[0] === "") {
      data.shift();
    }
    return data;
  }
  const templatePieces = template.split("{text}");
  let result = [];
  if (templatePieces[0] !== "") {
    result.push(templatePieces[0]);
  }
  result = result.concat(data.slice(1));
  if (templatePieces[1] !== "") {
    result.push(templatePieces[1]);
  }
  return result;
}
var object = { exports: {} };
(function(module2) {
  const util = require$$0$2;
  module2.exports = {
    serialize,
    maxDepth({ data, transport, depth = (transport == null ? void 0 : transport.depth) ?? 6 }) {
      if (!data) {
        return data;
      }
      if (depth < 1) {
        if (Array.isArray(data))
          return "[array]";
        if (typeof data === "object" && data)
          return "[object]";
        return data;
      }
      if (Array.isArray(data)) {
        return data.map((child) => module2.exports.maxDepth({
          data: child,
          depth: depth - 1
        }));
      }
      if (typeof data !== "object") {
        return data;
      }
      if (data && typeof data.toISOString === "function") {
        return data;
      }
      if (data === null) {
        return null;
      }
      if (data instanceof Error) {
        return data;
      }
      const newJson = {};
      for (const i in data) {
        if (!Object.prototype.hasOwnProperty.call(data, i))
          continue;
        newJson[i] = module2.exports.maxDepth({
          data: data[i],
          depth: depth - 1
        });
      }
      return newJson;
    },
    toJSON({ data }) {
      return JSON.parse(JSON.stringify(data, createSerializer()));
    },
    toString({ data, transport }) {
      const inspectOptions = (transport == null ? void 0 : transport.inspectOptions) || {};
      const simplifiedData = data.map((item) => {
        if (item === void 0) {
          return void 0;
        }
        try {
          const str = JSON.stringify(item, createSerializer(), "  ");
          return str === void 0 ? void 0 : JSON.parse(str);
        } catch (e) {
          return item;
        }
      });
      return util.formatWithOptions(inspectOptions, ...simplifiedData);
    }
  };
  function createSerializer(options = {}) {
    const seen = /* @__PURE__ */ new WeakSet();
    return function(key, value) {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return void 0;
        }
        seen.add(value);
      }
      return serialize(key, value, options);
    };
  }
  function serialize(key, value, options = {}) {
    const serializeMapAndSet = (options == null ? void 0 : options.serializeMapAndSet) !== false;
    if (value instanceof Error) {
      return value.stack;
    }
    if (!value) {
      return value;
    }
    if (typeof value === "function") {
      return `[function] ${value.toString()}`;
    }
    if (serializeMapAndSet && value instanceof Map && Object.fromEntries) {
      return Object.fromEntries(value);
    }
    if (serializeMapAndSet && value instanceof Set && Array.from) {
      return Array.from(value);
    }
    return value;
  }
})(object);
var objectExports = object.exports;
var style = {
  transformStyles,
  applyAnsiStyles({ data }) {
    return transformStyles(data, styleToAnsi, resetAnsiStyle);
  },
  removeStyles({ data }) {
    return transformStyles(data, () => "");
  }
};
const ANSI_COLORS = {
  unset: "\x1B[0m",
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m"
};
function styleToAnsi(style2) {
  const color = style2.replace(/color:\s*(\w+).*/, "$1").toLowerCase();
  return ANSI_COLORS[color] || "";
}
function resetAnsiStyle(string) {
  return string + ANSI_COLORS.unset;
}
function transformStyles(data, onStyleFound, onStyleApplied) {
  const foundStyles = {};
  return data.reduce((result, item, index, array) => {
    if (foundStyles[index]) {
      return result;
    }
    if (typeof item === "string") {
      let valueIndex = index;
      let styleApplied = false;
      item = item.replace(/%[1cdfiOos]/g, (match) => {
        valueIndex += 1;
        if (match !== "%c") {
          return match;
        }
        const style2 = array[valueIndex];
        if (typeof style2 === "string") {
          foundStyles[valueIndex] = true;
          styleApplied = true;
          return onStyleFound(style2, item);
        }
        return match;
      });
      if (styleApplied && onStyleApplied) {
        item = onStyleApplied(item);
      }
    }
    result.push(item);
    return result;
  }, []);
}
const { concatFirstStringElements, format: format$1 } = format$2;
const { maxDepth: maxDepth$1, toJSON: toJSON$1 } = objectExports;
const { applyAnsiStyles, removeStyles: removeStyles$2 } = style;
const { transform: transform$2 } = transform_1;
const consoleMethods = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  verbose: console.info,
  debug: console.debug,
  silly: console.debug,
  log: console.log
};
var console_1 = consoleTransportFactory;
const separator = process.platform === "win32" ? ">" : "›";
const DEFAULT_FORMAT = `%c{h}:{i}:{s}.{ms}{scope}%c ${separator} {text}`;
Object.assign(consoleTransportFactory, {
  DEFAULT_FORMAT
});
function consoleTransportFactory(logger) {
  return Object.assign(transport, {
    format: DEFAULT_FORMAT,
    level: "silly",
    transforms: [
      addTemplateColors,
      format$1,
      formatStyles,
      concatFirstStringElements,
      maxDepth$1,
      toJSON$1
    ],
    useStyles: process.env.FORCE_STYLES,
    writeFn({ message }) {
      const consoleLogFn = consoleMethods[message.level] || consoleMethods.info;
      consoleLogFn(...message.data);
    }
  });
  function transport(message) {
    const data = transform$2({ logger, message, transport });
    transport.writeFn({
      message: { ...message, data }
    });
  }
}
function addTemplateColors({ data, message, transport }) {
  if (transport.format !== DEFAULT_FORMAT) {
    return data;
  }
  return [`color:${levelToStyle(message.level)}`, "color:unset", ...data];
}
function canUseStyles(useStyleValue, level) {
  if (typeof useStyleValue === "boolean") {
    return useStyleValue;
  }
  const useStderr = level === "error" || level === "warn";
  const stream = useStderr ? process.stderr : process.stdout;
  return stream && stream.isTTY;
}
function formatStyles(args) {
  const { message, transport } = args;
  const useStyles = canUseStyles(transport.useStyles, message.level);
  const nextTransform = useStyles ? applyAnsiStyles : removeStyles$2;
  return nextTransform(args);
}
function levelToStyle(level) {
  const map = { error: "red", warn: "yellow", info: "cyan", default: "unset" };
  return map[level] || map.default;
}
const EventEmitter$1 = require$$0$3;
const fs$3 = require$$0$1;
const os$2 = require$$0;
let File$2 = class File extends EventEmitter$1 {
  constructor({
    path: path2,
    writeOptions = { encoding: "utf8", flag: "a", mode: 438 },
    writeAsync = false
  }) {
    super();
    __publicField(this, "asyncWriteQueue", []);
    __publicField(this, "bytesWritten", 0);
    __publicField(this, "hasActiveAsyncWriting", false);
    __publicField(this, "path", null);
    __publicField(this, "initialSize");
    __publicField(this, "writeOptions", null);
    __publicField(this, "writeAsync", false);
    this.path = path2;
    this.writeOptions = writeOptions;
    this.writeAsync = writeAsync;
  }
  get size() {
    return this.getSize();
  }
  clear() {
    try {
      fs$3.writeFileSync(this.path, "", {
        mode: this.writeOptions.mode,
        flag: "w"
      });
      this.reset();
      return true;
    } catch (e) {
      if (e.code === "ENOENT") {
        return true;
      }
      this.emit("error", e, this);
      return false;
    }
  }
  crop(bytesAfter) {
    try {
      const content = readFileSyncFromEnd(this.path, bytesAfter || 4096);
      this.clear();
      this.writeLine(`[log cropped]${os$2.EOL}${content}`);
    } catch (e) {
      this.emit(
        "error",
        new Error(`Couldn't crop file ${this.path}. ${e.message}`),
        this
      );
    }
  }
  getSize() {
    if (this.initialSize === void 0) {
      try {
        const stats = fs$3.statSync(this.path);
        this.initialSize = stats.size;
      } catch (e) {
        this.initialSize = 0;
      }
    }
    return this.initialSize + this.bytesWritten;
  }
  increaseBytesWrittenCounter(text) {
    this.bytesWritten += Buffer.byteLength(text, this.writeOptions.encoding);
  }
  isNull() {
    return false;
  }
  nextAsyncWrite() {
    const file2 = this;
    if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0) {
      return;
    }
    const text = this.asyncWriteQueue.join("");
    this.asyncWriteQueue = [];
    this.hasActiveAsyncWriting = true;
    fs$3.writeFile(this.path, text, this.writeOptions, (e) => {
      file2.hasActiveAsyncWriting = false;
      if (e) {
        file2.emit(
          "error",
          new Error(`Couldn't write to ${file2.path}. ${e.message}`),
          this
        );
      } else {
        file2.increaseBytesWrittenCounter(text);
      }
      file2.nextAsyncWrite();
    });
  }
  reset() {
    this.initialSize = void 0;
    this.bytesWritten = 0;
  }
  toString() {
    return this.path;
  }
  writeLine(text) {
    text += os$2.EOL;
    if (this.writeAsync) {
      this.asyncWriteQueue.push(text);
      this.nextAsyncWrite();
      return;
    }
    try {
      fs$3.writeFileSync(this.path, text, this.writeOptions);
      this.increaseBytesWrittenCounter(text);
    } catch (e) {
      this.emit(
        "error",
        new Error(`Couldn't write to ${this.path}. ${e.message}`),
        this
      );
    }
  }
};
var File_1 = File$2;
function readFileSyncFromEnd(filePath, bytesCount) {
  const buffer = Buffer.alloc(bytesCount);
  const stats = fs$3.statSync(filePath);
  const readLength = Math.min(stats.size, bytesCount);
  const offset = Math.max(0, stats.size - bytesCount);
  const fd = fs$3.openSync(filePath, "r");
  const totalBytes = fs$3.readSync(fd, buffer, 0, readLength, offset);
  fs$3.closeSync(fd);
  return buffer.toString("utf8", 0, totalBytes);
}
const File$1 = File_1;
let NullFile$1 = class NullFile extends File$1 {
  clear() {
  }
  crop() {
  }
  getSize() {
    return 0;
  }
  isNull() {
    return true;
  }
  writeLine() {
  }
};
var NullFile_1 = NullFile$1;
const EventEmitter = require$$0$3;
const fs$2 = require$$0$1;
const path$3 = require$$1;
const File2 = File_1;
const NullFile2 = NullFile_1;
let FileRegistry$1 = class FileRegistry extends EventEmitter {
  constructor() {
    super();
    __publicField(this, "store", {});
    this.emitError = this.emitError.bind(this);
  }
  /**
   * Provide a File object corresponding to the filePath
   * @param {string} filePath
   * @param {WriteOptions} [writeOptions]
   * @param {boolean} [writeAsync]
   * @return {File}
   */
  provide({ filePath, writeOptions, writeAsync = false }) {
    let file2;
    try {
      filePath = path$3.resolve(filePath);
      if (this.store[filePath]) {
        return this.store[filePath];
      }
      file2 = this.createFile({ filePath, writeOptions, writeAsync });
    } catch (e) {
      file2 = new NullFile2({ path: filePath });
      this.emitError(e, file2);
    }
    file2.on("error", this.emitError);
    this.store[filePath] = file2;
    return file2;
  }
  /**
   * @param {string} filePath
   * @param {WriteOptions} writeOptions
   * @param {boolean} async
   * @return {File}
   * @private
   */
  createFile({ filePath, writeOptions, writeAsync }) {
    this.testFileWriting(filePath);
    return new File2({ path: filePath, writeOptions, writeAsync });
  }
  /**
   * @param {Error} error
   * @param {File} file
   * @private
   */
  emitError(error, file2) {
    this.emit("error", error, file2);
  }
  /**
   * @param {string} filePath
   * @private
   */
  testFileWriting(filePath) {
    fs$2.mkdirSync(path$3.dirname(filePath), { recursive: true });
    fs$2.writeFileSync(filePath, "", { flag: "a" });
  }
};
var FileRegistry_1 = FileRegistry$1;
const fs$1 = require$$0$1;
const path$2 = require$$1;
var packageJson$1 = {
  readPackageJson,
  tryReadJsonAt
};
function readPackageJson() {
  return tryReadJsonAt(require.main && require.main.filename) || tryReadJsonAt(extractPathFromArgs()) || tryReadJsonAt(process.resourcesPath, "app.asar") || tryReadJsonAt(process.resourcesPath, "app") || tryReadJsonAt(process.cwd()) || { name: null, version: null };
}
function tryReadJsonAt(...searchPaths) {
  if (!searchPaths[0]) {
    return null;
  }
  try {
    const searchPath = path$2.join(...searchPaths);
    const fileName = findUp("package.json", searchPath);
    if (!fileName) {
      return null;
    }
    const json = JSON.parse(fs$1.readFileSync(fileName, "utf8"));
    const name = json.productName || json.name;
    if (!name || name.toLowerCase() === "electron") {
      return null;
    }
    if (json.productName || json.name) {
      return {
        name,
        version: json.version
      };
    }
  } catch (e) {
    return null;
  }
}
function findUp(fileName, cwd) {
  let currentPath = cwd;
  while (true) {
    const parsedPath = path$2.parse(currentPath);
    const root = parsedPath.root;
    const dir = parsedPath.dir;
    if (fs$1.existsSync(path$2.join(currentPath, fileName))) {
      return path$2.resolve(path$2.join(currentPath, fileName));
    }
    if (currentPath === root) {
      return null;
    }
    currentPath = dir;
  }
}
function extractPathFromArgs() {
  const matchedArgs = process.argv.filter((arg) => {
    return arg.indexOf("--user-data-dir=") === 0;
  });
  if (matchedArgs.length === 0 || typeof matchedArgs[0] !== "string") {
    return null;
  }
  const userDataDir = matchedArgs[0];
  return userDataDir.replace("--user-data-dir=", "");
}
const os$1 = require$$0;
const path$1 = require$$1;
const electronApi$2 = electronApi$4;
const packageJson = packageJson$1;
var variables$1 = {
  getAppData,
  getLibraryDefaultDir,
  getLibraryTemplate,
  getNameAndVersion,
  getPathVariables,
  getUserData
};
function getAppData(platform) {
  const appData = electronApi$2.getPath("appData");
  if (appData) {
    return appData;
  }
  const home = getHome();
  switch (platform) {
    case "darwin": {
      return path$1.join(home, "Library/Application Support");
    }
    case "win32": {
      return process.env.APPDATA || path$1.join(home, "AppData/Roaming");
    }
    default: {
      return process.env.XDG_CONFIG_HOME || path$1.join(home, ".config");
    }
  }
}
function getHome() {
  return os$1.homedir ? os$1.homedir() : process.env.HOME;
}
function getLibraryDefaultDir(platform, appName) {
  if (platform === "darwin") {
    return path$1.join(getHome(), "Library/Logs", appName);
  }
  return path$1.join(getUserData(platform, appName), "logs");
}
function getLibraryTemplate(platform) {
  if (platform === "darwin") {
    return path$1.join(getHome(), "Library/Logs", "{appName}");
  }
  return path$1.join(getAppData(platform), "{appName}", "logs");
}
function getNameAndVersion() {
  let name = electronApi$2.getName() || "";
  let version = electronApi$2.getVersion();
  if (name.toLowerCase() === "electron") {
    name = "";
    version = "";
  }
  if (name && version) {
    return { name, version };
  }
  const packageValues = packageJson.readPackageJson();
  if (!name) {
    name = packageValues.name;
  }
  if (!version) {
    version = packageValues.version;
  }
  if (!name) {
    name = "Electron";
  }
  return { name, version };
}
function getPathVariables(platform) {
  const nameAndVersion = getNameAndVersion();
  const appName = nameAndVersion.name;
  const appVersion = nameAndVersion.version;
  return {
    appData: getAppData(platform),
    appName,
    appVersion,
    get electronDefaultDir() {
      return electronApi$2.getPath("logs");
    },
    home: getHome(),
    libraryDefaultDir: getLibraryDefaultDir(platform, appName),
    libraryTemplate: getLibraryTemplate(platform),
    temp: electronApi$2.getPath("temp") || os$1.tmpdir(),
    userData: getUserData(platform, appName)
  };
}
function getUserData(platform, appName) {
  if (electronApi$2.getName() !== appName) {
    return path$1.join(getAppData(platform), appName);
  }
  return electronApi$2.getPath("userData") || path$1.join(getAppData(platform), appName);
}
const fs = require$$0$1;
const path = require$$1;
const os = require$$0;
const FileRegistry2 = FileRegistry_1;
const variables = variables$1;
const { transform: transform$1 } = transform_1;
const { removeStyles: removeStyles$1 } = style;
const { format } = format$2;
const { toString } = objectExports;
var file = fileTransportFactory;
const globalRegistry = new FileRegistry2();
function fileTransportFactory(logger, registry = globalRegistry) {
  let pathVariables;
  if (registry.listenerCount("error") < 1) {
    registry.on("error", (e, file2) => {
      logConsole(`Can't write to ${file2}`, e);
    });
  }
  return Object.assign(transport, {
    fileName: getDefaultFileName(logger.variables.processType),
    format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
    getFile,
    inspectOptions: { depth: 5 },
    level: "silly",
    maxSize: 1024 ** 2,
    readAllLogs,
    sync: true,
    transforms: [removeStyles$1, format, toString],
    writeOptions: { flag: "a", mode: 438, encoding: "utf8" },
    archiveLogFn(file2) {
      const oldPath = file2.toString();
      const inf = path.parse(oldPath);
      try {
        fs.renameSync(oldPath, path.join(inf.dir, `${inf.name}.old${inf.ext}`));
      } catch (e) {
        logConsole("Could not rotate log", e);
        const quarterOfMaxSize = Math.round(transport.maxSize / 4);
        file2.crop(Math.min(quarterOfMaxSize, 256 * 1024));
      }
    },
    resolvePathFn(vars) {
      return path.join(vars.libraryDefaultDir, vars.fileName);
    }
  });
  function transport(message) {
    const file2 = getFile(message);
    const needLogRotation = transport.maxSize > 0 && file2.size > transport.maxSize;
    if (needLogRotation) {
      transport.archiveLogFn(file2);
      file2.reset();
    }
    const content = transform$1({ logger, message, transport });
    file2.writeLine(content);
  }
  function initializeOnFirstAccess() {
    if (pathVariables) {
      return;
    }
    pathVariables = Object.create(
      Object.prototype,
      {
        ...Object.getOwnPropertyDescriptors(
          variables.getPathVariables(process.platform)
        ),
        fileName: {
          get() {
            return transport.fileName;
          },
          enumerable: true
        }
      }
    );
    if (typeof transport.archiveLog === "function") {
      transport.archiveLogFn = transport.archiveLog;
      logConsole("archiveLog is deprecated. Use archiveLogFn instead");
    }
    if (typeof transport.resolvePath === "function") {
      transport.resolvePathFn = transport.resolvePath;
      logConsole("resolvePath is deprecated. Use resolvePathFn instead");
    }
  }
  function logConsole(message, error = null, level = "error") {
    const data = [`electron-log.transports.file: ${message}`];
    if (error) {
      data.push(error);
    }
    logger.transports.console({ data, date: /* @__PURE__ */ new Date(), level });
  }
  function getFile(msg) {
    initializeOnFirstAccess();
    const filePath = transport.resolvePathFn(pathVariables, msg);
    return registry.provide({
      filePath,
      writeAsync: !transport.sync,
      writeOptions: transport.writeOptions
    });
  }
  function readAllLogs({ fileFilter = (f) => f.endsWith(".log") } = {}) {
    const logsPath = path.dirname(transport.resolvePathFn(pathVariables));
    return fs.readdirSync(logsPath).map((fileName) => path.join(logsPath, fileName)).filter(fileFilter).map((logPath) => {
      try {
        return {
          path: logPath,
          lines: fs.readFileSync(logPath, "utf8").split(os.EOL)
        };
      } catch {
        return null;
      }
    }).filter(Boolean);
  }
}
function getDefaultFileName(processType = process.type) {
  switch (processType) {
    case "renderer":
      return "renderer.log";
    case "worker":
      return "worker.log";
    default:
      return "main.log";
  }
}
const http = require$$0$4;
const https = require$$1$1;
const { transform } = transform_1;
const { removeStyles } = style;
const { toJSON, maxDepth } = objectExports;
var remote = remoteTransportFactory;
function remoteTransportFactory(logger) {
  return Object.assign(transport, {
    client: { name: "electron-application" },
    depth: 6,
    level: false,
    requestOptions: {},
    transforms: [removeStyles, toJSON, maxDepth],
    makeBodyFn({ message }) {
      return JSON.stringify({
        client: transport.client,
        data: message.data,
        date: message.date.getTime(),
        level: message.level,
        scope: message.scope,
        variables: message.variables
      });
    },
    processErrorFn({ error }) {
      logger.processMessage(
        {
          data: [`electron-log: can't POST ${transport.url}`, error],
          level: "warn"
        },
        { transports: ["console", "file"] }
      );
    },
    sendRequestFn({ serverUrl, requestOptions, body }) {
      const httpTransport = serverUrl.startsWith("https:") ? https : http;
      const request = httpTransport.request(serverUrl, {
        method: "POST",
        ...requestOptions,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": body.length,
          ...requestOptions.headers
        }
      });
      request.write(body);
      request.end();
      return request;
    }
  });
  function transport(message) {
    if (!transport.url) {
      return;
    }
    const body = transport.makeBodyFn({
      logger,
      message: { ...message, data: transform({ logger, message, transport }) },
      transport
    });
    const request = transport.sendRequestFn({
      serverUrl: transport.url,
      requestOptions: transport.requestOptions,
      body: Buffer.from(body, "utf8")
    });
    request.on("error", (error) => transport.processErrorFn({
      error,
      logger,
      message,
      request,
      transport
    }));
  }
}
var scope = scopeFactory$1;
function scopeFactory$1(logger) {
  return Object.defineProperties(scope2, {
    defaultLabel: { value: "", writable: true },
    labelPadding: { value: true, writable: true },
    maxLabelLength: { value: 0, writable: true },
    labelLength: {
      get() {
        switch (typeof scope2.labelPadding) {
          case "boolean":
            return scope2.labelPadding ? scope2.maxLabelLength : 0;
          case "number":
            return scope2.labelPadding;
          default:
            return 0;
        }
      }
    }
  });
  function scope2(label) {
    scope2.maxLabelLength = Math.max(scope2.maxLabelLength, label.length);
    const newScope = {};
    for (const level of [...logger.levels, "log"]) {
      newScope[level] = (...d) => logger.logData(d, { level, scope: label });
    }
    return newScope;
  }
}
const scopeFactory = scope;
const _Logger = class _Logger {
  constructor({
    allowUnknownLevel = false,
    errorHandler,
    eventLogger,
    initializeFn,
    isDev: isDev2 = false,
    levels = ["error", "warn", "info", "verbose", "debug", "silly"],
    logId,
    transportFactories = {},
    variables: variables2
  } = {}) {
    __publicField(this, "errorHandler", null);
    __publicField(this, "eventLogger", null);
    __publicField(this, "functions", {});
    __publicField(this, "hooks", []);
    __publicField(this, "isDev", false);
    __publicField(this, "levels", null);
    __publicField(this, "logId", null);
    __publicField(this, "scope", null);
    __publicField(this, "transports", {});
    __publicField(this, "variables", {});
    this.addLevel = this.addLevel.bind(this);
    this.create = this.create.bind(this);
    this.logData = this.logData.bind(this);
    this.processMessage = this.processMessage.bind(this);
    this.allowUnknownLevel = allowUnknownLevel;
    this.initializeFn = initializeFn;
    this.isDev = isDev2;
    this.levels = levels;
    this.logId = logId;
    this.transportFactories = transportFactories;
    this.variables = variables2 || {};
    this.scope = scopeFactory(this);
    this.addLevel("log", false);
    for (const name of this.levels) {
      this.addLevel(name, false);
    }
    this.errorHandler = errorHandler;
    errorHandler == null ? void 0 : errorHandler.setOptions({ logFn: this.error });
    this.eventLogger = eventLogger;
    eventLogger == null ? void 0 : eventLogger.setOptions({ logger: this });
    for (const [name, factory] of Object.entries(transportFactories)) {
      this.transports[name] = factory(this);
    }
    _Logger.instances[logId] = this;
  }
  static getInstance({ logId }) {
    return this.instances[logId] || this.instances.default;
  }
  addLevel(level, index = this.levels.length) {
    if (index !== false) {
      this.levels.splice(index, 0, level);
    }
    this[level] = (...args) => this.logData(args, { level });
    this.functions[level] = this[level];
  }
  catchErrors(options) {
    this.processMessage(
      {
        data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
        level: "warn"
      },
      { transports: ["console"] }
    );
    return this.errorHandler.startCatching(options);
  }
  create(options) {
    if (typeof options === "string") {
      options = { logId: options };
    }
    return new _Logger({
      ...options,
      errorHandler: this.errorHandler,
      initializeFn: this.initializeFn,
      isDev: this.isDev,
      transportFactories: this.transportFactories,
      variables: { ...this.variables }
    });
  }
  compareLevels(passLevel, checkLevel, levels = this.levels) {
    const pass = levels.indexOf(passLevel);
    const check = levels.indexOf(checkLevel);
    if (check === -1 || pass === -1) {
      return true;
    }
    return check <= pass;
  }
  initialize({ preload: preload2 = true, spyRendererConsole = false } = {}) {
    this.initializeFn({ logger: this, preload: preload2, spyRendererConsole });
  }
  logData(data, options = {}) {
    this.processMessage({ data, ...options });
  }
  processMessage(message, { transports = this.transports } = {}) {
    if (message.cmd === "errorHandler") {
      this.errorHandler.handle(message.error, {
        errorName: message.errorName,
        processType: "renderer",
        showDialog: Boolean(message.showDialog)
      });
      return;
    }
    let level = message.level;
    if (!this.allowUnknownLevel) {
      level = this.levels.includes(message.level) ? message.level : "info";
    }
    const normalizedMessage = {
      date: /* @__PURE__ */ new Date(),
      ...message,
      level,
      variables: {
        ...this.variables,
        ...message.variables
      }
    };
    for (const [transName, transFn] of this.transportEntries(transports)) {
      if (typeof transFn !== "function" || transFn.level === false) {
        continue;
      }
      if (!this.compareLevels(transFn.level, message.level)) {
        continue;
      }
      try {
        const transformedMsg = this.hooks.reduce((msg, hook) => {
          return msg ? hook(msg, transFn, transName) : msg;
        }, normalizedMessage);
        if (transformedMsg) {
          transFn({ ...transformedMsg, data: [...transformedMsg.data] });
        }
      } catch (e) {
        this.processInternalErrorFn(e);
      }
    }
  }
  processInternalErrorFn(_e) {
  }
  transportEntries(transports = this.transports) {
    const transportArray = Array.isArray(transports) ? transports : Object.entries(transports);
    return transportArray.map((item) => {
      switch (typeof item) {
        case "string":
          return this.transports[item] ? [item, this.transports[item]] : null;
        case "function":
          return [item.name, item];
        default:
          return Array.isArray(item) ? item : null;
      }
    }).filter(Boolean);
  }
};
__publicField(_Logger, "instances", {});
let Logger = _Logger;
var Logger_1 = Logger;
const electronApi$1 = electronApi$4;
class ErrorHandler {
  constructor({ logFn = null, onError = null, showDialog = true } = {}) {
    __publicField(this, "isActive", false);
    __publicField(this, "logFn", null);
    __publicField(this, "onError", null);
    __publicField(this, "showDialog", true);
    this.createIssue = this.createIssue.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleRejection = this.handleRejection.bind(this);
    this.setOptions({ logFn, onError, showDialog });
    this.startCatching = this.startCatching.bind(this);
    this.stopCatching = this.stopCatching.bind(this);
  }
  handle(error, {
    logFn = this.logFn,
    onError = this.onError,
    processType = "browser",
    showDialog = this.showDialog,
    errorName = ""
  } = {}) {
    error = normalizeError(error);
    try {
      if (typeof onError === "function") {
        const versions = electronApi$1.getVersions();
        const createIssue = this.createIssue;
        const result = onError({
          createIssue,
          error,
          errorName,
          processType,
          versions
        });
        if (result === false) {
          return;
        }
      }
      errorName ? logFn(errorName, error) : logFn(error);
      if (showDialog && !errorName.includes("rejection")) {
        electronApi$1.showErrorBox(
          `A JavaScript error occurred in the ${processType} process`,
          error.stack
        );
      }
    } catch {
      console.error(error);
    }
  }
  setOptions({ logFn, onError, showDialog }) {
    if (typeof logFn === "function") {
      this.logFn = logFn;
    }
    if (typeof onError === "function") {
      this.onError = onError;
    }
    if (typeof showDialog === "boolean") {
      this.showDialog = showDialog;
    }
  }
  startCatching({ onError, showDialog } = {}) {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.setOptions({ onError, showDialog });
    process.on("uncaughtException", this.handleError);
    process.on("unhandledRejection", this.handleRejection);
  }
  stopCatching() {
    this.isActive = false;
    process.removeListener("uncaughtException", this.handleError);
    process.removeListener("unhandledRejection", this.handleRejection);
  }
  createIssue(pageUrl, queryParams) {
    electronApi$1.openUrl(
      `${pageUrl}?${new URLSearchParams(queryParams).toString()}`
    );
  }
  handleError(error) {
    this.handle(error, { errorName: "Unhandled" });
  }
  handleRejection(reason) {
    const error = reason instanceof Error ? reason : new Error(JSON.stringify(reason));
    this.handle(error, { errorName: "Unhandled rejection" });
  }
}
function normalizeError(e) {
  if (e instanceof Error) {
    return e;
  }
  if (e && typeof e === "object") {
    if (e.message) {
      return Object.assign(new Error(e.message), e);
    }
    try {
      return new Error(JSON.stringify(e));
    } catch (serErr) {
      return new Error(`Couldn't normalize error ${String(e)}: ${serErr}`);
    }
  }
  return new Error(`Can't normalize error ${String(e)}`);
}
var ErrorHandler_1 = ErrorHandler;
const electronApi = electronApi$4;
class EventLogger {
  constructor(options = {}) {
    __publicField(this, "disposers", []);
    __publicField(this, "format", "{eventSource}#{eventName}:");
    __publicField(this, "formatters", {
      app: {
        "certificate-error": ({ args }) => {
          return this.arrayToObject(args.slice(1, 4), [
            "url",
            "error",
            "certificate"
          ]);
        },
        "child-process-gone": ({ args }) => {
          return args.length === 1 ? args[0] : args;
        },
        "render-process-gone": ({ args: [webContents, details] }) => {
          return details && typeof details === "object" ? { ...details, ...this.getWebContentsDetails(webContents) } : [];
        }
      },
      webContents: {
        "console-message": ({ args: [level, message, line, sourceId] }) => {
          if (level < 3) {
            return void 0;
          }
          return { message, source: `${sourceId}:${line}` };
        },
        "did-fail-load": ({ args }) => {
          return this.arrayToObject(args, [
            "errorCode",
            "errorDescription",
            "validatedURL",
            "isMainFrame",
            "frameProcessId",
            "frameRoutingId"
          ]);
        },
        "did-fail-provisional-load": ({ args }) => {
          return this.arrayToObject(args, [
            "errorCode",
            "errorDescription",
            "validatedURL",
            "isMainFrame",
            "frameProcessId",
            "frameRoutingId"
          ]);
        },
        "plugin-crashed": ({ args }) => {
          return this.arrayToObject(args, ["name", "version"]);
        },
        "preload-error": ({ args }) => {
          return this.arrayToObject(args, ["preloadPath", "error"]);
        }
      }
    });
    __publicField(this, "events", {
      app: {
        "certificate-error": true,
        "child-process-gone": true,
        "render-process-gone": true
      },
      webContents: {
        // 'console-message': true,
        "did-fail-load": true,
        "did-fail-provisional-load": true,
        "plugin-crashed": true,
        "preload-error": true,
        "unresponsive": true
      }
    });
    __publicField(this, "level", "error");
    __publicField(this, "scope", "");
    this.setOptions(options);
  }
  setOptions({ events, level, logger, format: format2, formatters, scope: scope2 }) {
    if (typeof events === "object") {
      this.events = events;
    }
    if (typeof level === "string") {
      this.level = level;
    }
    if (typeof logger === "object") {
      this.logger = logger;
    }
    if (typeof format2 === "string" || typeof format2 === "function") {
      this.format = format2;
    }
    if (typeof formatters === "object") {
      this.formatters = formatters;
    }
    if (typeof scope2 === "string") {
      this.scope = scope2;
    }
  }
  startLogging(options = {}) {
    this.setOptions(options);
    this.disposeListeners();
    for (const eventName of this.getEventNames(this.events.app)) {
      this.disposers.push(
        electronApi.onAppEvent(eventName, (...handlerArgs) => {
          this.handleEvent({ eventSource: "app", eventName, handlerArgs });
        })
      );
    }
    for (const eventName of this.getEventNames(this.events.webContents)) {
      this.disposers.push(
        electronApi.onEveryWebContentsEvent(eventName, (...handlerArgs) => {
          this.handleEvent(
            { eventSource: "webContents", eventName, handlerArgs }
          );
        })
      );
    }
  }
  stopLogging() {
    this.disposeListeners();
  }
  arrayToObject(array, fieldNames) {
    const obj = {};
    fieldNames.forEach((fieldName, index) => {
      obj[fieldName] = array[index];
    });
    if (array.length > fieldNames.length) {
      obj.unknownArgs = array.slice(fieldNames.length);
    }
    return obj;
  }
  disposeListeners() {
    this.disposers.forEach((disposer) => disposer());
    this.disposers = [];
  }
  formatEventLog({ eventName, eventSource, handlerArgs }) {
    var _a;
    const [event, ...args] = handlerArgs;
    if (typeof this.format === "function") {
      return this.format({ args, event, eventName, eventSource });
    }
    const formatter = (_a = this.formatters[eventSource]) == null ? void 0 : _a[eventName];
    let formattedArgs = args;
    if (typeof formatter === "function") {
      formattedArgs = formatter({ args, event, eventName, eventSource });
    }
    if (!formattedArgs) {
      return void 0;
    }
    const eventData = {};
    if (Array.isArray(formattedArgs)) {
      eventData.args = formattedArgs;
    } else if (typeof formattedArgs === "object") {
      Object.assign(eventData, formattedArgs);
    }
    if (eventSource === "webContents") {
      Object.assign(eventData, this.getWebContentsDetails(event == null ? void 0 : event.sender));
    }
    const title = this.format.replace("{eventSource}", eventSource === "app" ? "App" : "WebContents").replace("{eventName}", eventName);
    return [title, eventData];
  }
  getEventNames(eventMap) {
    if (!eventMap || typeof eventMap !== "object") {
      return [];
    }
    return Object.entries(eventMap).filter(([_, listen]) => listen).map(([eventName]) => eventName);
  }
  getWebContentsDetails(webContents) {
    if (!(webContents == null ? void 0 : webContents.loadURL)) {
      return {};
    }
    try {
      return {
        webContents: {
          id: webContents.id,
          url: webContents.getURL()
        }
      };
    } catch {
      return {};
    }
  }
  handleEvent({ eventName, eventSource, handlerArgs }) {
    var _a;
    const log2 = this.formatEventLog({ eventName, eventSource, handlerArgs });
    if (log2) {
      const logFns = this.scope ? this.logger.scope(this.scope) : this.logger;
      (_a = logFns == null ? void 0 : logFns[this.level]) == null ? void 0 : _a.call(logFns, ...log2);
    }
  }
}
var EventLogger_1 = EventLogger;
(function(module2) {
  const electronApi2 = electronApi$4;
  const { initialize: initialize$1 } = initialize;
  const transportConsole = console_1;
  const transportFile = file;
  const transportRemote = remote;
  const Logger2 = Logger_1;
  const ErrorHandler2 = ErrorHandler_1;
  const EventLogger2 = EventLogger_1;
  const defaultLogger = new Logger2({
    errorHandler: new ErrorHandler2(),
    eventLogger: new EventLogger2(),
    initializeFn: initialize$1,
    isDev: electronApi2.isDev(),
    logId: "default",
    transportFactories: {
      console: transportConsole,
      file: transportFile,
      remote: transportRemote
    },
    variables: {
      processType: "main"
    }
  });
  defaultLogger.processInternalErrorFn = (e) => {
    defaultLogger.transports.console.writeFn({
      data: ["Unhandled electron-log error", e],
      level: "error"
    });
  };
  module2.exports = defaultLogger;
  module2.exports.Logger = Logger2;
  module2.exports.default = module2.exports;
  electronApi2.onIpc("__ELECTRON_LOG__", (_, message) => {
    if (message.scope) {
      Logger2.getInstance(message).scope(message.scope);
    }
    const date = new Date(message.date);
    processMessage({
      ...message,
      date: date.getTime() ? date : /* @__PURE__ */ new Date()
    });
  });
  electronApi2.onIpcInvoke("__ELECTRON_LOG__", (_, { cmd = "", logId }) => {
    switch (cmd) {
      case "getOptions": {
        const logger = Logger2.getInstance({ logId });
        return {
          levels: logger.levels,
          logId
        };
      }
      default: {
        processMessage({ data: [`Unknown cmd '${cmd}'`], level: "error" });
        return {};
      }
    }
  });
  function processMessage(message) {
    var _a;
    (_a = Logger2.getInstance(message)) == null ? void 0 : _a.processMessage(message);
  }
})(main$1);
var mainExports = main$1.exports;
const main = mainExports;
var main_1 = main;
const log = /* @__PURE__ */ getDefaultExportFromCjs(main_1);
const windows = {
  main: null,
  tray: null
};
function dispatchToMain(channel, ...args) {
  var _a;
  (_a = windows.main) == null ? void 0 : _a.webContents.send(channel, ...args);
}
const rootPath$1 = !electron$1.app.isPackaged ? process.cwd() : process.resourcesPath;
const iconPath = require$$1.join(rootPath$1, "app-files", "iconTemplate.png");
log.info("iconPath", iconPath);
const isBetaBuild = electron$1.app.getVersion().includes("beta");
function update(win) {
  electronUpdater.autoUpdater.autoDownload = true;
  electronUpdater.autoUpdater.logger = log;
  if (electron$1.app.isPackaged) {
    electronUpdater.autoUpdater.checkForUpdatesAndNotify();
  }
  windows.tray = new electron$1.Tray(iconPath);
  windows.tray.getIgnoreDoubleClickEvents();
  windows.tray.setToolTip("Metadata Fixer");
  const contextMenu = electron$1.Menu.buildFromTemplate([
    {
      label: "Show",
      click: () => {
        win.show();
        win.focus();
      }
    },
    {
      label: "Check for updates",
      click: () => {
        electronUpdater.autoUpdater.checkForUpdates();
      }
    },
    {
      type: "separator"
    },
    {
      label: "Quit",
      click: () => {
        electron$1.app.quit();
      }
    },
    ...isBetaBuild ? [
      {
        label: "Open DevTools",
        click: () => {
          win.webContents.openDevTools();
        }
      }
    ] : []
  ]);
  windows.tray.setContextMenu(contextMenu);
  electron$1.crashReporter.start({
    productName: "Metadata Fixer",
    submitURL: "",
    uploadToServer: false
  });
}
log.initialize({
  preload: true
});
const isDev = !electron$1.app.isPackaged;
const isWindows = process.platform === "win32";
const rootPath = isDev ? process.cwd() : path$6.resolve(process.resourcesPath);
const exiftoolPath = isWindows ? path$6.join(rootPath, "exiftool.exe", "exiftool.exe") : path$6.join(rootPath, "exiftool.pl", "exiftool");
process.env.DIST_ELECTRON = path$6.join(__dirname, "../");
process.env.DIST = path$6.join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL ? path$6.join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (node_os.release().startsWith("6.1"))
  electron$1.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron$1.app.setAppUserModelId(electron$1.app.getName());
if (!electron$1.app.requestSingleInstanceLock()) {
  electron$1.app.quit();
  process.exit(0);
}
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
const preload = path$6.join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = path$6.join(process.env.DIST, "index.html");
async function createWindow() {
  windows.main = new electron$1.BrowserWindow({
    title: "Metadata Viewer",
    icon: path$6.join(process.env.VITE_PUBLIC, "icon.ico"),
    width: 1080,
    height: 680,
    frame: true,
    trafficLightPosition: {
      x: 10,
      y: 8
    },
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      sandbox: false
    }
  });
  if (url) {
    windows.main.loadURL(url);
  } else {
    windows.main.loadFile(indexHtml);
  }
  windows.main.webContents.on("render-process-gone", (event, details) => {
    log.error("render-process-gone", details);
  });
  windows.main.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      electron$1.shell.openExternal(url2);
    return { action: "deny" };
  });
  fs$5.unlinkSync(log.transports.file.getFile().path);
  installMenu();
  update(windows.main);
}
electron$1.app.whenReady().then(createWindow);
electron$1.app.on("window-all-closed", () => {
  windows.main = null;
  if (process.platform !== "darwin")
    electron$1.app.quit();
});
electron$1.app.on("second-instance", () => {
  if (windows.main) {
    if (windows.main.isMinimized())
      windows.main.restore();
    windows.main.focus();
  }
});
electron$1.app.on("activate", () => {
  const allWindows = electron$1.BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
function installMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    {
      label: "File",
      submenu: [isMac ? { role: "close" } : { role: "quit" }]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" }
      ]
    },
    {
      role: "help",
      submenu: [
        {
          label: "Email Support",
          click: async () => {
            await electron$1.shell.openExternal("mailto:hello@metadatafixer.com");
          }
        }
      ]
    }
  ];
  const menu = electron$1.Menu.buildFromTemplate(template);
  electron$1.Menu.setApplicationMenu(menu);
}
electron$1.ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new electron$1.BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
electron$1.ipcMain.handle("scan-folder", async (evt, args) => {
  const options = {
    title: "Select the folder to scan",
    buttonLabel: "Select",
    properties: ["openDirectory", "createDirectory", "promptToCreate"]
  };
  return electron$1.dialog.showOpenDialog(options).then(async (dir) => {
    log.info("Chose directory", JSON.stringify(dir));
    if (!dir || dir.canceled || !dir.filePaths)
      return;
    let files = [];
    try {
      files = fs$5.readdirSync(dir.filePaths[0]);
    } catch (e) {
      console.error(e);
      log.error("Failed to open dialog ", e.toString());
    }
    dispatchToMain("read-folder", {
      folder: dir.filePaths[0],
      files
    });
    return {
      folder: dir.filePaths[0],
      files
    };
  });
});
electron$1.ipcMain.handle("scan-file", async (evt, args) => {
  const { path: path2 } = args;
  let output = "";
  await new Promise((resolve) => {
    const exifCommand = child_process.spawn(
      exiftoolPath,
      [
        path2
      ].filter((e) => e)
    );
    exifCommand.stdout.on("data", (data) => {
      output += data.toString();
    });
    exifCommand.stderr.on("data", (data) => {
      log.info(`Exiftool stderr: ${data.toString()}`);
    });
    exifCommand.on("exit", (code) => {
      log.info(`Exiftool description child process exited with code ${code.toString()}`);
      resolve();
    });
  });
  const formattedData = output.trim().split("\n").map((meta, index) => {
    const chunks = meta.split(":");
    return {
      index,
      type: chunks[0].trim(),
      value: chunks.slice(1).join(":").trim()
    };
  });
  dispatchToMain("read-file", formattedData);
  return formattedData;
});
electron$1.ipcMain.handle("save-file", async (evt, args) => {
  const { command } = args;
  log.info(exiftoolPath, command);
  await new Promise((resolve) => {
    const exifCommand = child_process.spawn(
      exiftoolPath,
      [
        command
      ].filter((e) => e)
    );
    exifCommand.stderr.on("data", (data) => {
      log.info(`Exiftool stderr: ${data.toString()}`);
      return "error";
    });
    exifCommand.on("exit", (code) => {
      log.info(`Exiftool description child process exited with code ${code.toString()}`);
      resolve();
    });
  });
  return "success";
});
//# sourceMappingURL=index.js.map
