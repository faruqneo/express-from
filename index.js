const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const exphbs  = require('express-handlebars');
const session = require('express-session')
const articles = require('./Router/articles')

//Init app
const app = express()

//mongodb connection
mongoose.connect('mongodb://localhost/neo',{ useNewUrlParser: true });
let db = mongoose.connection;

//check connection
db.once('open',function(){
    console.log("connected with mongodb")
});

//set view page
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
        }
        return {
        param : formParam,
        msg   : msg,
        value : value
        };
    }
}));

//use router
app.use('/', articles)


//Server running
app.listen(3000, function(req, res){
    console.log('server is running');
}); 
