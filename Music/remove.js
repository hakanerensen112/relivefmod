////////////////////////////
//////CONFIG LOAD///////////
////////////////////////////
const { canModifyQueue } = require("../util/MilratoUtil");
const { Client, Collection, MessageEmbed } = require("discord.js");
const { attentionembed } = require("../util/attentionembed"); 
const { PREFIX } = require(`../util/configv2`);
////////////////////////////
//////COMMAND BEGIN/////////
////////////////////////////
module.exports = {
  name: "kaldır",
  description: "Remove song from the queue",
  aliases: ["delete"],
  cooldown: 1.5,
  edesc: `Type this command to remove a specific song from the queue.\nUsage: ${PREFIX}remove <Queue num.>`,

execute(message, args) {
  //if its not a guild return
    if(!message.guild) return;
    //get the queue
    const queue = message.client.queue.get(message.guild.id);
    //if there is no queue return error
    if (!queue) return attentionembed(message,"Şuan Bir Sıra Yok");
    //if he isnt in the same voice channel as the bot
    if (!canModifyQueue(message.member)) return;
    //if no args then return error
    if (!args.length) return attentionembed(message,`Şunu Deneyin: ${message.client.prefix}remove <Sıra Numarası>`);
    //If not a number then return error
    if (isNaN(args[0])) return attentionembed(message,`Şunu Deneyin: ${message.client.prefix}remove <Sıra Numarası>`);
    //get the song
    const song = queue.songs.splice(args[0], 1);
    //react with approve
    message.react("✅")
    //send approve
    queue.textChannel.send(new MessageEmbed()
    .setDescription(`❌ | ${message.author} Şarkı **${song[0].title}** Sıradan Başarıyla Kaldırıldı`)
    .setColor("RANDOM")
    );
  }
};
