
var linebot = require('linebot');
var express = require('express');
var cheerio = require('cheerio');


var request = require('request');
var beautyArr=[];	
request('https://www.ptt.cc/bbs/Beauty/index.html', function (error, response, body) {

	var $=cheerio.load(body);
	$('.r-ent .title a').each(function(i,elem){
		beautyArr.push($('.r-ent .title a').eq(i).attr('href'));
	})
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  //console.log('body:', body); // Print the HTML for the Google homepage.
	console.log(beautyArr);
});

function getImages(post) {
  request('https://www.ptt.cc' + post, (err, res, body) => {
    var images = body.match(/imgur.com\/[0-9a-zA-Z]{7}/g);
    console.log('images',images);
    images = [ ...new Set(images) ]
    //callback(images);
  })
}
var bot = linebot({
  channelId: 1565375319,
  channelSecret: 'c58ae1cb241fbac4858f26fef7c94a9c',
  channelAccessToken: 'SA9InT9GKvrYsJG9a4m4hAwdp7qZdOqSNBKb9AjTGf46Oyy8sswiljKMqA7dVT4hxzWFpjE3nk3XpyJ6qhrjvljczlO+7wpTq7oKjZTGUQDwpxd9NCrCGymo5D3DN53dXMP1pdMxleC2rS64I8o8lQdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function(event) {
  if (event.message.type = 'text') {
  	console.log('beautyArr[0]',beautyArr[0]);
  	console.log('getImages(beautyArr)',getImages(beautyArr[0]));
    var msg = event.message.text;
    var imagesBack={
	    "type": "image",
	    "originalContentUrl": "https://i.imgur.com/sEZhnP4.jpg",
	    "previewImageUrl": "https://i.imgur.com/sEZhnP4.jpg"
	}
    event.reply(imagesBack).then(function(data) {
      // success 
      console.log(imagesBack);
    }).catch(function(error) {
      // error 
      console.log('error');
    });
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
