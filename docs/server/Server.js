'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _countries = require('./countries.json');

var _countries2 = _interopRequireDefault(_countries);

var _currencies = require('./currencies.json');

var _currencies2 = _interopRequireDefault(_currencies);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Server = function () {
    function Server() {
        var port = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8000;
        var ip = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '127.0.0.1';

        _classCallCheck(this, Server);

        this._app = (0, _express2.default)();
        this._port = port;
        this._ip = ip;

        var staticOptions = {
            maxAge: 0
        };
        this._app.use('/css', _express2.default.static(_path2.default.join(__dirname, '../css'), staticOptions));
        this._app.use('/public/js', _express2.default.static(_path2.default.join(__dirname, '../public/js'), staticOptions));
        this._app.use('/imgs', _express2.default.static('../public/imgs', staticOptions));
        this._app.use('/sw.js', function (req, res) {
            return res.sendFile(_path2.default.resolve('../sw.js'), staticOptions);
        });
        // this._app.use('/sw.js.map', (req, res) => res.sendFile(path.resolve('../public/sw.js.map'), staticOptions));
        this._app.use('/public/manifest.json', function (req, res) {
            return res.sendFile(_path2.default.resolve('../public/manifest.json'), staticOptions);
        });
        this._app.get('/server/countries.json', function (req, res) {
            return res.send(_countries2.default);
        });
        this._app.get('/server/currencies.json', function (req, res) {
            return res.send(_currencies2.default);
        });
        this._app.get('/currencies/:from-:to', function (req, res) {

            var page = 'https://free.currencyconverterapi.com/api/v3/convert?q=' + req.params.from + '_' + req.params.to + ',' + req.params.to + '_' + req.params.from + '&compact=ultra';
            //https://www.currencyconverterapi.com/api/v3/convert?q=USD_PHP,PHP_USD&compact=ultra&apiKey=YOUR_API_KEY   

            var content = "";

            var endCall = function endCall(content) {
                res.send(content);
            };

            var mreq = _https2.default.get(page, function (res) {
                res.setEncoding("utf8");
                res.on("data", function (chunk) {
                    content += chunk;
                });

                res.on("end", function () {
                    _util2.default.log(content);
                    endCall(content);
                });
            });

            mreq.end();
            //res.send(content);
        });
        this._app.get('/', function (req, res) {
            return res.sendFile(_path2.default.join(__dirname, '../', 'index.html'));
        });
    }

    _createClass(Server, [{
        key: 'startServer',
        value: function startServer() {
            var startUpMessage = 'Olfx Server is running with IP address ' + this._ip + ' and listens on port ' + this._port + ' ';
            this._app.listen(this._port, this._ip, function () {
                return console.log(startUpMessage);
            });
        }
    }]);

    return Server;
}();

exports.default = Server;
//# sourceMappingURL=maps/Server.js.map
