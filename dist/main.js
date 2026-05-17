"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const fs = __importStar(require("node:fs"));
const net = __importStar(require("net"));
const PORT = 6891;
const HOST = '127.0.0.1';
function getLinesChannel(inputStream, onLine) {
    let pending = '';
    inputStream.on('data', (chunk) => {
        pending += chunk.toString();
        let newline = pending.indexOf('\n');
        while (newline !== -1) {
            let line = pending.slice(0, newline);
            if (line.endsWith('\r')) {
                line = line.slice(0, -1);
            }
            onLine(line);
            pending = pending.slice(newline + 1);
            newline = pending.indexOf('\n');
        }
    });
}
function main(filePath) {
    if (filePath) {
        readFromFile(filePath);
    }
    const server = net.createServer((socket) => {
        console.log('Connection established with the server!');
        getLinesChannel(socket, (line) => {
            console.log(`read: ${line}`);
        });
        socket.on('end', () => {
            console.log('Closed connection!');
        });
        socket.on('error', (err) => {
            console.log(`Errored out with ${err}`);
        });
    });
    server.listen(PORT, HOST, () => {
        console.log(`Server listening on Port: ${PORT}, and Host: ${HOST}`);
    });
}
function readFromFile(filePath) {
    const stream = fs.createReadStream(filePath, { highWaterMark: 8 });
    getLinesChannel(stream, (line) => {
        console.log(`read: ${line}`);
    });
}
//# sourceMappingURL=main.js.map