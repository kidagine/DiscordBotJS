const {Client, Attachment} = require('discord.js');
const bot = new Client();

const token = 'NTkxNjU5NzM0OTY1MTU3OTEx.XQ0Apw.f4L3-ebHrPup-FZzFZTuJhEmZBM';

const PREFIX = '!';
const version = '1.1.0';

//---START UP---
bot.on('ready', () =>{
    console.log('This bot is online')
    bot.user.setActivity('Just scrubbing.', {type: 'PLAYING'});
});

bot.on('guildMemberAdd', member =>{
    const channel = member.guild.channels.find(channel => channel.name === "nonsense")
    if (!channel)
    {
        return;
    }
    else
    {
        channel.send(`Welcome to the server u scrub, ${member}, ur a huge scrub!`)
    }
});

//Read custom emojis
var fs = require("fs");
var customEmojisText = fs.readFileSync("./customEmojis.txt").toString('utf-8');
var customEmojisList = customEmojisText.split("\n");

function getEmoji (emojiID)
{
    return bot.emojis.get(emojiID).toString();
}

//---COMMANDS---
bot.on('message', message=>
{
    let args = message.content.toLocaleLowerCase().substring(PREFIX.length).split(" ");

    switch (args[0])
    {
        //Simple Commands
        case 'dude':
            message.channel.send(getEmoji(customEmojisList[0]));
            break;
        case "hali":  
            message.channel.send("SUPER BESTEST HALI EVER❤️❤️❤️");
            break; 
        //Date Commands
        case "date":
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            message.channel.sendMessage(date)
            break;
        //intermediate Commands
        case 'info':
            if (args[1] === 'version')
            {
                message.channel.sendMessage('Version ' + version)
            }
            else
            {
                message.channel.sendMessage('Be more specific scrub.')
            }
            break;
        //Embed Commands
        case 'embed':
            const embed = new Discord.RichEmbed()
            .addField('Scrub role', 'Captain')
            .addField('Scrub name', message.author.username)
            .setColor(0xE4007C)
            .setThumbnail(message.author.avatarURL)
            message.channel.sendEmbed(embed);
            break;

        //Random Commands
        case 'random':
            var random = Math.floor(Math.random() * 3)
            switch (random)
            {
                case 0:
                    message.channel.sendMessage('0')
                    break;
                case 1:
                    message.channel.sendMessage('1')
                    break;
                case 2:
                    message.channel.sendMessage('2')
                    break;
                case 3:
                    message.channel.sendMessage('3')
                    break;
            }
        case 'fight':
            var random = Math.floor(Math.random() * 5)
            switch (random)
            {
                case 0:
                    message.channel.sendMessage(message.author.username + " GETS FUKD")
                    break;
                case 1:
                    message.channel.sendMessage(message.author.username + " GETS FUKD")
                    break;
                case 2:
                    message.channel.sendMessage(message.author.username + " GETS FUKD")
                    break;
                case 3:
                    message.channel.sendMessage(messsage.author.username + " GETS FUKD")
                    break;
                case 4:
                    message.channel.sendMessage(message.author.username + " GETS FUKD")
                    break;
                case 5:
                    message.channel.sendMessage(message.author.username + " GETS FUKD")
                    break;
            }
        case 'cutes':
            var random = Math.floor(Math.random()* 11)
            switch (random)
            {
                case 0:
                    const foxImage00 = new Attachment ("https://i.redd.it/9vy19m3z2g421.png")
                    message.channel.send(foxImage00);
                    break;
                case 1:
                    const foxImage01 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748719054159915/image1.jpg")
                    message.channel.send(foxImage01);
                    break;
                case 2:
                    const foxImage02 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748719054159919/image3.jpg")
                    message.channel.send(foxImage02);
                    break;
                case 3:
                    const foxImage03 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748719628648450/image0.jpg")
                    message.channel.send(foxImage03);
                    break;
                case 4:
                    const foxImage04 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748719632842792/image2.jpg")
                    message.channel.send(foxImage04);
                    break;
                case 5:
                    const foxImage05 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748845629734927/image1.jpg")
                    message.channel.send(foxImage05);
                    break;
                case 6:
                    const foxImage06 = new Attachment ("https://media.discordapp.net/attachments/475644212273086484/591748846074200074/image3.jpg?width=469&height=468")
                    message.channel.send(foxImage06);
                    break;
                case 7:
                    const foxImage07 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748846649081887/image0.jpg")
                    message.channel.send(foxImage07);
                    break;
                case 8:
                    const foxImage08 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748847584280576/image2.jpg")
                    message.channel.send(foxImage08);
                    break;
                case 9:
                    const foxImage09 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748888688459779/image1.jpg")
                    message.channel.send(foxImage09);
                    break;
                case 10:
                    const foxImage10 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748888688459782/image0.jpg")
                    message.channel.send(foxImage10);
                    break;
                case 11:
                    const leopardImage01 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748844690341889/image4.jpg")
                    message.channel.send(leopardImage01);
                    break;
            }
    }
})

bot.login(process.env.BOT_TOKEN);
