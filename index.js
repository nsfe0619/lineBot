var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: 1565375319,
  channelSecret: 'bc407d7bba57dc515d022928cc361429',
  channelAccessToken: 'PUNfMYWJC2ARrSsLOfdxmmer7GCouKmb9LOwCe/KpBMbgjkWEGicxv7DzD38dL0dxzWFpjE3nk3XpyJ6qhrjvljczlO+7wpTq7oKjZTGUQAqiyuzac7vyXi7yK/7mbcaP/iewDMZJQwARRuNllrY7QdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function(event) {
  if (event.message.type = 'text') {
    var msg = event.message.text;
    event.reply(msg).then(function(data) {
      // success 
      console.log(msg);
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

function _japan() {
  clearTimeout(timer2);
  request({
    url: "http://rate.bot.com.tw/Pages/Static/UIP003.zh-TW.htm",
    method: "GET"
  }, function(error, response, body) {
    if (error || !body) {
      return;
    } else {
      var $ = cheerio.load(body);
      var target = $(".rate-content-sight.text-right.print_hide");
      console.log(target[15].children[0].data);
      jp = target[15].children[0].data;
      if (jp < 0.28) {
        bot.push('使用者 ID', '現在日幣 ' + jp + '，該買啦！');
      }
      timer2 = setInterval(_japan, 120000);
    }
  });
}