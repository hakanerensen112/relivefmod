const Discord = require('discord.js');
const ayarlar = require('./ayarlar.json');
const bot = new Discord.Client()
const westra = new Discord.ShardingManager('./server.js', {
    totalShards: 1,
    token: ayarlar.TOKEN
});
const baslat = new Discord.ShardingManager('./index1.js', {
    totalShards: 1,
    token: ayarlar.TOKEN
});


//const baslat3 = new Discord.ShardingManager('./amongus/ardademr.js', {
//  totalShards: 1,
//  token: ayarlar.TOKEN
//});



westra.spawn(); 
baslat.spawn();
//baslat3.spawn();

westra.on('launch', shard => {
  console.log(`**${shard.id}** ID'li shard başlatıldı.`)
});

baslat.on('launch', shard => {
  console.log(`**${shard.id}** ID'li shard başlatıldı.`)
});

//baslat2.on('launch', shard => {
//  console.log(`**${shard.id}** ID'li shard başlatıldı.`)
//});

//baslat3.on('launch', shard => {
//  console.log(`**${shard.id}** ID'li shard başlatıldı.`)
//});




setTimeout(() => {
    westra.broadcastEval("process.exit()");
},2147483647);

setTimeout(() => {
  baslat.broadcastEval("process.exit()");
},2147483647);


//setTimeout(() => {
//  baslat3.broadcastEval("process.exit()");
//}, 21600000);

