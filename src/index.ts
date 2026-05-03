import path from 'node:path';
import { main } from './main';

const filePath = './messages.txt';

main(path.resolve(__dirname, filePath));
