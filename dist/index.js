"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const main_1 = require("./main");
const filePath = './messages.txt';
(0, main_1.main)(node_path_1.default.resolve(__dirname, filePath));
//# sourceMappingURL=index.js.map