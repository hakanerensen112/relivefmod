const Discord = require("discord.js");
const Client = new Discord.Client();

exports.run = async (client, message, args) => {
let isim = args[1]
let isimdeiş = message.guild.members.cache.get(message.author.id)

let sebep = args.join(" ")
        
  if (!sebep) return message.channel.send(`bir isim yazmalısın`)

isimdeiş.setNickname(isim)

message.channel.send("isim başarıyla değişildi")
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [`isim-değiştir`]
};

exports.help = {
  name: 'isim-değiştir',
  description: "isim değiştirir",
  usage: "isim-değiştir"
};