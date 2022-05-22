const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  let kanalid = "941813528778641530"//komut kullanılacak kanalın id si

if(message.channel.id !== kanalid) return;
const member = message.mentions.users.first() || message.member;
const oyunismi = args[0]
const kayitciismi = message.author.username


//kullanıcı isim girmemiş uyarısı
let boş = new Discord.MessageEmbed()
.setColor("RANDOM")
.setAuthor("Kayıt Sistemi")
.setDescription("Lütfen Kayıt Olmak İstediğiniz İsmi Giriniz");


message.delete();

//eğer kullanıcı bir isim girmemişse onu algılama ve yazdırma
if (!args.length) {
  message.reply(boş).then(a=>a.delete({timeout:5000}));
  return;
}


message.delete();

//kanala mesaj gönderme
let kayıtsistem = new Discord.MessageEmbed()
.setColor("RANDOM")
.setAuthor("Kayıt Sistemi")
.setDescription(`${kayitciismi} Başarıyla ${oyunismi} Adı İle Kayıt Oldun`);
message.reply(kayıtsistem).then(a=>a.delete({timeout:3000})); //3000 = 3sn 10000 = 10sn lütfen 3000 in aşağısına inmeyin



try {
  member.setNickname(oyunismi)
} catch (err) {
  message.reply(`isim değiştirme başarısız oldu`)
}

}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [`kayıt`]
};

exports.help = {
  name: 'kayıt',
  description: "kayıt",
  usage: "kayıt"
};