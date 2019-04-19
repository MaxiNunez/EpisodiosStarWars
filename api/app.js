var redis = require('redis');
var express = require('express')
var app = express()
var port = 3000
var bodyParser = require('body-parser');

app.set('view engine', 'html');

app.set('views', __dirname);

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname +'/images'));
app.use(bodyParser());

var cliente = redis.createClient(6379,'redis')
app.set('port',port)

cliente.on('connect',function(){
    console.log('conectado a redis');
})

app.listen(app.get('port'),(err)  => {
    console.log(`Server running on port ${app.get('port')}/`);
});

app.get('/', function(req, res) {
    res.sendFile('/views/index.html',{root:__dirname});
});

app.get('/addPersonaje', function(req, res) {
    res.sendFile('/views/addPersonaje.html',{root:__dirname});
});

app.get('/delPersonaje', function(req, res) {
    res.sendFile('/views/delPersonaje.html',{root:__dirname});
});

app.post('/add', function(req,res){
    var personaje = req.body.per;
    var episodio = req.body.epi;
    cliente.lpush(episodio,personaje,redis.print)
    console.log(personaje+"--"+episodio)
    res.send('<h1>Personaje insertado!</h1>'+'<a href="/"><input type="button" value="Inicio"></a>');
});

app.post('/del',function(req,res){
    var personaje = req.body.per;
    var episodio = req.body.epi;
    cliente.lrem(episodio,personaje, redis.print)
    console.log(personaje+"--"+episodio)
    res.send('<h1>Personaje eliminado!</h1>'+'<a href="/"><input type="button" value="Inicio"></a>');
});
 
app.post('/lis',(req,res)=>{
    var episodio = req.body.numero;
    cliente.LRANGE(episodio,0,-1, function(err, value){
        res.send('<h1>Listado de personajes </h1>'+ value +'<div><a href="/"><input type="button" value="Inicio"></a></div>');
    });
});

