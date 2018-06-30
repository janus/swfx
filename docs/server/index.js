'use strict';

var _Server = require('./Server');

var _Server2 = _interopRequireDefault(_Server);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist2.default)(process.argv);

var server = new _Server2.default(argv['port'], argv['ip']);
server.startServer();
//# sourceMappingURL=maps/index.js.map
