var wxauth = require('../lib/wx/wxauth.js');
var parseString = require('xml2js').parseString;
var responstemplate = '<xml><ToUserName><![CDATA[tosuernamevalue]]></ToUserName><FromUserName><![CDATA[gh_2fc734e53c68]]></FromUserName><CreateTime>12345678</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[contentvalue]]></Content></xml>';

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
  var formData="";
  
  req.on("data",function(data){
    formData+=data;
  });

  req.on("end",function(){
    console.log('formData:' + formData);

    parseString(formData, function (err, result) {
      console.log('result:' + result.toString());

      var fromuserName = result.xml.FromUserName.toString();
      console.log('FromUser:' + fromuserName);
      console.log('ToUserName:' + result.xml.ToUserName.toString());
      
      var content = responstemplate.replace(/tosuernamevalue/, fromuserName);
      console.log('content:' + content);

      var date = new Date();
      var bookcontent = date.getFullYear().toString() + "年" + (date.getMonth() + 1).toString() + "月" + date.getDate().toString() + "日" + date.getHours().toString() + "点";
      var finalcontent = content.replace(/contentvalue/, "你已经预定:" + bookcontent);

      res.setHeader("Content-Type", "application/xml");
      res.write(finalcontent);
      res.end();
    });
  });
}
