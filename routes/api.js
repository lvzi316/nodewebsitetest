var wxauth = require('../lib/wx/wxauth.js');
exports.get = function(req,res,next){
  var signature=req.query.signature;
  console.log('signature:' + signature);

  var timestamp=req.query.timestamp;
  console.log('timestamp:' + timestamp);

  var nonce=req.query.nonce;
  console.log('nonce:' + nonce);

  var echostr=req.query.echostr;
  console.log('echostr:' + echostr);

  var check=false;
  check = wxauth.auth(signature, timestamp, nonce, 'chaopan_wx2015');
  
  if(check) {
    console.log('wx auth succeed.');
    res.write(echostr);
  }else {
    console.log('wx auth failed.');
    res.write("error data");
  }
  res.end();

};

exports.post = function(req, res, next) {
  console.log('post request');
}