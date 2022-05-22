const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
exports.run = async (client, message, args) => { 

  let prefix = ayarlar.prefix;
  const embed = new Discord.MessageEmbed()
  .setColor("GREEN")
  .setTitle("RELİVEF SERVER BİLGİ | GURAD MENÜSÜ")
  .setDescription(`${message.author.tag} işte bunlar benim guard komutlarım!`)
  .addField(`${prefix}ban-koruma sıfırla`,`ban korumayı ayarlar veya sıfırlar`,true)
  .addField(`${prefix}bot-izni ver-kaldır`,`sunucuda eğer antiraid açıksa ve bot eklemek istiyorsanız bunu kullanabilirsiniz`,true)
  .addField(`${prefix}anti-raid aç-kapat`,`sunucuya raid atılırsa önleyecektir`,true)
  .addField(`${prefix}Küfür-engel aç-kapat`,`ismindende belli`,true)
  .addField(`${prefix}reklam-engel aç-kapat`,`ismindende belli`,true)
  .addField(`${prefix}reklam-log #kanalismi`,`reklam yapan kişilerin yaptığı reklamlar`,true)
  .addField(`${prefix}rol-koruma aç-kapat`,`eğer bir rol silinirse onu önler`,true)
  .addField(`${prefix}self-koruma aç-kapat`,`bunun ne işe yaradığını bende bilmiyorum`,true)
  .addField(`${prefix}spam-engel aç-kapat`,`bir kanala spam atılırsa engeller`,true)
  .setThumbnail(client.user.avatarURL())
  .setFooter(`${message.author.tag} Tarafından İstendi`, message.author.avatarURL())
message.channel.send(embed)
  };

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['g-k','']
  }
  exports.help = {
    name: 'guard-komutları'
  }