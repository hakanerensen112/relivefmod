const prefix = "!"
exports.run = async (client, message, level) => {
    if (!message.content.startsWith(prefix)) return;

    message.channel.send('**OH ÇEK ÇEK CİĞERLERİN BAYRAM ETSİN**').then(async msg => {
        setTimeout(() => {
            msg.edit('🚬');
        }, 500);
        setTimeout(() => {
            msg.edit('🚬 ☁');
        }, 1000);
        setTimeout(() => {
            msg.edit('🚬 ☁☁');
        }, 1500);
        setTimeout(() => {
            msg.edit('🚬 ☁☁☁');
        }, 2000);
        setTimeout(() => {
            msg.edit('🚬 ☁☁');
        }, 2500);
        setTimeout(() => {
            msg.edit('🚬 ☁');
        }, 3000);
        setTimeout(() => {
            msg.edit('🚬');
        }, 3500);
        setTimeout(() => {
            msg.edit(`Cigara Başarıyla içildi`);
        }, 4000);
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "sigara",
    description: "Smoke everyday. :D",
    usage: "sigara"
};