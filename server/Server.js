import express from 'express';
import path from 'path';
import countries from './countries.json';
import currencies from './currencies.json';
import  util from 'util';
import https from 'https';


export default class Server {
    constructor(port=8000, ip='127.0.0.1') {
        this._app = express();
        this._port = port;
        this._ip = ip;
        
        const staticOptions = {
            maxAge: 0
        };
        this._app.use('/css', express.static(path.join(__dirname, '../css'), staticOptions));
        this._app.use('/public/js', express.static(path.join(__dirname, '../public/js'), staticOptions));
        this._app.use('/imgs', express.static('../public/imgs', staticOptions));
        this._app.use('/sw.js', (req, res) => res.sendFile(path.resolve('../sw.js'), staticOptions));
       // this._app.use('/sw.js.map', (req, res) => res.sendFile(path.resolve('../public/sw.js.map'), staticOptions));
        this._app.use('/public/manifest.json', (req, res) => res.sendFile(path.resolve('../public/manifest.json'), staticOptions));
        this._app.get('/server/countries.json', (req, res) => res.send(countries));
        this._app.get('/server/currencies.json', (req, res) => res.send(currencies));
        this._app.get('/currencies/:from-:to', (req, res) => { 

        let page = `https://free.currencyconverterapi.com/api/v3/convert?q=${req.params.from}_${req.params.to},${req.params.to}_${req.params.from}&compact=ultra`;
        //https://www.currencyconverterapi.com/api/v3/convert?q=USD_PHP,PHP_USD&compact=ultra&apiKey=YOUR_API_KEY   

        let content = "";   
            
        let endCall = (content) => {res.send(content);};

        let mreq = https.get(page, function(res) {
            res.setEncoding("utf8");
            res.on("data", function (chunk) {
                content += chunk;
            });

            res.on("end", function () {
                util.log(content);
                endCall(content);
            });
        });

        mreq.end();
        //res.send(content);
        
        });
        this._app.get('/',  (req, res) => res.sendFile(path.join(__dirname, '../', 'index.html')));    
    }
    
    startServer(){
        let startUpMessage = `Olfx Server is running with IP address ${this._ip} and listens on port ${this._port} `
        this._app.listen(this._port, this._ip, () => console.log(startUpMessage))
    }
}
 


