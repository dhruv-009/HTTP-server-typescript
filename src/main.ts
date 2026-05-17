import * as fs from 'node:fs';
import * as net from 'net';
import { Readable } from 'node:stream'

const PORT = 6891;
const HOST = '127.0.0.1';

function getLinesChannel(inputStream: Readable, onLine: (line: string) => void): void {
    let pending = ''
    inputStream.on('data', (chunk) => {
        pending += chunk.toString()
        let newline = pending.indexOf('\n')
        while(newline !== -1){
            let line = pending.slice(0,newline)
            if(line.endsWith('\r')){
                line = line.slice(0, -1)
            }
            onLine(line)
            pending = pending.slice(newline+1)
            newline = pending.indexOf('\n')
        }
        if(pending){
            console.log(`read: ${pending}`)
        }
    })
}

export function main(filePath:string): void {
    if(filePath){
        readFromFile(filePath)
    }
    const server = net.createServer((socket: net.Socket) => {
        console.log('Connection established with the server!')

        getLinesChannel(socket, (line) => {
            console.log(`read: ${line}`)
        })

        socket.on('end', () => {
            console.log('Closed connection!')
        })

        socket.on('error', (err) => {
            console.log(`Errored out with ${err}`)
        })
    })
    server.listen(PORT, HOST, () => {
        console.log(`Server listening on Port: ${PORT}, and Host: ${HOST}`)
    })
}

function readFromFile(filePath: string): void {
    const stream = fs.createReadStream(filePath, {highWaterMark:8})
    getLinesChannel(stream, (line) => {
        console.log(`read: ${line}`)
    })
}