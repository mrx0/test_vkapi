
var express = require('express');
var http = require('http');
var path = require('path');

var config = require('config');

var log = require('libs/log')(module);

var app = express();
//app.set('port', process.env.PORT || 3000);
//app.set('port', config.get('port'));

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

/*
http.createServer(app).listen(app.get('port'), function(){

    //console.log('Express server listening on port ' + config.get('port'));
    log.info('Express server listening on port ' + config.get('port'));

});

//Middleware
app.use(function(req, res, next) {
  if (req.url == '/') {
      res.end("Hello");
  }else{
      next();
  }
});

app.use(function(req, res, next) {
    if (req.url == '/test') {
        res.end("Test");
    }else{
        next();
    }
});

app.use(function(req, res, next) {
    if (req.url == '/error') {
        //res.end("Test");
        BALLALBA();
    }else{
        next();
    }
});

app.use(function(req, res, next) {
    if (req.url == '/forbidden') {
        next(new Error("oops, denied"));
    }else{
        next();
    }
});

app.use(function(req, res){
  res.send(404, "Page not found");
});
*/


app.use(express.favicon());

if (app.get('env') == 'development'){
    app.use(express.logger('dev'));
}else{
    app.use(express.logger('default'));
}

//app.use(express.json());
//app.use(express.urlencoded());
app.use(express.bodyParser());

//app.use(express.session({ secret: 'your secret here' }));
app.use(express.cookieParser('your secret here'));
//app.use(express.session());

app.use(app.router);

app.get('/', function(req, res, next) {
    res.render("index", {
        body: "<b>Hello</b>"
    });
});

app.use(express.static(path.join(__dirname, 'public')));

//Свой обработчик ошибок
app.use(function(err, req, res, next) {
    //NODE_ENV = 'production'
    //console.log(app.get('env'));

    if (app.get('env') == 'development'){
        var errorHandler = express.errorHandler();
        errorHandler(err, req, res, next);
    }else{
        res.send(500);
    }
});

/*
var routes = require('./routes');
var user = require('./routes/user');


// all environments




app.get('/', routes.index);
app.get('/users', user.list);

*/

http.createServer(app).listen(config.get('port'), function(){

    //console.log('Express server listening on port ' + config.get('port'));
    log.info('Express server listening on port ' + config.get('port'));

});

