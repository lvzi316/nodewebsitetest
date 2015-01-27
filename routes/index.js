var express = require('express');
var router = express.Router();
var fs = require('fs');
var title;
var jsondata;
/* GET home page. */
router.get('/resource/:name', function(req, res, next) {
  var resourcename = req.params.name;
  title = resourcename;
  console.log('page title: ', title);
  var filename = 'static/' + resourcename + '.json';
  console.log('filename: ', filename);
  var data = fs.readFile(filename, function(err, data){
      var payload = JSON.parse(data);
      console.log(payload);
      res.render('index', { title: title , resource: JSON.stringify(payload, null, 2)});
    }
  );

});

module.exports = router;
