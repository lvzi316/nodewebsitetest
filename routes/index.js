var express = require('express');
var router = express.Router();
var fs = require('fs');
var title;
var jsondata;
/* GET home page. */
router.get('/', function(req, res, next) {

  fs.readFile('package.json', function(err, data) {
      if (err) 
      {
        title = 'Oops';
      };
      title = 'resource';
      res.render('index', { title: 'resource' , resource: JSON.stringify(JSON.parse(data), null, 4)});
    }
  )
});

module.exports = router;
