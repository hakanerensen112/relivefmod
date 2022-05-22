const Discord = require ("discord.js");

exports.run = (client, message) => {
const lembed = new Discord.MessageEmbed()

.then;   
const mhelp = new Discord.MessageEmbed()
.setColor("BLACK")
.setAuthor(`${client.user.username} `, client.user.avatarURL)  
.setTitle("RELİVEF BOT | MODERASYON MENÜSÜ")
.setThumbnail("https://cdn.discordapp.com/emojis/727894683061321759.gif?v=1")
    .setDescription(`


╔═════════════════════════════════════╗
║**MODERASYON KOMUTLARI**
║**!ban**   Sunucudan bir üyeyi yasaklar.
║**!unban** İstediğiniz kişinin banını kaldırır.
║**!kick**  Sunucudan bir üye kickler.
║**!jail**  Kişiyi jaile yollar.
║**!reboot**  botu yeniden başlatır (önerilmez)
║**!Ping**        Botun Geçikmesini Gösterir.
║**!say**         Sunucudaki Üye Sayısını Gösterir.
║**!sosyal**         Sosyal Medya Hesaplarımızı Gösterir.
║══════════════════════════════════════
║**SOHBET KOMUTLARI**
║**!afk**          AFK kalırsınız etiketlendiğinizde sebebi yazar.
║**!sil**          Belirli bir kanaldaki mesajları siler.
║**!sohbet-kapat** Sohbeti Kapatır ve yazı yazılamaz.
║**!sohbet-aç**    Sohbeti Açar ve yazı yazılabilir.
║**!küfür-engel aç/kapat**   Küfür Koruması.
║**!Reklam-engel aç/kapat**  Reklam Koruması.
║**!nuke**         Kanalı kapatır,mesajları siler ve tekrardan açar.
║**!mute**         Kişiye sohbet/sesli mute atılır.
║══════════════════════════════════════
║**SESLİ KOMUTLARI**
║**!git**          Kişi onay verirse odasına gidersiniz.
║**!çek**          Kişi onay verirse odanıza gelir.
╚═════════════════════════════════════╝
`)
        .setFooter(`${message.author.username} Tarafından Girildi.`, message.author.avatarURL)
message.channel.send(mhelp)
.then; const sembed = new Discord.MessageEmbed()

}; 
exports.conf = {
    enabled: true, 
    guildOnly: false, 
    aliases: ["moderasyon", "moderasyon-komutları"], 
    permLevel: 0 
  };
 
  exports.help = {
    name: 'moderasyon-komutları', 
    description: 'moderasyon-komutları',
    usage: 'moderasyon-komutları'
  };