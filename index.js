
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
//查IV start

function queryIV(pokemon,callback)	 {
	queryPokemon(pokemon[1],pokemon[2],pokemon[3],pokemon[4],function(pokemonData){
		var returnMsg;
		for(var p in pokemonData){
			var pokemon=pokemonData[p];
			returnMsg+=pokemon.pokemonName+' IV:'+pokemon.IV+ '% IV_attack:'+pokemon.IV_attack+' IV_defence:'+pokemon.IV_defence +' IV_stamina:'+pokemon.IV_stamina+'%0D%0A';
		}
	  console.log("queryIV",returnMsg);
		callback(returnMsg);
	})
}
function queryPokemon(pokemonName,CP,HP,star,callback){
	var pokemonIVData=[];
	queryCSV("node_modules/pokemonData/pokemonStarDust.csv",function(pokemonStarDust){
		queryCSV("node_modules/pokemonData/pokemonCPM.csv",function(pokemonCPM){
			queryCSV("node_modules/pokemonData/pokemonBaseStat.csv",function(pokemonLib){
				for(var i in pokemonLib){
					if(pokemonName==pokemonLib[i][1]||pokemonName==pokemonLib[i][2]||pokemonName==pokemonLib[i][3]||pokemonName==pokemonLib[i][4]){
					 // callback(pokemonLib[i]);
					 	var pokemonData=pokemonLib[i];
					 	var pokemonNo=pokemonData[0];
					 	var baseStamina=parseInt(pokemonData[5]);
					 	var baseAttack=parseInt(pokemonData[6]);
					 	var baseDefence=parseInt(pokemonData[7]);

						var pokemon=pokemonLib[i];
						for(var s in pokemonStarDust){
							if(pokemonStarDust[s][1]==star){
								var lv=pokemonStarDust[s][0]
								for(var c in pokemonCPM){
									if(pokemonCPM[c][0]==lv){
										var CPM=parseFloat(pokemonCPM[c][1]);
										for(var IV_stamina=1;IV_stamina<=15;IV_stamina++){
											countHP=Math.floor((baseStamina+IV_stamina)*CPM);
											if(HP==countHP){
												for(var IV_attack=1;IV_attack<=15;IV_attack++){

													for(var IV_defence=1;IV_defence<=15;IV_defence++){
														var countCP=Math.floor((baseAttack + IV_attack) * Math.sqrt(baseDefence + IV_defence) * Math.sqrt(baseStamina + IV_stamina) * (CPM*CPM) / 10 );

														if(countCP==CP){
															var IV=Math.floor((IV_stamina+IV_attack+IV_defence)/45*100)
															pokemonIVData.push({pokemonName:pokemonName,IV:IV,IV_attack:IV_attack,IV_defence,IV_stamina:IV_stamina})
															//console.log(pokemonName+' IV:'+IV+ '% IV_stamina:'+IV_stamina+' IV_attack:'+IV_attack+' IV_defence:'+IV_defence);
															
														}
													}

												}

											}
										}
									}
								}
							}
						}
					}

				}
				callback(pokemonIVData);
			})
		})
	})
}
//查IV back
function queryCSV(url,callback){
	var csv = require("fast-csv");
	var pokemonArr=[];
	csv
	.fromPath(url)
	.on("data", function(result) {
		pokemonArr.push(result);
	})
	.on("end", function() {
	  console.log("讀取成功!");
		callback(pokemonArr);
	});

}
function msgType(arr){
	var returnMsg=[];
	for(var a in arr){
		returnMsg.push({
				"type":"text",
				"text":arr[a]
				})
	}
	  console.log("msgType",returnMsg);
	return returnMsg;
}

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
  		if(textSplit.length>4){
  			queryIV(textSplit,function(msg){
  				console.log('msg',msg)
	    	event.reply(msgType(msg)).then(function(data) {
		      // success 
		      console.log(msg);
		    }).catch(function(error) {
		      // error 
		      console.log('error');
		    });
  			});
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
