var express = require('express');
var router = express.Router();
var fs = require('fs');
var title;
var jsondata;
var syncgroups = [
  {
    'name':'mysyncgroup',
    'status':'created',
    'createby':'2015-01-29',
    'detailurl':'/syncgroup/dataset'
  },
  {
    'name':'mysyncgroup2',
    'status':'created',
    'createby':'2015-01-30',
    'detailurl':'/syncgroup/dataset'
  }
];
/* GET home page. */
router.get('/', function(req, res, next){
    res.render('index', {title: 'Sync Groups', syncgroups: syncgroups});
  }
);

router.get('/syncgroup/:name', function(req, res, next) {
  var resourcename = req.params.name;
  title = resourcename;
  var filename = 'static/' + resourcename + '.json';
  console.log('filename: ', filename);
  var data = fs.readFile(filename, function(err, data){
      var payload = JSON.parse(data);
      console.log(payload);
      res.render('detail', { title: title , resource: JSON.stringify(payload, null, 2)});
    }
  );
});

module.exports = router;
