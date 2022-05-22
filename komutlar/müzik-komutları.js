const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
exports.run = async (client, message, args) => { 

  let prefix = ayarlar.prefix;
  const embed = new Discord.MessageEmbed()
  .setColor("GREEN")
  .setTitle("RELİVEF SERVER BİLGİ | MÜZİK MENÜSÜ")
  .setDescription(`${message.author.tag} işte bunlar benim eğlence komutlarım!`)
  .addField(`${prefix}oynat`,`Bir şarkı oynatır`,true)
  .addField(`${prefix}durdur`,`Bir şarkıyı durdurur`,true)
  .addField(`${prefix}filitre`,`müziğe bir filitre eklersiniz`,true)
  .addField(`${prefix}sözler`,`müziğin sözlerini verir`,true)
  .addField(`${prefix}yeniden`,`müziği yeniden oynatır`,true)
  .addField(`${prefix}dur`,`müziği duraklatır`,true)
  .addField(`${prefix}sıra`,`müzik sırasını gösterir`,true)
  .addField(`${prefix}kaldır`,`müzik sırasından bir müziği kaldırır`,true)
  .addField(`${prefix}devam`,`müziği devan ettirir`,true)
  .addField(`${prefix}müzikara`,`bir müziği aratır`,true)
  .addField(`${prefix}karıştır`,`müzik listesinin karıştırır`,true)
  .addField(`${prefix}atla`,`bir müziği atlar`,true)
  .addField(`${prefix}müzikatla`,`bir müzikten başka bir müziğe atlarsınız`,true)
  .addField(`${prefix}kaldır`,`müzik sırasından bir müziği kaldırır`,true)
  .addField(`${prefix}ses`,`müziğin sesinin ayarlarsınız`,true)
  .setThumbnail(client.user.avatarURL())
  .setFooter(`${message.author.tag} Tarafından İstendi`, message.author.avatarURL())
message.channel.send(embed)
  };

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['m-k','']
  }
  exports.help = {
    name: 'müzik-komutları'
  }