const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NTkxNjU5NzM0OTY1MTU3OTEx.XQ0Apw.f4L3-ebHrPup-FZzFZTuJhEmZBM';

const PREFIX = '!';
const version = '1.0.0';

bot.on('ready', () =>{
        console.log('This bot is online')
        bot.user.setActivity('Just scrubbing.', {type: 'PLAYING'});
});

//---COMMANDS---
bot.on('message', message=>
{
    let args = message.content.toLocaleLowerCase().substring(PREFIX.length).split(" ");

    switch (args[0])
    {
        //Simple Commands
        case 'dude':
            message.channel.sendMessage('mellest')
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
                    break
                case 1:
                    message.channel.sendMessage(message.author.username + " GETS FUKD")
                    break
                case 2:
                    message.channel.sendMessage(message.author.username + " GETS FUKD")
                    break
                case 3:
                    message.channel.sendMessage(messsage.author.username + " GETS FUKD")
                    break
                case 4:
                    message.channel.sendMessage(message.author.username + " GETS FUKD")
                    break
                case 5:
                    message.channel.sendMessage(message.author.username + " GETS FUKD")
                    break
            }
    }
})


bot.login(token);