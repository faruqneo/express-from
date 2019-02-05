const express = require('express')
const router = express.Router()

//Connect with model
let Article = require('../models/article');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now())
    next()
})


//Getting Start
router.get('/',function(req, res){
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
router.get('/add',function(req, res){
    res.render('add');
});


//Insering new data
router.route('/newarticles')

//check for PUT method
    .put(function(req, res){
        res.render('restricted')
    })

//check for GET method
    .get(function(req, res){
        res.render('restricted')
        })

//check for POST method
    .post( function(req, res){

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
    })




//Getting data
router.get('/update/:id',function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('edit',{
            article: article
        });
    })
});

//Deleting data
router.get('/update/article/delete/:id', function(req, res){
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
router.get('/update/article/view/:id',function(req, res){
    Article.findById(req.params.id, function(err, article){
        res.render('view',{
            article: article
        });
    })
});

//Data updating
router.route('/update/articles/:id')

//checking for PUT
    .put(function(req, res){
        res.render('restricted')
    })

//checking for GET 
    .get( function(req, res){
        res.render('restricted')
    })

//checking for POST
    .post( function(req, res){
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
    })

module.exports = router