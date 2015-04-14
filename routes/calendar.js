exports.calendar = function(req, res, next) {
  res.render('calendar');
};

exports.newcalendar = function(req, res, next) {
  console.log("request body:" + req.body.name);
  console.log("request body:" + req.body.Date);
  console.log("request body:" + req.body.Location);
  res.json({result:'succeed'});
};