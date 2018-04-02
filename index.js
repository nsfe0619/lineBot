
var linebot = require('linebot');
var express = require('express');
var cheerio = require('cheerio');


var request = require('request');
var beautyArr=[];	
request('https://www.ptt.cc/bbs/Beauty/index'+parseInt(300*Math.random()+2135)+'.html', function (error, response, body) {

	var $=cheerio.load(body);
	$('.r-ent .title a').each(function(i,elem){
		beautyArr.push($('.r-ent .title a').eq(i).attr('href'));
	})
});

var imgArr=[];	
function getImages(post,callback) {
	console.log('post',post);
  request('https://www.ptt.cc' + post, (err, res, body) => {
  	var images = body.match(/imgur.com\/[0-9a-zA-Z]{7}/g);
  	var randomImgArr=images;
  	if(randomImgArr){
  	var tmpRandomImg=randomImgArr[parseInt(randomImgArr.length*Math.random())];

  	callback(tmpRandomImg,post);
  	}else{
  		callback(false,post);
  	}
  });
}
var bot = linebot({
  channelId: 1565375319,
  channelSecret: 'c58ae1cb241fbac4858f26fef7c94a9c',
  channelAccessToken: 'SA9InT9GKvrYsJG9a4m4hAwdp7qZdOqSNBKb9AjTGf46Oyy8sswiljKMqA7dVT4hxzWFpjE3nk3XpyJ6qhrjvljczlO+7wpTq7oKjZTGUQDwpxd9NCrCGymo5D3DN53dXMP1pdMxleC2rS64I8o8lQdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function(event) {
  if (event.message.type = 'text') {
  	if(event.message.text=='吼猴抽表特'){
  	getImages(beautyArr[parseInt(beautyArr.length*Math.random())],function(img,url){
  		if(img){
		    var imagesBack=[{
			    "type": "image",
			    "originalContentUrl": "https://"+img+".jpg",
			    "previewImageUrl": "https://"+img+".jpg"
			},{
				"type":"text",
				"text":'https://www.ptt.cc'+url
				}]
		    event.reply(imagesBack).then(function(data) {
		      // success 
		      console.log(imagesBack);
		    }).catch(function(error) {
		      // error 
		      console.log('error');
		    });
	    }else{
	    	event.reply("沒抽到妹子QQ 請重抽").then(function(data) {
		      // success 
		      console.log(imagesBack);
		    }).catch(function(error) {
		      // error 
		      console.log('error');
		    });
	    }
  	});
  	}
  	/*console.log('randomImg',randomImg);
    var msg = event.message.text;
    var imagesBack={
	    "type": "image",
	    "originalContentUrl": "https://"+randomImg,
	    "previewImageUrl": "https://"+randomImg
	}
    event.reply(imagesBack).then(function(data) {
      // success 
      console.log(imagesBack);
    }).catch(function(error) {
      // error 
      console.log('error');
    });*/
  }
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
