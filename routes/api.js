var wxauth = require('../lib/wx/wxauth.js');
var parseString = require('xml2js').parseString;
var https = require('https');
var textresponstemplate = '<xml><ToUserName><![CDATA[tosuernamevalue]]></ToUserName><FromUserName><![CDATA[gh_2fc734e53c68]]></FromUserName><CreateTime>12345678</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[contentvalue]]></Content></xml>';
var linkpicresponstemplate = '<xml><ToUserName><![CDATA[tosuernamevalue]]></ToUserName><FromUserName><![CDATA[gh_2fc734e53c68]]></FromUserName><CreateTime>12345678</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>1</ArticleCount><Articles><item><Title><![CDATA[约会]]></Title><Description><![CDATA[contentvalue]]></Description><Url><![CDATA[https://nodeexpr.azurewebsites.net/calendar]]></Url></item></Articles></xml>';

function getnickname(fromuser, func){
  var https = require('https');
  var querystring = require('querystring');
  var httpoptions = {
    hostname:'api.weixin.qq.com',
    port:443,
    method:'GET'
  };
  var token = "jDQvnA9NuIJ3S5pw3xC2ieB8mRGMSX1qkPegcGUR4R24utHVUIZZHEy1Nb7AcPmjwjPuMCseegmM1DE72y5sz0WxTjWqAgvwonEj0Q5n7AU";
  var path = "/cgi-bin/user/info?" + querystring.stringify({access_token:token, openid:fromuser});
  console.log('path:' + path);
  httpoptions.path = path;
  var req = https.request(httpoptions, function(res) {
      console.log("statusCode:", res.statusCode);
      res.on('data', function(data) {
          console.log(JSON.parse(data).nickname);
          func(JSON.parse(data).nickname);
      }); 
  });
  req.on('error', function(error){
      console.log("error happened.");
      console.error(error.message);
  });
  req.end();
};

exports.get = function(req,res,next){
  var signature=req.query.signature;

  var timestamp=req.query.timestamp;

  var nonce=req.query.nonce;

  var echostr=req.query.echostr;

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

      
      if (result.xml.MsgType.toString() === 'event') {
        getnickname(fromuserName, function (nickname) {
            var textcontent = textresponstemplate.replace(/tosuernamevalue/, fromuserName);
            // console.log('content:' + content); 
            // console.log('message type:' + result.xml.MsgType.toString());

            var textcontent = textcontent.replace(/contentvalue/, "你好:" + nickname);
            console.log('getnickname succeed');
            res.setHeader("Content-Type", "application/xml");
            res.write(textcontent);
            res.end();
          }
        );

      }
      else if(result.xml.MsgType.toString() === 'text') {
        var date = new Date();
        var bookcontent = date.getFullYear().toString() + "年" + (date.getMonth() + 1).toString() + "月" + date.getDate().toString() + "日" + date.getHours().toString() + "点";
        var piclinkcontent = linkpicresponstemplate.replace(/tosuernamevalue/, fromuserName).replace(/contentvalue/, "你已经预定:" + bookcontent);
        console.log('piclinkcontent:' + piclinkcontent);
        res.setHeader("Content-Type", "application/xml");
        res.write(piclinkcontent);
        res.end();
      }
    });
  });
}
