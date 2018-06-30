import Server from './Server';
import minimist from 'minimist';

const argv = minimist(process.argv);

const server = new Server(argv['port'], argv['ip']);
server.startServer();
