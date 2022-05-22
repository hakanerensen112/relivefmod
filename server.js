const Discord = require("discord.js");
const { Snake } = require("discord-gamecord")
const { createCanvas, loadImage } = require('canvas')
const moment = require('moment');
const canvas = createCanvas(200, 200)
const kelime = require('rastgelekelime'); //İlk kelime için EKA hocamın modülü
const fetch = require('node-fetch');
const akinator = require("discord.js-akinator");
const ctx = canvas.getContext('2d')
const client = new Discord.Client({
  disableMentions: 'everyone'
})
require('discord-buttons')(client);
const ayarlar = require("./ayarlar.json");
const { Client, Util, Collection } = require("discord.js");
const util = require('minecraft-server-util');
const db = require("quick.db");
const fs = require("fs");//gweep creative
const hedefimiz = require(`./mainjsons/hedef.json`);
const { MessageEmbed } = require(`discord.js`);
const { channel } = require("diagnostics_channel");
const { default: discordButtons } = require("discord-buttons");
require("./util/eventLoader")(client);//gweep creative

var prefix = ayarlar.prefix
let hedef = "100"

const log = message => {
  console.log(`${message}`);
};


//gweep creative

//gweep creative
//gweep creative


const activities_list = [
  { type: 'PLAYING',  message: 'Hergün 18.00-20.00 arasında yayınlarımız vardır'  },
  { type: 'WATCHING', message: "Twitch: https://www.twitch.tv/relivef"},
  { type: 'WATCHING', message: "Youtube: https://www.youtube.com/channel/UCjqUL92NXJeS7zuvZiRRgIA"},
  { type: 'LISTENING', message: 'Bu Bot hakanerensen112 ve krylo tarafından yapılmıştır' }
];

client.on('ready', () => {
  console.log("başlatıldım :D")
  setInterval(() => {
     const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);

      client.user.setActivity(activities_list[index].message, { type: activities_list[index].type });
  }, 3000);
});

//-----------------------DESTEK AÇMAK--------------------------\\
//-----------------------DESTEK AÇMAK--------------------------\\


//////////////////////////////////////////////////
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`Toplamda ${files.length} Adet Komut Yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`${props.help.name} Adlı Komut Başarıyla Yüklendi.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});
//////////////////////////////////////////////////
client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
//////////////////////////////////////////////////
client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
//////////////////////////////////////////////////
client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

//////////////////////////////////////////////////
client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

/////-------------| KOMUTLAR |-------------\\\\\\

//--------kelime oyunu------------\\

const prefic = "!!"

client.on("message", async message => {
  if (message.author.bot) return;  //Bot ise dur
      if(message.channel.type === 'dm') return; //DM ise dur

    if (message.content.startsWith(prefix + "kelime")) { //yeni oyun
    const word = kelime() //EKAlojinin modülünden bir kelime.
    message.channel.send("Oyun başladı\n\n" + word) //kelimeyi yazar
    const ilkharf = word.split("")[word.split("").length - 1] //son harfi alır
    db.set(`sonharf_${message.guild.id}`, ilkharf) //son harfi not alır.
  }


  if (message.content.startsWith(prefic)) { //eğer belirlenen prefixle ile başlarsa (her mesajı almasın diye)
    if (!db.fetch(`sonharf_${message.guild.id}`)) return message.react("⛔")   //Eğer oyun başlamamışsa başlamaz.

    var nkelime = message.content.replace(prefic, "").toLowerCase() //Mesajdaki kelimeyi çok gerekeceği için tanımladık. Tanımlarken

    if (nkelime.split("")[0] === db.fetch(`sonharf_${message.guild.id}`)) { //aldığımız notla yazdığınız kelimenin son harfi uyuyorsa
      const arama = await fetch("https://sozluk.gov.tr/gts?ara=" + encodeURI(nkelime)) //EncodeURI kelimeyi uygun hale getiriyor
      const veri = await arama.json(); //tdk sitesinden veri alır.
      if (veri.error) {
        message.react("⛔")
        message.reply("Kelime yok. Son harf şuydu, hatırlatayım : " + db.fetch(`sonharf_${message.guild.id}`))
        return
      } //eğer öyle bir kelime yoksa sitede durur. Ama oyun bitmez, yanlış yazmış olabilirsin.
 
      message.react("🆗") //Doğru ise emoji atar
      const conten = nkelime.split("")[nkelime.split("").length - 1] //son harfi tekrar aldı
     db.set(`sonharf_${message.guild.id}`, conten) //son harfi tekrar not aldı
     db.add(`kelimesayac_${message.guild.id}`, 1) //kelime sayacına bir tane ekledi
    } else {
      message.react("⛔")   //yanlışsa yazıyor
      message.reply("Yanlış! Oyun bitti. Şu ana kadar yazılan doğru kelime : " +   db.fetch(`kelimesayac_${message.guild.id}`))  //Oyun bitince bildirir ve, doğru kelimeleri yazar. Yanlışlar da yazdırılabilir ama gereksiz :evilol:
      db.delete(`sonharf_${message.guild.id}`) //Yukarıda oyun başlamamışsa koşulunu sağlamak için DB'den siliyoruz.
    }
  }
 
});


//-------|akinatör|-------------\\

const language = "tr"; //The Language of the Game
const childMode = false; //Whether to use Akinator's Child Mode
const gameType = "character"; //The Type of Akinator Game to Play. ("animal", "character" or "object")
const useButtons = true; //Whether to use Discord's Buttons
const embedColor = "#1F1E33"; //The Color of the Message Embeds

client.on("messageCreate", async message => {
    if(message.content.startsWith(`${prefix}akinatör`)) {
        akinator(message, {
            language: language, //Defaults to "en"
            childMode: childMode, //Defaults to "false"
            gameType: gameType, //Defaults to "character"
            useButtons: useButtons, //Defaults to "false"
            embedColor: embedColor //Defaults to "RANDOM"
        });
    }
});

//-----------------| panel |----------\\

const cdb = require("orio.db")
    const dakika = 7.5;
    setInterval(() => {
        client.guilds.cache.forEach(sunucu => {
            const sunucu_panel = cdb.get(`panel.${sunucu.id}`);
            if (!sunucu_panel) return;
            sunucu_panel.filter(id => (id.split(" "))[1] === "v").forEach(kanal => {
                try {
                    const kanal_bul = sunucu.channels.cache.get((kanal.split(" "))[0]);
                    if (!kanal_bul) return cdb.delete(`panel.${sunucu.id}`);
                    let kanal_ayır = kanal_bul.name.split(" ");
                    let sunucu_üyeleri;
                    switch (kanal_ayır[0]) {
                        case "Üye":
                            sunucu_üyeleri = sunucu.members.cache.filter(üye => !üye.user.bot).size;
                            break;
                        case "Bot":
                            sunucu_üyeleri = sunucu.members.cache.filter(üye => üye.user.bot).size;
                            break;
                        case "Çevrimiçi":
                            sunucu_üyeleri = sunucu.members.cache.filter(üye => üye.user.presence.status !== 'offline').size;
                            break;
                    };
                    if (sunucu_üyeleri == undefined) return;
                    if (sunucu_üyeleri === kanal_ayır.slice(-1)) return;
                    kanal_ayır[kanal_ayır.length - 1] = sunucu_üyeleri;
                    return kanal_bul.setName(kanal_ayır.join(" "), 'Sunucu üye panel sistemi').catch(() => {});
                } catch (h) {};
            });
        });  
    }, dakika * 60000);

   ////////

// spam engel

const dctrat = require('wio.db'); 

var authors = [];
var warned = [];

var messageLog = [];

client.on('message', async message => {
  if (!message.guild) return
if (!message.guild) return
const spam = await db.fetch(`spam.${message.guild.id}`);
if(!spam) return;
const maxTime = await db.fetch(`max.${message.guild.id}.${message.author.id}`);
const timeout = await db.fetch(`time.${message.guild.id}.${message.author.id}`);
db.add(`mesaj.${message.guild.id}.${message.author.id}`, 1)
if(timeout) {
const sayı = await db.fetch(`mesaj.${message.guild.id}.${message.author.id}`);
if(Date.now() < maxTime) {
  const westraaaaam = new Discord.MessageEmbed()
  .setColor('#f6ff00')
  .setDescription(` <@${message.author.id}> , **Bu Sunucuda Spam Yapmana İzin Vermeyeceğim!**`)
  .setFooter(`Bu mesaj otomatik olarak silinecektir.`)
 if (!message.member.hasPermission("BAN_MEMBERS")) return ;
 message.channel.send(westraaaaam).then(msg => msg.delete({timeout: 5000}));
  return message.delete();
  
}
} else {
db.set(`time.${message.guild.id}.${message.author.id}`, 'ok');
db.set(`max.${message.guild.id}.${message.author.id}`, Date.now()+3000);
setTimeout(() => {
db.delete(`mesaj.${message.guild.id}.${message.author.id}`);
db.delete(`time.${message.guild.id}.${message.author.id}`);
}, 500) // default : 500
}


});

////////////////// BAN KORUMA /////////////////////
client.on("guildBanAdd", async (guild, user) => {
  let kontrol = await db.fetch(`dil_${guild.id}`);
  let kanal = await db.fetch(`bank_${guild.id}`);
  let rol = await db.fetch(`banrol_${guild.id}`);
  if (!kanal) return;
  if (kontrol == "agayokaga") {
    const entry = await guild
      .fetchAuditLogs({ type: "GUILD_BAN_ADD" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == guild.owner.id) return;
    guild.members.unban(user.id);
    guild.members.cache.get(entry.executor.id).kick();
    const embed = new Discord.MessageEmbed()
      .setTitle(`Biri Yasaklandı!`)
      .setColor('#f6ff00')
      .addField(`Yasaklayan:`, entry.executor.tag)
      .addField(`Yasaklanan Kişi:`, user.name)
      .addField(
        `Sonuç:`,
        `Yasaklayan kişi sunucudan atıldı!\nve yasaklanan kişinin yasağı kalktı!`
      );
    client.channels.cache.get(kanal).send(embed);
  } else {
    const entry = await guild
      .fetchAuditLogs({ type: "GUILD_BAN_ADD" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == guild.owner.id) return;
    guild.members.unban(user.id);
    guild.members.cache.get(entry.executor.id).kick();
    const embed = new Discord.MessageEmbed()
      .setTitle(`Biri Yasaklandı!`)
      .setColor('#f6ff00')
      .addField(`Yasaklayan:`, entry.executor.tag)
      .addField(`Yasaklanan Kişi:`, user.name)
      .addField(
        `Sonuç:`,
        `Yasaklayan kişi sunucudan atıldı ve yasaklanan kişinin yasağı kalktı. `
      );
    client.channels.cache.get(kanal).send(embed);
  }
});
/////////////////// ANTİ RAİD ///////////////////
client.on("guildMemberAdd", async member => {
let kanal = await db.fetch(`antiraidK_${member.guild.id}`)== "anti-raid-aç"
  if (!kanal) return;  
  var cod = member.guild.owner
  if (member.user.bot === true) {
     if (db.fetch(`botizin_${member.guild.id}.${member.id}`) == "aktif") {
    let are = new Discord.MessageEmbed()
      .setColor('#f6ff00')
      .setThumbnail(member.user.avatarURL())
      .setDescription(`**${member.user.tag}** (${member.id}) adlı bota bir yetkili izin verdi eğer kaldırmak istiyorsanız **.bot-izni kaldır <BotID>**.`);
    cod.send(are);
     } else {
       let izinverilmemişbot = new Discord.MessageEmbed()
      .setColor('#f6ff00')
      .setThumbnail(member.user.avatarURL())
      .setDescription("**" + member.user.tag +"**" + " (" + member.id+ ") " + "adlı bot sunucuya eklendi ve Kickledim. Eğer izin vermek istiyorsanız ** **.bot-izni ver <BotID>**")//NWA

       member.kick();// Eğer sunucudan atmak istiyorsanız ban kısmını kick yapın
       cod.send(izinverilmemişbot)
       
       
       //----------------Self Bot Koruma------------------\\

client.on('message', message => {
  if (!message.guild) return
    var antiraid = db.fetch(`sunucular.${message.guild.id}.spamkoruma`)
    if(!antiraid) return;
    if(message.author.bot) return;
    message.guild.fetchMember(message.author).then(member => {
    if(member.hasPermission('BAN_MEMBERS')) return;
    var b = []
    var aut = []
    setTimeout(() => {
    message.channel.fetchMessages({ limit: 10 }).then(m => {
    m.forEach(a => {
    if(m.filter(v => v.content === a.content).size > m.size / 2) {
    message.guild.fetchMember(m.author).then(member2 => {
    if(member2.hasPermission('BAN_MEMBERS')) return;
    b.push(a)
    aut.push(a.author)
    })}})
    if(!b.includes(":warning: | `Self` Botlar Susturulacak.")) { işlem() }
    else {}

    function işlem() {

    if(b.length > 5) {
      message.channel.send(':warning: | `Self` Botlar Susturulacak.')
      aut.forEach(a => {
        message.channel.overwritePermissions(a, {
          "SEND_MESSAGES": false
        })
      })
      message.channel.send( ' | `Self` botlar susturuldu.')
    } else return;
    }
    })})})})

//----------------Self bot koruma son----------------\\
}
  }//NWA
});//NWA

////reklam-engel

const reklam = [
  ".com",
  ".net",
  ".xyz",
  ".tk",
  ".pw",
  ".io",
  ".me",
  ".gg",
  "www.",
  "https",
  "http",
  ".gl",
  ".org",
  ".com.tr",
  ".biz",
  "net",
  ".rf",
  ".gd",
  ".az",
  ".party",
".gf"
];
client.on("messageUpdate", async (old, nev) => {

if (old.content != nev.content) {
let i = await db.fetch(`reklam.${nev.member.guild.id}.durum`);
let y = await db.fetch(`reklam.${nev.member.guild.id}.kanal`);
if (i) {

if (reklam.some(word => nev.content.includes(word))) {
if (nev.member.hasPermission("BAN_MEMBERS")) return ;
 //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
const embed = new Discord.MessageEmbed() .setColor('#f6ff00') .setDescription(` ${nev.author} , **Mesajını editleyerek reklam yapmaya çalıştı!**`)
      .addField("Mesajı:",nev)
  
      nev.delete();
      const embeds = new Discord.MessageEmbed() .setColor('#f6ff00') .setDescription(` ${nev.author} , **Mesajı editleyerek reklam yapamana izin veremem!**`) 
    client.channels.cache.get(y).send(embed)
      nev.channel.send(embeds).then(msg => msg.delete({timeout:5000}));
    
}
} else {
}
if (!i) return;
}
});

client.on("message", async msg => {
  if (!msg.guild) return

if(msg.author.bot) return;
if(msg.channel.type === "dm") return;
   let y = await db.fetch(`reklam.${msg.member.guild.id}.kanal`);

let i = await db.fetch(`reklam.${msg.member.guild.id}.durum`);
    if (i) {
        if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
          try {
           if (!msg.member.hasPermission("MANAGE_GUILD")) {
           //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
msg.delete({timeout:750});
              const embeds = new Discord.MessageEmbed() 
              .setColor('#f6ff00') 
              .setDescription(` <@${msg.author.id}> , **Bu sunucuda reklam yapmak yasak!**`)
msg.channel.send(embeds).then(msg => msg.delete({timeout: 5000}));
                     db.add(`reklam_${msg.guild.id}_${msg.author.id}`, 1)

          const embed = new Discord.MessageEmbed() 
          .setColor('#f6ff00') 
          .setDescription(` ${msg.author} , **Reklam yapmaya çalıştı!**`) 
          .addField("Mesajı:",msg)
         client.channels.cache.get(y).send(embed)
            }              
          } catch(err) {
            console.log(err);
          }
        }
    }
   if(!i) return ;
});


//reklam engel son //

//-----------------------Reklam Engel Son-----------------------\\
client.on("message", async msg => {
  if (!msg.guild) return
  //const args = msg.content.slice.split(' ');
  const args = msg.content.trim().split(/ +/g);
  const fAK = await db.fetch(`filtreAK_${msg.guild.id}`);
  let mesaj = args.slice(1).join(" ");
  const filtre = await db.fetch(`filtre_${msg.guild.id}`);
  const kufur = [
    "mk",
    "göt",
    "meme",
    "pipi",
    "am",
    "taşşak",
    "amk",
    "amq",
    "aq",
    "orospu",
    "oruspu",
    "yavşak",
    "oç",
    "sikerim",
    "yarrak",
    "piç",
    "amq",
    "sik",
    "amcık",
    "çocu",
    "oç",
    "sex",
    "seks",
    "amına",
    "orospu çocuğu",
    "sg",
    "kahpe",  
    "kahbe", 
    "siktir git"
  ];

  const reklam = [
    ".ml",
    "discord.gg",
    "invite",
    "discordapp",
    "discordgg",
    ".com",
    ".net",
    ".xyz",
    ".tk",
    ".pw",
    ".io",
    ".me",
    ".gg",
    "www.",
    "https",
    "http",
    ".gl",
    ".org",
    ".com.tr",
    ".biz",
    ".party",
    ".rf.gd",
    ".az",
    "glitch.me",
    "glitch.com"
  ];

  let kufures = await db.fetch(`kuyarr_${msg.author.id}`);
  let linkes = await db.fetch(`luyarr_${msg.author.id}`);
  let ads = msg.author.id;
  if (fAK == "açık") {
    const fltr = filtre;
    if (fltr.some(word => msg.content.includes(word))) {
      if (!msg.member.hasPermission("BAN_MEMBERS")) {
        msg.delete();

        var k = new Discord.MessageEmbed()
          .setColor("#f6ff00")
          .setAuthor("Filtre Sistemi")
          .setDescription(
            `Bu sunucuda yasaklanmış bir kelimeyi kullandınız, bu yüzden mesajınızı sildim.`
          );
        msg.channel.send(k).then(a=>a.delete({timeout:10000}));

        return;
      }
    }
  }
  
  if (!msg.guild) return;

  if (db.has(`küfürE_${msg.guild.id}`) === true) {
    if (kufur.some(word => msg.content.toLowerCase().includes(word))) {
      if (!msg.member.hasPermission("ADMINISTRATOR")) {
        msg.delete();

        var k = new Discord.MessageEmbed()
          .setColor("#f6ff00")
          .setAuthor("Küfür Engeli!")
          .setDescription(
            `Hey <@${msg.author.id}>, Bu sunucuda küfürler **${client.user.username}** tarafından engellenmektedir! Küfür etmene izin vermeyeceğim! `
          );
        db.add(`küfür_${msg.guild.id}_${msg.author.id}`, 1)
        msg.channel.send(k).then(a=>a.delete({timeout:10000}));
    
      }
    }
  }
});

//-------------------KÜFÜR ENGEL SON-----------------------\\

//afk
client.on("message", async (message) => {
  if (!message.guild) return

  if (message.channel.type == "dm") return false;

  let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || ayarlar.prefix;

  let kullanıcı = message.mentions.users.first() || message.author;
  let afkdkullanıcı = await db.fetch(`afk_${message.author.id}`);
  let afkkullanıcı = await db.fetch(`afk_${kullanıcı.id}`);
  let sebep = afkkullanıcı;

  if (message.author.bot) return;
  if (message.content.includes(`${prefix}afk`)) return;

  if (message.content.includes(`<@${kullanıcı.id}>`)) {
    if (afkdkullanıcı) {
      message.channel.send(
        `${message.author.tag} adlı kullanıcı artık AFK değil.`
      );
      db.delete(`afk_${message.author.id}`);
    }
    if (afkkullanıcı)
      return message.channel.send(
        `${message.author}, <@${kullanıcı.id}> Adlı kullanıcı şu anda AFK. Sebep : \`${sebep}\``
      );
  }

  if (!message.content.includes(`<@${kullanıcı.id}>`)) {
    if (afkdkullanıcı) {
      let rMember = message.guild.members.cache.get(message.author.id);
      var nic = db.get(`${message.author.id}nick`);
      var nick = nic;
      rMember.setNickname(nick);
      message.reply(` adlı kullanıcı artık AFK değil.`);
      db.delete(`afk_${message.author.id}`);
    }
  }
});
//afk
// İnvite Sistemi Beta //
const guildInvites = new Map();

client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
client.on('ready', () => {
    client.guilds.cache.forEach(guild => {
        guild.fetchInvites()
            .then(invites => guildInvites.set(guild.id, invites))
            .catch(err => console.log(err));
    });
});

client.on('guildMemberAdd', async member => {
    const cachedInvites = guildInvites.get(member.guild.id);
    const newInvites = await member.guild.fetchInvites();
    guildInvites.set(member.guild.id, newInvites);
    try {
        const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || "1";
        const embed = new Discord.MessageEmbed()
            .setDescription(`${member.user.tag} Sunucuya ${member.guild.memberCount}. sırayla katıldı. ${usedInvite.inviter.tag} tarafından davet edilmiş. ${usedInvite.url} Davet koduyla katılmış. Bu davet kodu ${usedInvite.uses} kere kullanılmış.`)
            .setTimestamp()
            .setFooter("ReliveF Bot")
        const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '915341645065633802');
        if(welcomeChannel) {
            welcomeChannel.send(embed).catch(err => console.log(err));
        }
    }
    catch(err) {
        console.log(err);
    }
});
// İnvite Sistemi Son //

//// Seviye ///
client.on("message", async msg => {
  if (!msg.guild) return

  if(msg.content.startsWith(prefix)) return;

  const db = require('quick.db');

  var id = msg.author.id;

  var gid = msg.guild.id;

  var xp = await db.get(`xp_${id}_${gid}`);

  var lvl = await db.get(`lvl_${id}_${gid}`);

  let seviyexp = await db.get(`seviyexp${msg.guild.id}`)

  const skanal = await db.get(`seviyekanal${msg.guild.id}`)

  let kanal = msg.guild.channels.cache.get(skanal)

  if (msg.author.bot === true) return;

  let seviyeEmbed = new Discord.MessageEmbed()

   seviyeEmbed.setDescription(`Tebrik ederim <@${msg.author.id}>! Seviye atladın ve **${lvl+1}** seviye oldun!`)

   seviyeEmbed.setFooter(`${client.user.username} | Seviye Sistemi`)

   seviyeEmbed.setColor("RANDOM")

   if(!lvl) {

    db.set(`xp_${id}_${gid}`, 5);

    db.set(`lvl_${id}_${gid}`, 1);

    db.set(`xpToLvl_${id}_${gid}`, 50);

    db.set(`top_${id}`, 1)

    }

  

  let veri1 = [];

  

  if(seviyexp) veri1 = seviyexp

  if(!seviyexp) veri1 = 5

  

  if (msg.content.length > 7) {

    db.add(`xp_${id}_${gid}`, veri1)

  };

  let seviyesınır = await db.get(`seviyesınır${msg.guild.id}`)

    let veri2 = [];

  

  if(seviyesınır) veri2 = seviyesınır

  if(!seviyesınır) veri2 = 250

   

  if (await db.get(`xp_${id}_${gid}`) > veri2) {

    if(skanal) {

 kanal.send(new Discord.MessageEmbed()

   .setDescription(`Tebrik ederim <@${msg.author.id}>! Seviye atladın ve **${lvl+1}** seviye oldun:tada:`)

   .setFooter(`${client.user.username} | Seviye Sistemi`)

   .setColor("RANDOM"))

    }

    db.add(`lvl_${id}_${gid}`, 1)

    db.delete(`xp_${id}_${gid}`)};

    db.set(`top_${id}`, Math.floor(lvl+1))

  });



//ayarlamasız sa as

client.on("message", async msg => {
  if (msg.content.toLowerCase() === 'sa') {
    msg.reply('**Aleyküm Selam, Hoşgeldin**');
  }
});
//otorol
client.on("guildMemberAdd", async member => {
  
  let kanal = db.fetch(`judgekanal_${member.guild.id}`)   
  let rol = db.fetch(`judgerol_${member.guild.id}`)
  let mesaj = db.fetch(`judgemesaj_${member.guild.id}`)

 if(!kanal) return
 member.roles.add(rol)
   client.channels.cache.get(kanal).send(':star: Otomatik Rol Verildi Seninle Beraber **`'+member.guild.memberCount+'`** Kişiyiz! :tada: Hoşgeldin! **`'+member.user.username+'`**')
 
 });
 
 // OTOROL SON

 
//sayaç
//HG MESAJI
client.on('guildMemberAdd', member => {
let kanal = client.channels.cache.get("900403578362019910")
const embed = new Discord.MessageEmbed()
.setColor("GOLD")
.setDescription(`:inbox_tray: ${member} Sunucumuza Hoşgeldin!\n\nSeninle Beraber ${member.guild.memberCount} Kişiyiz.`)
kanal.send(embed)
})

//BB MESAJI
client.on('guildMemberRemove', member => {
let kanal = client.channels.cache.get("900403578362019910")
const embed = new Discord.MessageEmbed()
.setColor("GOLD")
.setDescription(`:outbox_tray: ${member} Sunucumuzdan Ayrıldı.\n\n${member.guild.memberCount} Kişi Kaldık.`)
kanal.send(embed)
})

  

//////////GÜVENLİK/////////////
client.on("guildMemberAdd", async member => {
  let user = client.users.cache.get(member.id);
  let chan = client.channels.cache.get("921878864337182740");
  const Canvas = require("canvas");
  const canvas = Canvas.createCanvas(360, 100);
  const ctx = canvas.getContext("2d");
  let memberChannel = await db.fetch(`guvenlik_${member.guild.id}`);
  const resim1 = await Canvas.loadImage(
    "https://cdn.discordapp.com/attachments/621045237137276929/621046566106431488/tes3.png"
  );
  const resim2 = await Canvas.loadImage(
    "https://cdn.discordapp.com/attachments/621045237137276929/621046061875724298/tes1.png"
  );
  const kurulus = new Date().getTime() - user.createdAt.getTime();
  const gün = moment.duration(kurulus).format("D");
  var kontrol;
  if (kurulus <= 1296000000) kontrol = resim1;
  if (kurulus >= 1296000000) kontrol = resim2;

  const background = await Canvas.loadImage(
    "https://cdn.discordapp.com/attachments/621045237137276929/621045305089064980/arka.png"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: "jpg" }));
  ctx.drawImage(kontrol, 0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(180, 46, 36, 0, 2 * Math.PI);
  ctx.clip();
  ctx.drawImage(avatar, 143, 10, 73, 72);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "vortex-güvenlik3.png"
  );
  chan.send(attachment);
});

//güvenlik-son

//giriş-çıkış
client.on("guildMemberRemove", async member => {
  //let resimkanal = JSON.parse(fs.readFileSync("./ayarlar/gç.json", "utf8"));
  //const canvaskanal = member.guild.channels.cache.get(resimkanal[member.guild.id].resim);
  
  if (db.has(`gçkanal_${member.guild.id}`) === false) return;
  var canvaskanal = member.guild.channels.cache.get(db.fetch(`gçkanal_${member.guild.id}`));
  if (!canvaskanal) return;

  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");

  var randomMsg = ["Sunucudan Ayrıldı."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];

  let msj = await db.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;

  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "https://i.hizliresim.com/Wrn1XW.jpg"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);

  let avatarURL = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 });
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "ro-BOT-güle-güle.png"
  );

    canvaskanal.send(attachment);
    canvaskanal.send(
      msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
    );
    if (member.user.bot)
      return canvaskanal.send(`🤖 Bu bir bot, ${member.user.tag}`);
  
});

client.on("guildMemberAdd", async member => {
  if (db.has(`gçkanal_${member.guild.id}`) === false) return;
  var canvaskanal = member.guild.channels.cache.get(db.fetch(`gçkanal_${member.guild.id}`));

  if (!canvaskanal || canvaskanal ===  undefined) return;
  const request = require("node-superfetch");
  const Canvas = require("canvas"),
    Image = Canvas.Image,
    Font = Canvas.Font,
    path = require("path");

  var randomMsg = ["Sunucuya Katıldı."];
  var randomMsg_integer =
    randomMsg[Math.floor(Math.random() * randomMsg.length)];

  let paket = await db.fetch(`pakets_${member.id}`);
  let msj = await db.fetch(`cikisM_${member.guild.id}`);
  if (!msj) msj = `{uye}, ${randomMsg_integer}`;

  const canvas = Canvas.createCanvas(640, 360);
  const ctx = canvas.getContext("2d");

  const background = await Canvas.loadImage(
    "https://i.hizliresim.com/UyVZ4f.jpg"
  );
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#74037b";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = `#D3D3D3`;
  ctx.font = `37px "Warsaw"`;
  ctx.textAlign = "center";
  ctx.fillText(`${member.user.username}`, 300, 342);

  let avatarURL = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }) ;
  const { body } = await request.get(avatarURL);
  const avatar = await Canvas.loadImage(body);

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.arc(250 + 55, 55 + 55, 55, 0, 2 * Math.PI, false);
  ctx.clip();
  ctx.drawImage(avatar, 250, 55, 110, 110);

  const attachment = new Discord.MessageAttachment(
    canvas.toBuffer(),
    "ro-BOT-hosgeldin.png"
  );

  canvaskanal.send(attachment);
  canvaskanal.send(
    msj.replace("{uye}", member).replace("{sunucu}", member.guild.name)
  );
  if (member.user.bot)
    return canvaskanal.send(`🤖 Bu bir bot, ${member.user.tag}`);
});



//reklam engelle

//here engelle

client.on("message", async msg => {
  if (!msg.guild) return
  let hereengelle = await db.fetch(`hereengel_${msg.guild.id}`);
  if (hereengelle == "acik") {
    const here = ["@here", "@everyone"];
    if (here.some(word => msg.content.toLowerCase().includes(word))) {
      if (!msg.member.permissions.has("ADMINISTRATOR")) {
        msg.delete();
        return msg
          .reply("Yakaladım Seni! Everyone ve Here Etiketlemek Yasak.")
          .then(wiskyx => wiskyx.delete({ timeout: 5000 }));
      }
    }
  } else if (hereengelle == "kapali") {
  }
});
//botlist
client.on('guildMemberRemove', async member => {
	member.guild.members.cache.filter(s => db.fetch(`serverData.${member.guild.id}.botsData.${s.id}`)).forEach(x => {
      let bot = db.fetch(`serverData.${member.guild.id}.botsData.${x.id}`);
	  if(bot){
	  if(bot.owner == member.id){
             member.guild.members.ban(x, {reason: "Sahibi Sunucudan Ayrıldı."})
	     db.set(`serverData.${member.guild.id}.botsData.${x.id}.status`, "Reddedildi")
	     db.set(`serverData.${member.guild.id}.botsData.${x.id}.redReason`, "Sahibi Sunucudan Ayrıldı.")
	  }
    }
  })
});

//twitch post


//gweep creative

//küfür-engel

client.on("message", async msg => {
  if (!msg.guild) return
  const i = await db.fetch(`${msg.guild.id}.kufur`);
  if (i) {
    if (kufur.some(word => msg.content.includes(word))) {
      try {
        if (!msg.member.permissions.has("BAN_MEMBERS")) {
          msg.delete();

          return msg
            .reply("Heey! Küfür Yasak.")
            .then(wiskyx => wiskyx.delete({ timeout: 5000 }));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

client.on("messageUpdate", async msg => {
  if (!msg.guild) return
  const i = db.fetch(`${msg.guild.id}.kufur`);
  if (i) {
    const kufur = ["ag","ağzına sıçayım","ahmak","allahını","allahsız","amarım","ambiti","am biti","amcığı", "amcığın",  "amcığını","amcığınızı","amcık","amcık hoşafı","amcıklama","amcıklandı","amcik","amck","amckl","amcklama","amcklaryla",
"amckta","amcktan","amcuk","amık","amına","amınako","amına koy","amına koyarım","amına koyayım","amınakoyim","amına koyyim","amına s","amına sikem","amına sokam","amın feryadı","amını","amını s","amın oglu","amınoğlu","amın oğlu","amısına",
"amısını","amina","amina g","amina k","aminako","aminakoyarim","amina koyarim","amina koyayım","amina koyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","amin oglu","amiyum","amk","amkafa","amk çocuğu",
"amlarnzn","amlı","amm","ammak","ammna","amn","amna","amnda","amndaki","amngtn","amnn","amona","amq","amsız","amsiz","amsz","amteri","amugaa","amuğa","amuna","ana","anaaann","anal","analarn","anam","anamla","anan","anana","anandan","ananı","ananı",
"ananın","ananın am","ananın amı","ananın dölü","ananınki","ananısikerim","ananı sikerim","ananısikeyim","ananı sikeyim","ananızın","ananızın am","anani","ananin","ananisikerim","anani sikerim","ananisikeyim","anani sikeyim","anann","ananz","anas",
"anasını","anasının ","anası orospu","anasi","anasinin","anay","anayin","angut","anneni","annenin","annesiz","anuna","aptal","aq","a.q","a.q.","aq.","ass","atkafası","atmık","attırdığım","attrrm","auzlu","avrat","ayklarmalrmsikerim","azdım","azdır",
"azdırıcı","babaannesi kaşar","babanı","babanın","babani","babası pezevenk","bacağına sıçayım","bacına","bacını","bacının","bacini","bacn","bacndan","bacy","bastard","basur","beyinsiz","bızır","bitch","biting","bok","boka","bokbok","bokça","bokhu",
"bokkkumu","boklar","boktan","boku","bokubokuna","bokum","bombok","boner","bosalmak","boşalmak","cenabet","cibiliyetsiz","cibilliyetini","cibilliyetsiz","cif","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini",
"dinsiz","dkerim","domal","domalan","domaldı","domaldın","domalık","domalıyor","domalmak","domalmış","domalsın","domalt","domaltarak","domaltıp","domaltır","domaltırım","domaltip","domaltmak","dölü","dönek","düdük","eben","ebeni","ebenin","ebeninki","ebleh",
"fahise","sikcem",
"fahişe",
"feriştah",
"ferre",
"fuck",
"fucker",
"fuckin",
"fucking",
"gavad",
"gavat",
"geber",
"geberik",
"gebermek",
"gebermiş",
"gebertir",
"gerızekalı",
"gerizekalı",
"gerizekali",
"gerzek",
"giberim",
"giberler",
"gibis",
"gibiş",
"gibmek",
"gibtiler",
"goddamn",
"godoş",
"godumun",
"gotelek",
"gotlalesi",
"gotlu",
"gotten",
"gotundeki",
"gotunden",
"gotune",
"gotunu",
"gotveren",
"goyiim",
"goyum",
"goyuyim",
"goyyim",
"göt",
"göt deliği",
"götelek",
"göt herif",
"götlalesi",
"götlek",
"götoğlanı",
"göt oğlanı",
"götoş",
"götten",
"götü",
"götün",
"götüne",
"götünekoyim",
"götüne koyim",
"götünü",
"götveren",
"göt veren",
"göt verir",
"gtelek",
"gtn",
"gtnde",
"gtnden",
"gtne",
"gtten",
"gtveren",
"hasiktir",
"hassikome",
"hassiktir",
"has siktir",
"hassittir",
"haysiyetsiz",
"hayvan herif",
"hoşafı",
"hödük",
"hsktr",
"huur",
"ıbnelık",
"ibina",
"ibine",
"ibinenin",
"ibne",
"ibnedir",
"ibneleri",
"ibnelik",
"ibnelri",
"ibneni",
"ibnenin",
"ibnerator",
"ibnesi",
"idiot",
"idiyot",
"imansz",
"ipne",
"iserim",
"işerim",
"itoğlu it",
"kafam girsin",
"kafasız",
"kafasiz",
"kahpe",
"kahpenin",
"kahpenin feryadı",
"kaka",
"kaltak",
"kancık",
"kancik",
"kappe",
"karhane",
"kaşar",
"kavat",
"kavatn",
"kaypak",
"kayyum",
"kerane",
"kerhane",
"kerhanelerde",
"kevase",
"kevaşe",
"kevvase",
"koca göt",
"koduğmun",
"koduğmunun",
"kodumun",
"kodumunun",
"koduumun",
"koyarm",
"koyayım",
"koyiim",
"koyiiym",
"koyim",
"koyum",
"koyyim",
"krar",
"kukudaym",
"laciye boyadım",
"lavuk",
"liboş",
"madafaka",
"mal",
"malafat",
"malak",
"manyak",
"mcik",
"meme",
"memelerini",
"mezveleli",
"minaamcık",
"mincikliyim",
"mna",
"monakkoluyum",
"motherfucker",
"mudik",
"oc",
"ocuu",
"ocuun",
"OÇ",
"oç",
"o. çocuğu",
"oğlan",
"oğlancı",
"oğlu it",
"orosbucocuu",
"orospu",
"orospucouguv",
"orospu cocugu",
"orospu çoc",
"orospuçocuğu",
"orospu çocuğu",
"orospu çocuğudur",
"orospu çocukları",
"orospudur",
"orospular",
"orospunun",
"orospunun evladı",
"orospuydu",
"orospuyuz",
"orostoban",
"orostopol",
"orrospu",
"oruspu",
"oruspuçocuğu",
"oruspu çocuğu",
"osbir",
"ossurduum",
"ossurmak",
"ossuruk",
"osur",
"osurduu",
"osuruk",
"osururum",
"otuzbir",
"öküz",
"öşex",
"patlak zar",
"penis",
"pezevek",
"pezeven",
"pezeveng",
"pezevengi",
"pezevengin evladı",
"pezevenk",
"pezo",
"pic",
"pici",
"picler",
"piç",
"piçin oğlu",
"piç kurusu",
"piçler",
"pipi",
"pipiş",
"pisliktir",
"porno",
"pussy",
"puşt",
"puşttur",
"rahminde",
"revizyonist",
"s1kerim",
"s1kerm",
"s1krm",
"sakso",
"saksofon",
"salaak",
"salak",
"saxo",
"sekis",
"serefsiz",
"sevgi koyarım",
"sevişelim",
"sexs",
"sıçarım",
"sıçtığım",
"sıecem",
"sicarsin",
"sie",
"sik",
"sikdi",
"sikdiğim",
"sike",
"sikecem",
"sikem",
"siken",
"sikenin",
"siker",
"sikerim",
"sikerler",
"sikersin",
"sikertir",
"sikertmek",
"sikesen",
"sikesicenin",
"sikey",
"sikeydim",
"sikeyim",
"sikeym",
"siki",
"sikicem",
"sikici",
"sikien",
"sikienler",
"sikiiim",
"sikiiimmm",
"sikiim",
"sikiir",
"sikiirken",
"sikik",
"sikil",
"sikildiini",
"sikilesice",
"sikilmi",
"sikilmie",
"sikilmis",
"sikilmiş",
"sikilsin",
"sikim",
"sikimde",
"sikimden",
"sikime",
"sikimi",
"sikimiin",
"sikimin",
"sikimle",
"sikimsonik",
"sikimtrak",
"sikin",
"sikinde",
"sikinden",
"sikine",
"sikini",
"sikip",
"sikis",
"sikisek",
"sikisen",
"sikish",
"sikismis",
"sikiş",
"sikişen",
"sikişme",
"sikitiin",
"sikiyim",
"sikiym",
"sikiyorum",
"sikkim",
"sikko",
"sikleri",
"sikleriii",
"sikli",
"sikm",
"sikmek",
"sikmem",
"sikmiler",
"sikmisligim",
"siksem",
"sikseydin",
"sikseyidin",
"siksin",
"siksinbayav",
"siksinler",
"siksiz",
"siksok",
"siksz",
"sikt",
"sikti",
"siktigimin",
"siktigiminin",
"siktiğim",
"siktiğimin",
"siktiğiminin",
"siktii",
"siktiim",
"siktiimin",
"siktiiminin",
"siktiler",
"siktimv",
"siktim",
"siktimin",
"siktiminin",
"siktir",
"siktir et",
"siktirgit",
"siktir git",
"siktirir",
"siktiririm",
"siktiriyor",
"siktir lan",
"siktirolgit",
"siktir ol git",
"sittimin",
"sittir",
"skcem",
"skecem",
"skem",
"sker",
"skerim",
"skerm",
"skeyim",
"skiim",
"skik",
"skim",
"skime",
"skmek",
"sksin",
"sksn",
"sksz",
"sktiimin",
"sktrr",
"skyim",
"slaleni",
"sokam",
"sokarım",
"sokarim",
"sokarm",
"sokarmkoduumun",
"sokayım",
"sokaym",
"sokiim",
"soktuğumunun",
"sokuk",
"sokum",
"sokuş",
"sokuyum",
"soxum",
"sulaleni",
"sülaleni",
"sülalenizi",
"sürtük",
"şerefsiz",
"şıllık",
"taaklarn",
"taaklarna",
"tarrakimin",
"tasak",
"tassak",
"taşak",
"taşşak",
"tipini s.k",
"tipinizi s.keyim",
"tiyniyat",
"toplarm",
"topsun",
"totoş",
"vajina",
"vajinanı",
"veled",
"veledizina",
"veled i zina",
"verdiimin",
"weled",
"weledizina",
"whore",
"xikeyim",
"yaaraaa",
"yalama",
"yalarım",
"yalarun",
"yaraaam",
"yarak",
"yaraksız",
"yaraktr",
"yaram",
"yaraminbasi",
"yaramn",
"yararmorospunun",
"yarra",
"yarraaaa",
"yarraak",
"yarraam",
"yarraamı",
"yarragi",
"yarragimi",
"yarragina",
"yarragindan",
"yarragm",
"yarrağ",
"yarrağım",
"yarrağımı",
"yarraimin",
"yarrak",
"yarram",
"yarramin",
"yarraminbaşı",
"yarramn",
"yarran",
"yarrana",
"yarrrak",
"yavak",
"yavş",
"yavşak",
"yavşaktır",
"yavuşak",
"yılışık",
"yilisik",
"yogurtlayam",
"yoğurtlayam",
"yrrak",
"zıkkımım",
"zibidi",
"zigsin",
"zikeyim",
"zikiiim",
"zikiim",
"zikik",
"zikim",
"ziksiiin",
"ziksiin",
"zulliyetini",
"zviyetini","abaza","abazan","aq","ağzınasıçayım","ahmak","amarım","ambiti","ambiti","amcığı","amcığın","amcığını","amcığınızı","amcık","amcıkhoşafı","amcıklama","amcıklandı","amcik","amck","amckl","amcklama","amcklaryla","amckta","amcktan","amcuk","amık","amına","amınako","amınakoy","amınakoyarım","amınakoyayım","amınakoyim","amınakoyyim","amınas","amınasikem","amınasokam","amınferyadı","amını","amınıs","amınoglu","amınoğlu","amınoğli","amısına","amısını","amina","aminakoyarim","aminakoyayım","aminakoyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","aminoglu","amiyum","amk","amkafa","amkçocuğu","amlarnzn","amlı","amm","amna","amnda","amndaki","amngtn","amnn","amq","amsız","amsiz","amuna","ana","anaaann","anal","anan","anana","anandan","ananı","ananı","ananın","ananınam","ananınamı","ananındölü","ananınki","ananısikerim","ananısikerim","ananısikeyim","ananısikeyim","ananızın","ananızınam","anani","ananin","ananisikerim","ananisikerim","ananisikeyim","ananisikeyim","anann","ananz","anas","anasını","anasınınam","anasıorospu","anasi","anasinin","angut","anneni","annenin","annesiz","aptal","aq","a.q","a.q.","aq.","atkafası","atmık","avrat","babaannesikaşar","babanı","babanın","babani","babasıpezevenk","bacına","bacını","bacının","bacini","bacn","bacndan","bitch","bok","boka","bokbok","bokça","bokkkumu","boklar","boktan","boku","bokubokuna","bokum","bombok","boner","bosalmak","boşalmak","çük","dallama","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini","dinsiz","dkerim","domal","domalan","domaldı","domaldın","domalık","domalıyor","domalmak","domalmış","domalsın","domalt","domaltarak","domaltıp","domaltır","domaltırım","domaltip","domaltmak","dölü","eben","ebeni","ebenin","ebeninki","ecdadını","ecdadini","embesil","fahise","fahişe","feriştah","ferre","fuck","fucker","fuckin","fucking","gavad","gavat","geber","geberik","gebermek","gebermiş","gebertir","gerızekalı","gerizekalı","gerizekali","gerzek","gotlalesi","gotlu","gotten","gotundeki","gotunden","gotune","gotunu","gotveren","göt","götdeliği","götherif","götlalesi","götlek","götoğlanı","götoğlanı","götoş","götten","götü","götün","götüne","götünekoyim","götünekoyim","götünü","götveren","götveren","götverir","gtveren","hasiktir","hassikome","hassiktir","hassiktir","hassittir","ibine","ibinenin","ibne","ibnedir","ibneleri","ibnelik","ibnelri","ibneni","ibnenin","ibnesi","ipne","itoğluit","kahpe","kahpenin","kaka","kaltak","kancık","kancik","kappe","kavat","kavatn","kocagöt","koduğmunun","kodumun","kodumunun","koduumun","mal","malafat","malak","manyak","meme","memelerini","oc","ocuu","ocuun","0Ç","o.çocuğu","orosbucocuu","orospu","orospucocugu","orospuçoc","orospuçocuğu","orospuçocuğudur","orospuçocukları","orospudur","orospular","orospunun","orospununevladı","orospuydu","orospuyuz","orrospu","oruspu","oruspuçocuğu","oruspuçocuğu","osbir","öküz","penis","pezevek","pezeven","pezeveng","pezevengi","pezevenginevladı","pezevenk","pezo","pic","pici","picler","piç","piçinoğlu","piçkurusu","piçler","pipi","pisliktir","porno","pussy","puşt","puşttur","s1kerim","s1kerm","s1krm","sakso","salaak","salak","serefsiz","sexs","sıçarım","sıçtığım","sıkecem","sicarsin","sie","sik","sikdi","sikdiğim","sike","sikecem","sikem","siken","sikenin","siker","sikerim","sikerler","sikersin","sikertir","sikertmek","sikesen","sikey","sikeydim","sikeyim","sikeym","siki","sikicem","sikici","sikien","sikienler","sikiiim","sikiiimmm","sikiim","sikiir","sikiirken","sikik","sikil","sikildiini","sikilesice","sikilmi","sikilmie","sikilmis","sikilmiş","sikilsin","sikim","sikimde","sikimden","sikime","sikimi","sikimiin","sikimin","sikimle","sikimsonik","sikimtrak","sikin","sikinde","sikinden","sikine","sikini","sikip","sikis","sikisek","sikisen","sikish","sikismis","sikiş","sikişen","sikişme","sikitiin","sikiyim","sikiym","sikiyorum","sikkim","sikleri","sikleriii","sikli","sikm","sikmek","sikmem","sikmiler","sikmisligim","siksem","sikseydin","sikseyidin","siksin","siksinler","siksiz","siksok","siksz","sikti","siktigimin","siktigiminin","siktiğim","siktiğimin","siktiğiminin","siktii","siktiim","siktiimin","siktiiminin","siktiler","siktim","siktimin","siktiminin","siktir","siktiret","siktirgit","siktirgit","siktirir","siktiririm","siktiriyor","siktirlan","siktirolgit","sittimin","skcem","skecem","skem","sker","skerim","skerm","skeyim","skiim","skik","skim","skime","skmek","sksin","sksn","sksz","sktiimin","sktrr","skyim","slaleni","sokam","sokarım","sokarim","sokarm","sokarmkoduumun","sokayım","sokaym","sokiim","soktuğumunun","sokuk","sokum","sokuş","sokuyum","soxum","sulaleni","sülalenizi","tasak","tassak","taşak","taşşak","s.k","s.keyim","vajina","vajinanı","xikeyim","yaaraaa","yalarım","yalarun","orospi","orospinin","orospının","orospı","yaraaam","yarak","yaraksız","yaraktr","yaram","yaraminbasi","yaramn","yararmorospunun","yarra","yarraaaa","yarraak","yarraam","yarraamı","yarragi","yarragimi","yarragina","yarragindan","yarragm","yarrağ","yarrağım","yarrağımı","yarraimin","yarrak","yarram","yarramin","yarraminbaşı","yarramn","yarran","yarrana","yarrrak","yavak","yavş","yavşak","yavşaktır","yrrak","zigsin","zikeyim","zikiiim","zikiim","zikik","zikim","ziksiin","ağzına","mk","amcık","amcıkağız","amcıkları","amık","amın","amına","amınakoyim","amınoğlu","amina","amini","amk","amq","anan","ananı","ananızı","ananizi","aminizi","aminii","avradını","avradini","anasını","b.k","bok","boktan","boşluk","dalyarak","dasak","dassak","daşak","daşşak","daşşaksız","durum","ensest","erotik","fahişe","fuck","g*t","g*tü","g*tün","g*tüne","g.t","gavat","gay","gerızekalıdır","gerizekalı","gerizekalıdır","got","gotunu","gotuze","göt","götü","götüne","götünü","götünüze","götüyle","götveren","götvern","guat","hasiktir","hasiktr","hastir","i.ne","ibne","ibneler","ibneliği","ipne","ipneler","it","iti","itler","kavat","kıç","kıro","kromusunuz","kromusunuz","lezle","lezler","nah","o.ç","oç.","okuz","orosbu","orospu","orospucocugu","orospular","otusbir","otuzbir","öküz","penis","pezevenk","pezevenkler","pezo","pic","piç","piçi","piçinin","piçler","pis","pok","pokunu","porn","porno","puşt","sex","s.tir","sakso","salak","sanane","sanane","sçkik","seks","serefsiz","serefsz","serefszler","sex","sıçmak","sıkerım","sıkm","sıktır","si.çmak","sicmak","sicti","sik","sikenin","siker","sikerim","sikerler","sikert","sikertirler","sikertmek","sikeyim","sikicem","sikiim","sikik","sikim","sikime","sikimi","sikiş","sikişken","sikişmek","sikm","sikmeyi","siksinler","siktiğim","siktimin","siktin","siktirgit","siktir","siktirgit","siktirsin","siqem","skiym","skm","skrm","sktim","sktir","sktirsin","sktr","sktroradan","sktrsn","snane","sokacak","sokarim","sokayım","sülaleni","şerefsiz","şerefsizler","şerefsizlerin","şerefsizlik","tasak","tassak","taşak","taşşak","travesti","yarak","yark","yarrağım","yarrak","yarramın","yarrk","yavşak","yrak","yrk","ebenin","ezik","o.ç.","orospu","öküz","pezevenk","piç","puşt","salak","salak","serefsiz","sik","sperm","bok","aq","a.q.","amk","amına","ebenin","ezik","fahişe","gavat","gavurundölü","gerizekalı","göte","götü","götüne","götünü","lan","mal","o.ç.","orospu","pezevenk","piç","puşt","salak","salak","serefsiz","sik","sikkırığı","sikerler","sikertmek","sikik","sikilmiş","siktir","sperm","taşak","totoş","yarak","yarrak","bok","aq","a.q.","amk","ebenin","fahişe","gavat","gerizakalı","gerizekalı","göt","göte","götü","götüne","götsün","piçsin","götsünüz","piçsiniz","götünüze","kıçınız","kıçınıza","götünü","hayvan","ibne","ipne","kahpe","kaltak","lan","mal","o.c","oc","manyak","o.ç.","oç","orospu","öküz","pezevenk","piç","puşt","salak","serefsiz","sik","sikkırığı","sikerler","sikertmek","sikik","sikiim","siktim","siki","sikilmiş","siktir","siktir","sperm","şerefsiz","taşak","totoş","yarak","yarrak","yosma","aq","a.q.","amk","amına","amınakoyim","amina","ammına","amna","sikim","sikiym","sikeyim","siktr","kodumun","amık","sikem","sikim","sikiym","s.iktm","s.ikerim","s.ktir","amg","am.k","a.mk","amık","rakı","rak","oruspu","oc","ananın","ananınki","bacının","bacını","babanın","sike","skim","skem","amcık","şerefsiz","piç","piçinoğlu","amcıkhoşafı","amınasokam","amkçocuğu","amınferyadı","amınoglu","piçler","sikerim","sikeyim","siktiğim","siktiğimin","amını","amına","amınoğlu","amk","ipne","ibne","serefsiz","şerefsiz","piç","piçkurusu","götün","götoş","yarrak","amcik","sıçarım","sıçtığım","aq","a.q","a.q.","aq.","a.g.","ag.","amınak","aminak","amınag","aminag","amınıs","amınas","ananı","babanı","anani","babani","bacını","bacini","ecdadını","ecdadini","sikeyim","sulaleni","sülaleni","dallama","dangalak","aptal","salak","gerızekalı","gerizekali","öküz","angut","dalyarak","sikiyim","sikeyim","götüne","götünü","siktirgit","siktirgit","siktirolgit","siktirolgit","siktir","hasiktir","hassiktir","hassiktir","dalyarak","dalyarrak","kancık","kancik","kaltak","orospu","oruspu","fahişe","fahise","pezevenk","pezo","kocagöt","ambiti","götünekoyim","götünekoyim","amınakoyim","aminakoyim","amınak","aminakoyayım","aminakoyayim","amınakoyarım","aminakoyarim","aminakoyarim","ananısikeyim","ananisikeyim","ananısikeyim","ananisikeyim","ananisikerim","ananısikerim","ananisikerim","ananısikerim","orospucocugu","oruspucocu","amk","amq","sikik","götveren","götveren","amınoğlu","aminoglu","amınoglu","gavat","kavat","anneni","annenin","ananın","ananin","dalyarak","sikik","amcık","siktir","piç","pic","sie","yarram","göt","meme","dildo","skcem","skerm","skerim","skecem","orrospu","annesiz","kahpe","kappe","yarak","yaram","dalaksız","yaraksız","amlı","s1kerim","s1kerm","s1krm","sikim","orospuçocukları", "oç","abaza","abazan","aq","ağzınasıçayım","ahmak","amarım","ambiti","ambiti","amcığı","amcığın","amcığını","amcığınızı","amcık","amcıkhoşafı","amcıklama","amcıklandı","amcik","amck","amckl","amcklama","amcklaryla","amckta","amcktan","amcuk","amık","amına","amınako","amınakoy","amınakoyarım","amınakoyayım","amınakoyim","amınakoyyim","amınas","amınasikem","amınasokam","amınferyadı","amını","amınıs","amınoglu","amınoğlu","amınoğli","amısına","amısını","amina","aminakoyarim","aminakoyayım","aminakoyayim","aminakoyim","aminda","amindan","amindayken","amini","aminiyarraaniskiim","aminoglu","aminoglu","amiyum","amk","amkafa","amkçocuğu","amlarnzn","amlı","amm","amna","amnda","amndaki","amngtn","amnn","amq","amsız","amsiz","amuna","ana","anaaann","anal","anan","anana","anandan","ananı","ananı","ananın","ananınam","ananınamı","ananındölü","ananınki","ananısikerim","ananısikerim","ananısikeyim","ananısikeyim","ananızın","ananızınam","anani","ananin","ananisikerim","ananisikerim","ananisikeyim","ananisikeyim","anann","ananz","anas","anasını","anasınınam","anasıorospu","anasi","anasinin","angut","anneni","annenin","annesiz","aptal","aq","a.q","a.q.","aq.","atkafası","atmık","avrat","babaannesikaşar","babanı","babanın","babani","babasıpezevenk","bacına","bacını","bacının","bacini","bacn","bacndan","bitch","bok","boka","bokbok","bokça","bokkkumu","boklar","boktan","boku","bokubokuna","bokum","bombok","boner","bosalmak","boşalmak","çük","dallama","daltassak","dalyarak","dalyarrak","dangalak","dassagi","diktim","dildo","dingil","dingilini","dinsiz","dkerim","domal","domalan","domaldı","domaldın","domalık","domalıyor","domalmak","domalmış","domalsın","domalt","domaltarak","domaltıp","domaltır","domaltırım","domaltip","domaltmak","dölü","eben","ebeni","ebenin","ebeninki","ecdadını","ecdadini","embesil","fahise","fahişe","feriştah","ferre","fuck","fucker","fuckin","fucking","gavad","gavat","geber","geberik","gebermek","gebermiş","gebertir","gerızekalı","gerizekalı","gerizekali","gerzek","gotlalesi","gotlu","gotten","gotundeki","gotunden","gotune","gotunu","gotveren","göt","götdeliği","götherif","götlalesi","götlek","götoğlanı","götoğlanı","götoş","götten","götü","götün","götüne","götünekoyim","götünekoyim","götünü","götveren","götveren","götverir","gtveren","hasiktir","hassikome","hassiktir","hassiktir","hassittir","ibine","ibinenin","ibne","ibnedir","ibneleri","ibnelik","ibnelri","ibneni","ibnenin","ibnesi","ipne","itoğluit","kahpe","kahpenin","kaka","kaltak","kancık","kancik","kappe","kavat","kavatn","kocagöt","koduğmunun","kodumun","kodumunun","koduumun","mal","malafat","malak","manyak","meme","memelerini","oc","ocuu","ocuun","0Ç","o.çocuğu","orosbucocuu","orospu","orospucocugu","orospuçoc","orospuçocuğu","orospuçocuğudur","orospuçocukları","orospudur","orospular","orospunun","orospununevladı","orospuydu","orospuyuz","orrospu","oruspu","oruspuçocuğu","oruspuçocuğu","osbir","öküz","penis","pezevek","pezeven","pezeveng","pezevengi","pezevenginevladı","pezevenk","pezo","pic","pici","picler","piç","piçinoğlu","piçkurusu","piçler","pipi","pisliktir","porno","pussy","puşt","puşttur","s1kerim","s1kerm","s1krm","sakso","salaak","salak","serefsiz","sexs","sıçarım","sıçtığım","sıkecem","sicarsin","sie","sik","sikdi","sikdiğim","sike","sikecem","sikem","siken","sikenin","siker","sikerim","sikerler","sikersin","sikertir","sikertmek","sikesen","sikey","sikeydim","sikeyim","sikeym","siki","sikicem","sikici","sikien","sikienler","sikiiim","sikiiimmm","sikiim","sikiir","sikiirken","sikik","sikil","sikildiini","sikilesice","sikilmi","sikilmie","sikilmis","sikilmiş","sikilsin","sikim","sikimde","sikimden","sikime","sikimi","sikimiin","sikimin","sikimle","sikimsonik","sikimtrak","sikin","sikinde","sikinden","sikine","sikini","sikip","sikis","sikisek","sikisen","sikish","sikismis","sikiş","sikişen","sikişme","sikitiin","sikiyim","sikiym","sikiyorum","sikkim","sikleri","sikleriii","sikli","sikm","sikmek","sikmem","sikmiler","sikmisligim","siksem","sikseydin","sikseyidin","siksin","siksinler","siksiz","siksok","siksz","sikti","siktigimin","siktigiminin","siktiğim","siktiğimin","siktiğiminin","siktii","siktiim","siktiimin","siktiiminin","siktiler","siktim","siktimin","siktiminin","siktir","siktiret","siktirgit","siktirgit","siktirir","siktiririm","siktiriyor","siktirlan","siktirolgit","sittimin","skcem","skecem","skem","sker","skerim","skerm","skeyim","skiim","skik","skim","skime","skmek","sksin","sksn","sksz","sktiimin","sktrr","skyim","slaleni","sokam","sokarım","sokarim","sokarm","sokarmkoduumun","sokayım","sokaym","sokiim","soktuğumunun","sokuk","sokum","sokuş","sokuyum","soxum","sulaleni","sülalenizi","tasak","tassak","taşak","taşşak","s.k","s.keyim","vajina","vajinanı","xikeyim","yaaraaa","yalarım","yalarun","orospi","orospinin","orospının","orospı","yaraaam","yarak","yaraksız","yaraktr","yaram","yaraminbasi","yaramn","yararmorospunun","yarra","yarraaaa","yarraak","yarraam","yarraamı","yarragi","yarragimi","yarragina","yarragindan","yarragm","yarrağ","yarrağım","yarrağımı","yarraimin","yarrak","yarram","yarramin","yarraminbaşı","yarramn","yarran","yarrana","yarrrak","yavak","yavş","yavşak","yavşaktır","yrrak","zigsin","zikeyim","zikiiim","zikiim","zikik","zikim","ziksiin","ağzına","mk","amcık","amcıkağız","amcıkları","amık","amın","amına","amınakoyim","amınoğlu","amina","amini","amk","amq","anan","ananı","ananızı","ananizi","aminizi","aminii","avradını","avradini","anasını","b.k","bok","boktan","boşluk","dalyarak","dasak","dassak","daşak","daşşak","daşşaksız","durum","ensest","erotik","fahişe","fuck","g*t","g*tü","g*tün","g*tüne","g.t","gavat","gay","gerızekalıdır","gerizekalı","gerizekalıdır","got","gotunu","gotuze","göt","götü","götüne","götünü","götünüze","götüyle","götveren","götvern","guat","hasiktir","hasiktr","hastir","i.ne","ibne","ibneler","ibneliği","ipne","ipneler","it","iti","itler","kavat","kıç","kıro","kromusunuz","kromusunuz","lezle","lezler","nah","o.ç","oç.","okuz","orosbu","orospu","orospucocugu","orospular","otusbir","otuzbir","öküz","penis","pezevenk","pezevenkler","pezo","pic","piç","piçi","piçinin","piçler","pis","pok","pokunu","porn","porno","puşt","sex","s.tir","sakso","salak","sanane","sanane","sçkik","seks","serefsiz","serefsz","serefszler","sex","sıçmak","sıkerım","sıkm","sıktır","si.çmak","sicmak","sicti","sik","sikenin","siker","sikerim","sikerler","sikert","sikertirler","sikertmek","sikeyim","sikicem","sikiim","sikik","sikim","sikime","sikimi","sikiş","sikişken","sikişmek","sikm","sikmeyi","siksinler","siktiğim","siktimin","siktin","siktirgit","siktir","siktirgit","siktirsin","siqem","skiym","skm","skrm","sktim","sktir","sktirsin","sktr","sktroradan","sktrsn","snane","sokacak","sokarim","sokayım","sülaleni","şerefsiz","şerefsizler","şerefsizlerin","şerefsizlik","tasak","tassak","taşak","taşşak","travesti","yarak","yark","yarrağım","yarrak","yarramın","yarrk","yavşak","yrak","yrk","ebenin","ezik","o.ç.","orospu","öküz","pezevenk","piç","puşt","salak","salak","serefsiz","sik","sperm","bok","aq","a.q.","amk","amına","ebenin","ezik","fahişe","gavat","gavurundölü","gerizekalı","göte","götü","götüne","götünü","lan","mal","o.ç.","orospu","pezevenk","piç","puşt","salak","salak","serefsiz","sik","sikkırığı","sikerler","sikertmek","sikik","sikilmiş","siktir","sperm","taşak","totoş","yarak","yarrak","bok","aq","a.q.","amk","ebenin","fahişe","gavat","gerizakalı","gerizekalı","göt","göte","götü","götüne","götsün","piçsin","götsünüz","piçsiniz","götünüze","kıçınız","kıçınıza","götünü","hayvan","ibne","ipne","kahpe","kaltak","lan","mal","o.c","oc","manyak","o.ç.","oç","orospu","öküz","pezevenk","piç","puşt","salak","serefsiz","sik","sikkırığı","sikerler","sikertmek","sikik","sikiim","siktim","siki","sikilmiş","siktir","siktir","sperm","şerefsiz","taşak","totoş","yarak","yarrak","yosma","aq","a.q.","amk","amına","amınakoyim","amina","ammına","amna","sikim","sikiym","sikeyim","siktr","kodumun","amık","sikem","sikim","sikiym","s.iktm","s.ikerim","s.ktir","amg","am.k","a.mk","amık","rakı","rak","oruspu","oc","ananın","ananınki","bacının","bacını","babanın","sike","skim","skem","amcık","şerefsiz","piç","piçinoğlu","amcıkhoşafı","amınasokam","amkçocuğu","amınferyadı","amınoglu","piçler","sikerim","sikeyim","siktiğim","siktiğimin","amını","amına","amınoğlu","amk","ipne","ibne","serefsiz","şerefsiz","piç","piçkurusu","götün","götoş","yarrak","amcik","sıçarım","sıçtığım","aq","a.q","a.q.","aq.","a.g.","ag.","amınak","aminak","amınag","aminag","amınıs","amınas","ananı","babanı","anani","babani","bacını","bacini","ecdadını","ecdadini","sikeyim","sulaleni","sülaleni","dallama","dangalak","aptal","salak","gerızekalı","gerizekali","öküz","angut","dalyarak","sikiyim","sikeyim","götüne","götünü","siktirgit","siktirgit","siktirolgit","siktirolgit","siktir","hasiktir","hassiktir","hassiktir","dalyarak","dalyarrak","kancık","kancik","kaltak","orospu","oruspu","fahişe","fahise","pezevenk","pezo","kocagöt","ambiti","götünekoyim","götünekoyim","amınakoyim","aminakoyim","amınak","aminakoyayım","aminakoyayim","amınakoyarım","aminakoyarim","aminakoyarim","ananısikeyim","ananisikeyim","ananısikeyim","ananisikeyim","ananisikerim","ananısikerim","ananisikerim","ananısikerim","orospucocugu","oruspucocu","amk","amq","sikik","götveren","götveren","amınoğlu","aminoglu","amınoglu","gavat","kavat","anneni","annenin","ananın","ananin","dalyarak","sikik","amcık","siktir","piç","pic","sie","yarram","göt","meme","dildo","skcem","skerm","skerim","skecem","orrospu","annesiz","kahpe","kappe","yarak","yaram","dalaksız","yaraksız","amlı","s1kerim","s1kerm","s1krm","sikim","orospuçocukları", "oç",    
"aaq","amk","a.m.k","a.m","m.k","mk","orosbu çocugu","orospu çocugu","o.ç","oç","oc","o.c","orosbu","orospu","veledi zina","sikerim","sıkerım","s.i.k.e.r.i.m","s.ı.k.e.r.ı.m","piç","pıc","p.i.ç","p.ı.c","orosbu evladı","orospu evladı","amına koyayım","babanı sikim","fuck", "FUCK", "SHIT", "shit", "PORN", "porn", "xnxx", "XNXX","amk","aq","sik","siktir","a q","a mk","oç","oruspu","orusbu","anan","sikerler","sikerim","s1kerler","s1kerim","s1ker1m","wtf","AMK","AQ","ORUSBU","ORUSPU","SİKERLER","GAY","GÖT","ANAN","PORNHUB.COM","pornhub.com","brazzers","BRAZZERS","ANANI","ananı","ananı sikerim","ananı sik","anamı sik","ANANI SİK","ANANI SİKERİM","şerefsiz","Şerefsiz","ŞEREFSİZ","orospu","orospu çocuğu","OC","Piç","PİÇ","yavşak","YAVŞAK","ibne","ipne","İBNE","İPNE","amına korum","pi.ç","piç"];
    if (kufur.some(word => msg.content.includes(word))) {
      try {
        if (!msg.member.permissions.has("BAN_MEMBERS")) {
          msg.delete();

          return msg
            .reply("Yakaladım Seni! Küfür Yasak.")
            .then(wiskyx => wiskyx.delete({ timeout: 5000 }));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

//reklam-engel

client.on("message", msg => {
  if (!msg.guild) return
  const veri = db.fetch(`${msg.guild.id}.reklam`);
  if (veri) {
    const reklam = [
      ".com",
      ".net",
      ".xyz",
      ".tk",
      ".pw",
      ".io",
      ".me",
      ".gg",
      "www.",
      "https",
      "http",
      ".gl",
      ".org",
      ".com.tr",
      ".biz",
      "net",
      ".rf.gd",
      ".az",
      ".party",
      ".tv",
      "discord.gg",
      "youtube.com"
    ];
    if (reklam.some(word => msg.content.includes(word))) {
      try {
        if (!msg.member.permissions.has("BAN_MEMBERS")) {
          msg.delete();
          return msg
            .reply("Yakaladım Seni! Reklam Yasak.")
            .then(wiskyx => wiskyx.delete({ timeout: 5000 }));
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!veri) return;
});

//everyone engel

client.on("message", async msg => {
  if (!msg.guild) return
  let hereengelle = await db.fetch(`hereengel_${msg.guild.id}`);
  if (hereengelle == "acik") {
    const here = ["@here", "@everyone"];
    if (here.some(word => msg.content.toLowerCase().includes(word))) {
      if (!msg.member.permissions.has("ADMINISTRATOR")) {
        msg.delete();
        return msg
          .reply("Yakaladım Seni! Everyone ve Here Etiketlemek Yasak.")
          .then(wiskyx => wiskyx.delete({ timeout: 5000 }));
      }
    }
  } else if (hereengelle == "kapali") {
  }
});

const twitchs = {};

client.on("ready", async () => {
  
  setInterval(async () => {
   client.guilds.cache.forEach(async guild => {
     if(twitchs[guild.id]) return;
     
     let data = await db.get(`twitch.${guild.id}`) || { channel: null, name: null };
     if(!data.channel) return;
     if(!data.name) return;
    
     fetch(`https://api.twitch.tv/helix/streams?user_login=${data.name}`, { 
     method: "GET",
     headers: { "client-id": ayarlar.twitch_client_id, "Authorization": `Bearer ${ayarlar.twitch_token}` }
     }).then(response => response.json().then(res => {
     if(!res.data.length) return;
       
     const channel = guild.channels.cache.get(data.channel);

     if(!channel) return;
       
      const username = res.data[0].user_name;
      const userlogin = res.data[0].user_login;
      const game = res.data[0].game_name;
      const title = res.data[0].title;
      const viewer_count = res.data[0].viewer_count;
      const thumbnail = res.data[0].thumbnail_url.replace("{width}", 500).replace("{height}", 250); 
      
       const embed = new Discord.MessageEmbed()
       .setAuthor(username)
       .setImage(thumbnail)
       .setTitle(title)
       .addField(`Game`, game, true)
       .addField(`Viewers`, viewer_count, true)
       .setColor("PURPLE")
       .setURL("https://twitch.tv/ReliveF");
       
      twitchs[guild.id] = true;
       
       return channel.send(embed);
     }))
     })
  }, 5000);
})

//mod-log

const botadi = "RELİVEF"

client.on('messageDelete', message => {
let modlogs =  db.get(`modlogkanaly_${message.guild.id}`)
  const modlogkanal = message.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    if (message.content.length > 1024) {
      modlogkanal.send({embed: {
    Color: "#080000",
    author: {
      name: `${message.author.tag} tarafından gönderilen bir mesaj silindi`,
      icon_url: message.author.displayAvatarURL({dynamic: true})},
    fields: [{
        name: `Silinen mesaj 1024 karakterden fazla mesajı gösteremem`,
        value: `\`\`\`Bilinmiyor...\`\`\``}],
    timestamp: new Date(),
    footer: {
      icon_url: message.author.displayAvatarURL({dynamic: true}),
      text: `RELİVEF | Mod-Log `
    }
  }
});
    } else {
      modlogkanal.send({embed: {
    Color: "#080000",
    author: {
      name: `${message.author.tag} kullanıcısının mesajı silindi\n`,
      icon_url: message.author.displayAvatarURL({dynamic: true})},
    fields: [{
        name: `Silinen mesaj:`,
        value: "```" + message.content + "```"}],
    timestamp: new Date(),
    footer: {
      icon_url: message.author.displayAvatarURL({dynamic: true}),
      text: `RELİVEF | Mod-Log `}
  }
});
    }
  }
})



client.on('guildBanAdd', async (guild, user) => {
  let modlogs = db.get(`modlogkanaly_${guild.id}`)
  const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#080000")
    .setAuthor("Bir kişi sunucudan yasaklandı")
    .setThumbnail(user.avatarURL({dynamic: true})||user.defaultAvatarURL())
    .addField(`Yasaklanan kişi`, `\`\`\` ${user.tag} \`\`\` `)
    .setFooter(`RELİVEF | Mod-Log `)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});


client.on('guildBanRemove', async (guild, user) => {
 let modlogs = db.get(`modlogkanaly_${guild.id}`)
  const modlogkanal = guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    let embed = new Discord.MessageEmbed()
    .setColor("#080000")
    .setAuthor("Bir kişinin yasağı kaldırıldı")
    .setThumbnail(user.avatarURL({dynamic: true})||user.defaultAvatarURL())
    .addField(`Yasağı kaldırılan kişi`, `\`\`\` ${user.tag} \`\`\` `)
    .setFooter(`RELİVEF | Mod-Log `)
    .setTimestamp()
    modlogkanal.send(embed)
  }
});


client.on('channelCreate', async channel => {
  if (!channel.guild) return
 let modlogs = db.get(`modlogkanal_${channel.guild.id}`)
  const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    if (channel.type === "text") {
      modlogkanal.send({embed: {
      Color: "#080000",
      fields: [{
          name: `Bir Kanal Oluşturuldu. \nOluşturulan Kanalin İsmi:`,
          value: `\`\`\` ${channel.name} \`\`\``
        },
        {
          name: `Oluşturulan Kanalin Türü`,
          value: `\`\`\` Metin Kanalı \`\`\``
        }
      ],
      timestamp: new Date(),
      footer: {
        text: `RELİVEF | Mod-Log `
      }
     }});
    } else {
      if (channel.type === "voice") {
       modlogkanal.send({embed: {
    Color: "#080000",
    fields: [{
        name: `Bir Kanal Oluşturuldu. \nOluşturulan Kanalin İsmi:`,
        value: `\`\`\` ${channel.name} \`\`\``
      },
      {
        name: `Oluşturulan Kanalin Türü`,
        value: `\`\`\` Ses Kanalı \`\`\``
      }
    ],
    timestamp: new Date(),
    footer: {
      text: `RELİVEF | Mod-Log `
    }
  }
}); 
      }
    }
  }
});

client.on('channelDelete', async channel => {
  if (!channel.guild) return
 let modlogs = db.get(`modlogkanaly_${channel.guild.id}`)
  const modlogkanal = channel.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    if (channel.type === "text") {
      modlogkanal.send({embed: {
     Color: "#080000",
    fields: [{
        name: `Bir Kanal Silindi. \nSilinen Kanalin İsmi:`,
        value: `\`\`\` ${channel.name} \`\`\``
      },
      {
        name: `Silinen Kanalin Türü`,
        value: `\`\`\` Metin Kanalı \`\`\``
      }
      ],
      timestamp: new Date(),
      footer: {
        text: `RELİVEF | Mod-Log `
      }
     }});
    } else {
      if (channel.type === "voice") {
       modlogkanal.send({embed: {
 Color: "#080000",
    fields: [{
        name: `Bir Kanal Silindi. \nSilinen Kanalin İsmi:`,
        value: `\`\`\` ${channel.name} \`\`\``
      },
      {
        name: `Silinen Kanalin Türü`,
        value: `\`\`\` Ses Kanalı \`\`\``
      }
    ],
    timestamp: new Date(),
    footer: {
      text: `RELİVEF | Mod-Log`
    }
  }
}); 
      }
    }
  }
});

client.on('roleDelete', async role => {
  if (!role.guild) return
 let modlogs =  db.get(`modlogkanaly_${role.guild.id}`)
  const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    modlogkanal.send({embed: {
    Color: "#080000",
    fields: [{
        name: `Bir Rol Silindi. \nSilinen Rolun İsmi:`,
        value: `\`\`\` ${role.name} \`\`\``
      }
    ],
    timestamp: new Date(),
    footer: {
      text: `RELİVEF | Mod-Log `
    }
  }
});
  }
});

client.on('emojiDelete', async emoji => {
  if (!emoji.guild) return
   let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`)
  const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    modlogkanal.send({embed: {
    Color: "#080000",
    fields: [{
        name: `Bir Emoji Silindi. \nSilinen Emojinin İsmi:`,
        value: `\`\`\` ${emoji.name} \`\`\``
      }
    ],
    timestamp: new Date(),
    footer: {
      text: `RELİVEF | Mod-Log `
    }
  }
});
  
  }
});


client.on('roleCreate', async role => {
  if (!role.guild) return
let modlogs =  db.get(`modlogkanaly_${role.guild.id}`)
  const modlogkanal = role.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
     modlogkanal.send({embed: {
    Color: "#080000",
    fields: [{
        name: `Yeni Bir Rol Oluşturuldu. \nOluşturulan Rolun İsmi:`,
        value: `\`\`\` ${role.name} \`\`\``
      }
    ],
    timestamp: new Date(),
    footer: {
      text: `RELİVEF | Mod-Log `
    }
  }
});
  }
});


client.on('messageUpdate', async (oldMessage, newMessage) => {
 let modlogs = db.get(`modlogkanaly_${oldMessage.guild.id}`)
  const modlogkanal = oldMessage.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    if (oldMessage.author.bot) {
        return false;
    }

    if (!oldMessage.guild) {
        return false;
    }

    if (oldMessage.content == newMessage.content) {
        return false;
    }
    modlogkanal.send({embed: {
      Color: "#080000",
      author: {
      name: `${oldMessage.author.tag} mesajını düzenledi:\n`,
      icon_url: oldMessage.author.displayAvatarURL({dynamic: true})
      },
      fields: [{
        name: `Eski mesaj:`,
        value: `\`\`\` ${oldMessage.content} \`\`\``
      },
      {
        name: `Yeni Mesaj:`,
        value: `\`\`\` ${newMessage.content} \`\`\``
      }
      ],
      timestamp: new Date(),
      footer: {
      icon_url: oldMessage.author.displayAvatarURL({dynamic: true}),
      text: `RELİVEF | Mod-Log`

      }
    }
    });
  }
});


client.on('emojiCreate', async emoji => {
  if (!emoji.guild) return
 let modlogs = db.get(`modlogkanaly_${emoji.guild.id}`)
  const modlogkanal = emoji.guild.channels.cache.find(kanal => kanal.id === modlogs);
  if(!modlogs) return;
  if(modlogs) {
    modlogkanal.send({embed: {
    Color: "#080000",
    fields: [{
        name: `Bir emoji eklendi. \nEklenen Emojinin İsmi:`,
        value: `\`\`\` ${emoji.name} \`\`\``
      }
    ],
    timestamp: new Date(),
    footer: {
      text: `RELİVEF | Mod-Log`
    } 
   } 
});
  }
});


//twitch post son

client.login(ayarlar.token)
