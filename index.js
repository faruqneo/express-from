const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const exphbs  = require('express-handlebars');
const session = require('express-session')
const flash = require('connect-flash')

//Init app
const app = express()

//mongodb connection
mongoose.connect('mongodb://localhost/neo',{ useNewUrlParser: true });
let db = mongoose.connection;

//check connection
db.once('open',function(){
    console.log("connected with mongodb")
});


//check connection error
// db.on('error', function(){
//     console.log(error)
// });

//Connect with model
let Article = require('./models/article');

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

//Getting Start
app.get('/',function(req, res){
    Article.find({},function(err, articles){
        if(err)
        {
            console.log(err)
        }
        else{
            res.render('index', {
                articles: articles
            });
        }
    });
});

//Add page 
app.get('/add',function(req, res){
    res.render('add');
});

//Insering new data
app.post('/newarticles', function(req, res){

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //Get error
    let errors = req.validationErrors();

    if(errors)
    {   
        
        res.render('add',{
            errors: errors
        });
    }
    else
    {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;
    
        article.save(function(err){
            if(err)
            {
                console.log(err)
            }
            else
            {
                req.flash('success', 'Article Added') // not working
                res.redirect('/')
            }
        });
    }
});

//Securing post data
app.get('/newarticles',function(req, res){
    res.render('Warning')
});

//Getting data
app.get('/update/:id',function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit',{
            article: article
        });
    })
});

//Deleting data
app.get('/update/article/delete/:id', function(req, res){
    let id = {_id:req.params.id}
    Article.deleteOne(id, function(err){
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.redirect('/')
        }
    })

});

//Getting data in form
app.get('/update/article/view/:id',function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('view',{
            article: article
        });
    })
});

//Data updating
app.post('/update/articles/:id', function(req, res){
    let article = req.body;
    
    let id = {_id:req.params.id}
    //console.log(req.params.id)
    Article.updateOne(id, article,function(err){
        if(err)
        {
            console.log(err)
        }
        else
        {
            res.redirect('/')
        }
    })
});

//Updation security
app.get('/update/articles/:id', function(req, res){
    res.render('Warning')
});

//Server running
app.listen(3000, function(req, res){
    console.log('server is running');
}); 
