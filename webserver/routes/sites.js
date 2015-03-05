var express    = require('express'),
    debug      = require('debug')('http'),
    util       = require('util');

var router = express.Router();


/* GET sites */
router.get('/', function (req, res, next) {

    // @todo: pass method to index
    // @todo: pass id to index

    // @see http://expressjs.com/api.html#res.format
    res.format({
        text: function(){
            res.send('sites via `text/plain`');
        },

        html: function(){
            res.send('<p style="background-color: grey; color: white;">sites via `text/html`</p>');
        },

        json: function(){
            res.send({message: 'sites via json request'});
        }
    });


    // render index of controller
    //req.controllers.site.index()
    //    .then(function(result) {
    //        res.render('sites', result);
    //    })
    //    .fail(function(err){
    //        console.error(err);
    //    });
});

/* GET sites/:id */
router.get('/:id', function (req, res, next) {
    res.render('index', {title: 'User: ' + req.params.id});
});

/* POST sites */
router.post('/:id', function (req, res, next) {
    //// render index of controller
    //req.controllers.site.index()
    //    .then(function(result) {
    //        res.render('sites', result);
    //    })
    //    .fail(function(err){
    //        console.error(err);
    //    });
});


module.exports = router;
