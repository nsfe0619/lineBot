var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: 1565375319,
  channelSecret: 'bc407d7bba57dc515d022928cc361429',
  channelAccessToken: 'PUNfMYWJC2ARrSsLOfdxmmer7GCouKmb9LOwCe/KpBMbgjkWEGicxv7DzD38dL0dxzWFpjE3nk3XpyJ6qhrjvljczlO+7wpTq7oKjZTGUQAqiyuzac7vyXi7yK/7mbcaP/iewDMZJQwARRuNllrY7QdB04t89/1O/w1cDnyilFU='
});
bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});