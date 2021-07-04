const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');

http.createServer((req,res)=>{
    const url = new URL(req.url, 'http://localhost:9500/');
    switch(url.pathname){
        case '/':
            let cookie = getCookie(req);
            if(typeof cookie['auth'] !== 'undefined'){
                res.write(':)');
            }
            res.end();
            break;
        case '/hello':
            let getParam = url.searchParams.get('name');
            res.writeHead(200, {'Content-Type' : 'text/plain'});
            res.end(SayHello(getParam));
            break;
        case '/sign-in':
            if(req.method == 'GET'){
                res.writeHead(200, {'Content-Type' : 'text/html'});
                var myReadStream = fs.createReadStream(__dirname + '/form.html', 'utf8');
                myReadStream.pipe(res);
            }
            else {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });
                req.on('end', () => {
                    let params = parse(body);
                });
                //res.writeHead(200, {'Set-Cookie': 'auth=; Max-Age=1'});
                res.writeHead(302, {'Location' : '/', 'Set-Cookie': 'auth=; Max-Age=20'});
                res.end();
            }
            break;
        case '/sign-out':
            res.writeHead(302, {'Location' : '/sign-in', 'Set-Cookie': 'auth=; Max-Age=10'});
            res.end();
            break;
        default:
            res.writeHead(404, {'Content-Type' : 'text/plain'});
            res.end('404, not found');
    }
}).listen(9500);

function SayHello(name){
    return 'Hello, ' + name + '!';
}

function getCookie(req){
    var cookies = {};
    if (typeof req.headers.cookie !== 'undefined') {
        req.headers && req.headers.cookie.split(';').forEach(function (cookie) {
            var parts = cookie.match(/(.*?)=(.*)$/)
            cookies[parts[1].trim()] = (parts[2] || '').trim();
        });
    }
    return cookies;
}