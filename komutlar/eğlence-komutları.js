const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
exports.run = async (client, message, args) => { 

  let prefix = ayarlar.prefix;
  const embed = new Discord.MessageEmbed()
  .setColor("GREEN")
  .setTitle("RELİVEF SERVER BİLGİ | EĞLENCE MENÜSÜ")
  .setDescription(`${message.author.tag} işte bunlar benim eğlence komutlarım!`)
  .addField(`${prefix}sigara`,`Sigara içersiniz`,true)
  .addField(`${prefix}yılan`,`3310 daki yılan oyunu`,true)
  .addField(`${prefix}espiri`,`rastgele espiri söyler`,true)
  .addField(`${prefix}adam-asmaca`,`adam asmaca oynarsınız`,true)
  .addField(`${prefix}boks-makinası`,`boks makinası oynarsınız (dikkat uçan tekme atmak yasaktır :smile:)`,true)
  .addField(`${prefix}hesap-makinesi`,`hesap nakinesini açar`,true)
  .addField(`${prefix}kasaaç`,`csgo kasa açma simulasyonu`,true)
  .addField(`${prefix}nahçek`,`istediğiniz birine nah çekersiniz`,true)
  .addField(`${prefix}wasted`,`Bir kullanıcıya wasted atar`,true)
  .addField(`${prefix}mcbaşarım`,`minecraft başarımı`,true)
  .addField(`${prefix}harçlık`,`Birine harçlık verir`,true)

  .setThumbnail(client.user.avatarURL())
  .setFooter(`${message.author.tag} Tarafından İstendi`, message.author.avatarURL())
message.channel.send(embed)
  };

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['e-k','']
  }
  exports.help = {
    name: 'eğlence-komutları'
  }