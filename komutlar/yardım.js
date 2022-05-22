const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
exports.run = async (client, message, args) => { 

  let prefix = ayarlar.prefix;
  const embed = new Discord.MessageEmbed()
  .setColor("GREEN")
  .setTitle("RELİVEF SERVER BİLGİ | YARDIM MENÜSÜ")
  .setDescription(`işte bunlar benim komutlarım`)
  .addField(`${prefix}guard-komutlar`,`guard komutlarını gösterir`,true)
  .addField(`${prefix}kanalayar-komutları`,`kanal ayarlarını gösterir`,true)
  .addField(`${prefix}eğlence-komutları`,`eğlence komutlarını gösterir`,true)
  .addField(`${prefix}moderasyon-komutları`,`Moderasyon Komutlarını Gösterir`,false)
  .addField(`${prefix}seviye-komutları`,`Seviye Komutlarını Gösterir`,true)
  .addField(`${prefix}müzik-komutları`,`Müzik komutlarını gösterir`,true)
  .addField(`----------------------------[ Diğer Komutlar ]------------------------`, true)
  .addField(`${prefix}şikayet`,`bir sorununuz varsa bu komutla bize bildirebilirsiniz`,true)
  .addField(`${prefix}avatar`,`bir kullanıcının avatarını gösterir`,true)
  .addField(`${prefix}sosyal`,`Sosyal Medya Hesaplarımızı Gösterir`,false)
  .setThumbnail(client.user.avatarURL())
  .setFooter(`${message.author.tag} Tarafından İstendi`, message.author.avatarURL())
message.channel.send(embed)
  };

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h','']
  }
  exports.help = {
    name: 'yardım'
  }