const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
exports.run = async (client, message, args) => { 

  let prefix = ayarlar.prefix;
  const embed = new Discord.MessageEmbed()
  .setColor("GREEN")
  .setTitle("RELİVEF SERVER BİLGİ | KANALAYAR MENÜSÜ")
  .setDescription(`${message.author.tag} işte bunlar benim kanal ayar komutlarım!`)
  .addField(`${prefix}gç-ayarla #kanal`,`resimli giriç-çıkış kanalını ayarlar`,true)
  .addField(`${prefix}güvenlik #kanal`,`resimli güvenlik kanalını ayarlar`,true)
  .addField(`${prefix}sayaç-ayarla (sayı) #kanal`,`belirli bir kanala sayacı ayarlar`,true)
  .addField(`${prefix}mod-log #kanal`,`moderasyon loglarının gideceği kanalı ayarlar`,true)
  .addField(`${prefix}otorol-ayarla #kanal @rolismi`,`otorol kanalını ayarlar`,true)
  .addField(`${prefix}panel aç-kapat`,`üye panelini açıp kapatır`,true)
  .setThumbnail(client.user.avatarURL())
  .setFooter(`${message.author.tag} Tarafından İstendi`, message.author.avatarURL())
message.channel.send(embed)
  };

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['ka-k','']
  }
  exports.help = {
    name: 'kanalayar-komutları'
  }