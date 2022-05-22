const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args ) => {
  
let embed = new MessageEmbed().setFooter("RunHeaven tarafından geliştirildi.").setColor("RANDOM");
let banLog = message.guild.channels.cache.find(channel => channel.id === "900429416834932797");
let bancıRolu = message.guild.roles.cache.find(rol => rol.id === "898214569418305536");


if (!message.member.roles.cache.has(bancıRolu) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`**Yetkin yetersiz.**`).then(msg => { msg.delete({ timeout: 10000 })}).catch(console.error);


if (!args[0]) return message.channel.send(`**Yasaklamasını kaldırmak istediğin kişinin idsini gir.**`).then(msg => {msg.delete({ timeout: 10000 })}).catch(console.error);

let sorguid = args[0]

message.guild.fetchBans(true).then(async (bans) => {
  let ban = await bans.find(a => a.user.id === sorguid)
  if (!ban) {
  
    message.channel.send(`<@${sorguid}> üyesi zaten sunucuda yasaklı değil.`).then(x => x.delete({timeout:6500}));
  
    } else {

message.guild.members.unban(sorguid, `${message.author.tag} tarafından banı açıldı.`)

message.channel.send(`<@${sorguid}> (${sorguid}) adlı kullanıcının banı kaldırıldı.`).then(x => x.delete({timeout:6500}));

banLog.send(embed.setDescription(`**Banı kaldırılan: <@${sorguid}> (${sorguid})**\n\n**Banı kaldıran kişi: <@${message.author.id}>**\n`))

};
});


}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases:['unban','bankaldır','bankaldir'],
    permlevel: 0
};

exports.help = {
    name: "unban"
};