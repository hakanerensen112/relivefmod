const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

exports.run = (client, message, args, params) => {
    if (!message.guild) {
        const ozelmesajuyari = new Discord.MessageEmbed()
        .setColor(`Random`)
        .setAuthor(message.author.username, message.author.avatarURL)
        .addField('**Bu Komutu Özel Mesajlarda Kullanamazsın.!**')
    return message.author.send(ozelmesajuyari); }
    if( message.channel.type !== 'dm');
    let mesaj = args.slice(0).join('');
    if (mesaj.length < 1) return message.reply('**Harçlık Vereceğin Kişiyi Etiketle **');
    const embed = new Discord.MessageEmbed()
    .setAuthor('100 Tl Harçlık wooooooooow')
     .setColor(`Random`)
    .setDescription(`** ${mesaj} ` + message.author.username + '  Sana 100 TL Harçlık Verdi  **')
  return message.channel.send(embed)
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
};

exports.help = {
  name: 'harçlık',
  description: 'Harçlık verin',
  usage: 'harçlık [duyurmak istediğiniz şey]'
};
