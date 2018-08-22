
console.log("Let's do it");

var http = require ('http');
var url = require ('url');

var server = new http.Server(function (req, res) {

    console.log(req.headers);

    console.log(req.method, req.url);

    var urlParsed = url.parse(req.url, true);

    console.log(urlParsed);

    if (urlParsed.pathname == '/echo' && urlParsed.query.message){
        //Чтобы не кэшировалось
        res.setHeader('Cache-control', 'no-cache, no-store, must-revalidate');
        //res.statusCode = 200;
        res.end(urlParsed.query.message);
    }else{
        res.statusCode = 404;
        res.end("Page not found");
    }
});

server.listen(1337, 'localhost');

/*var counter = 0;

server.on('request', function(req, res){
    res.end("Hello, world!" + ++counter);
});*/