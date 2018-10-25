
var linebot = require('linebot');
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');

//抽表特start
var beautyArr=[];	
function getBeautyArr() {
	request('https://www.ptt.cc/bbs/Beauty/index'+parseInt(1135*Math.random()+1300)+'.html', function (error, response, body) {

		var $=cheerio.load(body);
		$('.r-ent .title a').each(function(i,elem){
			beautyArr.push($('.r-ent .title a').eq(i).attr('href'));
		})
	});
}

function getImages(post,callback) {
  request('https://www.ptt.cc' + post, (err, res, body) => {
	var imgArr=[];	
	if(body){	
	  	var images = body.match(/imgur.com\/[0-9a-zA-Z]{7}/g);
	  	var randomImgArr=images;
	  	if(randomImgArr){
		  	var tmpRandomImg=randomImgArr[parseInt(randomImgArr.length*Math.random())];

		  	callback(tmpRandomImg,post);
	  	}else{
	  		callback(false,post);
	  	}
	}else{
	  		callback(false,post);
	 }

  });
}
//抽表特end
//抽紳士狗start
var gentlemanDogArr=[];	
function getGentlemanDogArr() {
	request('https://xn--zqs261djkh.com/', function (error, response, body) {

		var $=cheerio.load(body);
		$('.outDIV a').each(function(i,elem){
			console.log('outDiv',$('.outDIV a'));
			//beautyArr.push($('.r-ent .title a').eq(i).attr('href'));
		})
	});
}

//抽紳士狗end
//查IV start{
function queryIV(pokemonName,CP,HP,star)	 {
	queryPokemon(pokemonName)
}
function queryPokemon(pokemonName){
	var csv = require("fast-csv");
	csv
	.fromPath("node_modules/pokemonData/pokemonBaseStat.csv")
	.on("data", function(results) {
	  console.log(results);
	})
	.on("end", function() {
	  console.log("讀取成功!");
	});
}
//查IV back

var bot = linebot({
  channelId: 1565375319,
  channelSecret: 'c58ae1cb241fbac4858f26fef7c94a9c',
  channelAccessToken: 'SA9InT9GKvrYsJG9a4m4hAwdp7qZdOqSNBKb9AjTGf46Oyy8sswiljKMqA7dVT4hxzWFpjE3nk3XpyJ6qhrjvljczlO+7wpTq7oKjZTGUQDwpxd9NCrCGymo5D3DN53dXMP1pdMxleC2rS64I8o8lQdB04t89/1O/w1cDnyilFU='
});
bot.on('message', function(event) {
  if (event.message.type = 'text') {
  	if(event.message.text=='吼猴抽表特'){
  	getBeautyArr();
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
		    var msg=[{
				"type":"text",
				"text":'沒抽到妹子QQ 請重抽'
			},{
				"type":"text",
				"text":'https://www.ptt.cc'+url
				}]
	    	event.reply(msg).then(function(data) {
		      // success 
		      console.log(msg);
		    }).catch(function(error) {
		      // error 
		      console.log('error');
		    });
	    }
  	});
  	}else if(event.message.text.match(/查IV.*/)){
  		console.log("event.message.text",event.message.text);
  		var textSplit=event.message.text.split(" ");
  		console.log("textSplit",textSplit);
  		if(textSplit.length>1){
  			queryIV(textSplit[1]);
  		}	
  	}
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
