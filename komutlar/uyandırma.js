const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`Bu Komutu Kullanabilmek İçin **Yönetici** İznine Sahip Olmalısın!`);
  
if (!message.member.voice.channel) {
return message.reply("Ses kanalında olman lazım!");
}
const filter = (reaction, user) => {
return ['✅'].includes(reaction.emoji.name) && user.id === kullanıcı.id;
};
  
let kullanıcı = message.mentions.members.first()
if (!kullanıcı) return message.channel.send('Bir Kullanıcı Belirt.');

let member = message.guild.member(kullanıcı);

if (!member.voice.channel) return message.channel.send('Etiketlenen Kullanıcı Ses Kanalında Değil.').then(m => m.delete,{timeout: 5000});

const voiceChannel = message.member.voice.channel.id;
if (!voiceChannel) return;
  
 {
    kullanıcı.voice.setChannel("898214623407394856");
    kullanıcı.voice.setChannel(voiceChannel);
    kullanıcı.voice.setChannel("898214623407394856");
    kullanıcı.voice.setChannel(voiceChannel);
    kullanıcı.voice.setChannel("898214623407394856");
    kullanıcı.voice.setChannel(voiceChannel);
    kullanıcı.voice.setChannel("898214623407394856");
    kullanıcı.voice.setChannel(voiceChannel);
    }return
}


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
    kategori: 'kullanıcı',
  permLevel: 0
};

exports.help = {
  name: 'uyandır',
  isim: 'uyandır',
  description: 'Güvenliğinnizi / Seçtiğiniz kişinin güvenliğini sorgular.',
  usage: 'uyandır [@kişi]'
};