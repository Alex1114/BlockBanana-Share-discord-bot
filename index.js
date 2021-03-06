const faunadb = require('faunadb')
const Discord = require('discord.js');
const keepAlive = require('./server');

const q = faunadb.query
const DBclient = new faunadb.Client({secret: process.env.faunadb}) 
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.channel.id == 954237204102795265) {
    if (msg.author == client.user){
      return
    }
    if (String(msg.content)[4] == "-") {
      shareId = msg.content;
      tokenId = parseInt(String(shareId).substring(5))
      if (String(shareId).substring(0, 4) == "MAYC") {
        token_name = String(shareId).substring(0, 4) + "-" + String(tokenId).padStart(5, "0")
      } else {
        token_name = String(shareId).substring(0, 4) + "-" + String(tokenId).padStart(4, "0")
      }
      
      DBclient.query(q.Map(q.Paginate(q.Match(q.Index(String(shareId).substring(0, 4)), token_name)), q.Lambda("imageView", q.Get(q.Var("imageView")))))
      .then((response) => {
        msg.reply(`This is your ${response.data[0].data.name} Banana Card!`)
        a = msg.channel.send({files: [{ attachment: response.data[0].data.imageDownload, name: `${response.data[0].data.name}.mp4` }]})

        
      }).catch((error) => {
        msg.reply("Sorry, the token id you enter does not exist in the database.\nPlease confirm the format is correct (ex. BAYC-0001, MAYC-00001) or DM us.");
      })
    } else {
      msg.reply("Please enter the correct format. (ex. BAYC-0001, MAYC-00001)"); 
    }
  }
        
});

keepAlive()
client.login(process.env.discord_token);

