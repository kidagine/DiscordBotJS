const {Client, Attachment} = require('discord.js');
const bot = new Client();

const fs = require("fs");
const botTokenText = fs.readFileSync("./botToken.txt").toString('utf-8');
const token = botTokenText;

const PREFIX = '!';
const version = '1.3.9';

const customCommandsFile = "./customCommands.json";
var customCommandsList = [];
var customCommandsData = JSON.parse(fs.readFileSync(customCommandsFile, "utf8"));

global.servers = {};
var server;
var musicConnection;
const YTDL = require('ytdl-core');  
const ytSearch = require('yt-search');
var musicQueue = [];;
var musicList = [];
var currentSong;

//---START UP---
bot.on('ready', () =>{
    console.log('This bot is online');

    //Load custom commands from JSON
        for (let i = 0; i < customCommandsData.length; i++)
        {
            var stringCustomCommand = JSON.stringify(customCommandsData[i]);
            var indexFirst = stringCustomCommand.indexOf(',');
            var indexSecond = stringCustomCommand.indexOf('}');
            var newCustomCommand = Object.create(CustomCommand);
            newCustomCommand.init(stringCustomCommand.substring(16, indexFirst-1), stringCustomCommand.substring(indexFirst+16, indexSecond-1));
            customCommandsList.push(newCustomCommand);
        }

    var random = Math.floor(Math.random() * 4);
    switch(random)
    {
        case 0:
            bot.user.setActivity("Call Of Scrubs 3", {type: "PLAYING"})
            break;
        case 1:
            bot.user.setActivity("Scrubbing along", {type: "STREAMING"})
            break;
        case 2:
            bot.user.setActivity("Scrubbing my ears", {type: "LISTENING"})
            break;
        case 3:
            bot.user.setActivity("Scrubs And Punishment", {type: "WATCHING"})
            break;
    }
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

bot.on('disconnect', () => console.log('This bot is offline'));
bot.on('reconnecting', () => message.channel.send("Reconnecting..."));

//Custom command object
var CustomCommand =
{
    init: function (commandName, commandText)
    {
        this.commandName = commandName;
        this.commandText = commandText;
    },

    getCommandName: function()
    {
        var name = this.commandName;
        return name;
    },

    getCommandText: function()
    {
        var text = this.commandText;
        return text;
    }
};

//Music command play
function Play(musicConnection, message)
{
    server = servers[message.guild.id];
    musicList.push(server.queue[0]);
    server.dipatcher = musicConnection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    isSongPlaying = true;
    server.dipatcher.on("end", function(){
        if (server.queue[0])
        {
            YTDL.getInfo(musicList[0], function(err, info){
                message.channel.send("Started playing: " + info.title);
            });
            server.queue.shift();
            isSongPlaying = false;
            Play(musicConnection, message);
        }
        else
        {
            musicConnection.disconnect();    
        }
    });
}

function Next(musicConnection, message)
{
    server.queue.shift();
    Play(musicConnection, message);
}

//---COMMANDS---
bot.on('message', message=>
{
    let args = message.content.toLocaleLowerCase().substring(PREFIX.length).split(" ");
    let argsNormalCase = message.content.substring(PREFIX.length).split(" ");

    if (message.member.roles.find(r => r.name === "Scrubzz"))
    {
        switch (args[0])
        {
            //Misc commands
            case 'avatar':
                message.reply(message.author.avatarURL);
                break;
            case 'delete':
                if (args[1])
                {
                    if (args[1].match(/^-{0,1}\d+$/))
                    {
                        if (parseInt(args[1]) <= 100)
                        {
                            message.channel.bulkDelete(parseInt(args[1]));
                            message.channel.send(`Deleted messages:  **${args[1]}** `)
                        }
                        else
                        {
                            message.channel.send('The numbeer of messages to delete has to be less than 100');
                        }
                    }
                    else
                    {
                        message.channel.send("You have to provide a rounded number");
                    }
                }
                break;
            //Info command
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
            //Date Commands
            case "date":
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    message.channel.sendMessage(date)
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
            //Music commands
            case 'music':
                if (args[1] === "join")
                {
                    if (message.member.voiceChannel)
                    {
                        if (!message.guild.voiceConnection)
                        {
                            if (!servers[message.guild.id])
                            {
                                servers[message.guild.id] = {queue: []}
                            }
                            message.member.voiceChannel.join()
                                .then(connection => {
                                    musicConnection = connection;
                                    message.reply("Joined the voice chat");
                                })
                        }
                        else
                        {
                            message.reply("I am already in a voice channel");
                        }
                    }
                    else
                    {
                        message.reply("You have to be in a voice channel.");
                    }
                }
                else if (args[1] === 'leave')
                {
                    if (message.guild.voiceConnection)
                    {
                        message.guild.voiceConnection.disconnect();
                    }
                    else
                    {
                        message.reply("I have to be in a voice channel");
                    }
                }
                else if (args[1] === 'play')
                {
                    if (args[2])
                    {
                        if (message.guild.voiceConnection)
                        {    
                            if (!musicQueue.includes(argsNormalCase[2]))
                            {         
                                var isSongAdded = false;
                                musicQueue.push(argsNormalCase[2]);
                                for (i = 0; i < musicQueue.length; i++)
                                {         
                                    if (musicQueue.length === 1)
                                    {
                                        currentSong = i; 
                                        YTDL.getInfo(argsNormalCase[2], function(err, info){
                                            var songName = info.title;
                                            message.channel.send(`Started playing: **${songName}** `)
                                            });
                                            const dipatcher = musicConnection.playStream(YTDL(argsNormalCase[2]))
                                        .on ("end", () => {
                                            YTDL.getInfo(musicQueue[currentSong + 1], function(err, info){
                                                var songName = info.title;
                                                message.channel.send(`Now playing: **${songName}** `);
                                            });
                                            const dipatcher = musicConnection.playStream(YTDL(musicQueue[currentSong + 1]));
                                            musicQueue.splice([currentSong], 1);
                                            musicList.splice([currentSong], 1);                                            })
                                        .on ("error", () => {
                                            console.error("Could not join the voice channel");
                                            });
                                    }
                                    else if (!isSongAdded)
                                    {
                                        isSongAdded = true;
                                        YTDL.getInfo(argsNormalCase[2], function(err, info){
                                            var songName = info.title;
                                            message.channel.send(`Added to list: **${songName}** `);
                                            });
                                    }
                                }
                                YTDL.getInfo(argsNormalCase[2], function(err, info){
                                var songName = info.title;
                                musicList.push(songName);
                                });
                            }
                            else
                            {
                                message.reply("This song is already in the list.");
                            }
                        }
                        else
                        {
                            message.reply("I have to be in a voice channel");
                        }
                    }
                    else
                    {
                        message.reply("You need to include a URL.");
                    }
                }   
                else if (args[1] === 'pause')
                {
                    const dipatcher = musicConnection.dipatcher.END
                }
                else if (args[1] === 'resume')
                {
                    
                }
                else if (args[1] === 'next')
                {
                    if (message.guild.voiceConnection)
                    {
                        YTDL.getInfo(musicQueue[currentSong + 1], function(err, info){
                            var songName = info.title;
                            message.channel.send('Skipped current song');
                            message.channel.send(`Started playing: **${songName}** `);
                        });
                        const dipatcher = musicConnection.playStream(YTDL(musicQueue[currentSong + 1]));
                        musicQueue.splice([currentSong], 1);
                        musicList.splice([currentSong], 1);
                    }
                    else
                    {
                        message.reply("I have to be in a voice channel");
                    }
                }
                else if (args[1] === 'search')
                {
                    if (message.member.voiceChannel)
                    {
                        if (message.guild.voiceConnection)
                        {
                            ytSearch(argsNormalCase[2], function(err, res) {
                                if (err) return message.channel.send("Some problem occured while searching");
                                let videos = res.videos.slice(0, 10);

                                let listToShow = '';
                                for (i = 0; i < videos.length; i++)
                                {
                                    if (videos[i] === videos[0])
                                    {
                                        var songNumber = i + 1;
                                        listToShow = listToShow.concat("```" + songNumber+ ": " + videos[i].title) + "\n";
                                    }
                                    else if (videos[i] === videos[videos.length - 1])
                                    {
                                        var songNumber = i + 1;
                                        listToShow = listToShow.concat(songNumber + ": " + videos[i].title) + "```";
                                    }
                                    else
                                    {
                                        var songNumber = i + 1;
                                        listToShow = listToShow.concat(songNumber + ": " + videos[i].title) + "\n";
                                    }
                                }
                                listToShow = listToShow.concat(`\nChoose a number: **${1 }** - **${videos.length}**`);
                                message.channel.send(listToShow);

                                const filter = m => !isNaN(m.content) && m.content < videos.length + 1 && m.content > 0;
                                const collector = message.channel.createMessageCollector(filter);
                                collector.videos = videos;
                                collector.once('collect', function(m) 
                                {
                                    currentSong = parseInt(m.content) - 1;
                                    console.log(currentSong);
                                    message.channel.send(`Started playing: **${videos[currentSong].title}** `)
                                    const dipatcher = musicConnection.playStream(YTDL(this.videos[parseInt(m.content) - 1].url))
                                    .on ("end", () => {
                                        const dipatcher = musicConnection.playStream(YTDL(musicQueue[currentSong + 1]));
                                        musicQueue.splice([currentSong], 1);
                                        musicList.splice([currentSong], 1);                                           
                                        })
                                    .on ("error", () => {
                                        console.error("Could not join the voice channel");
                                        });                                
                                });
                            });
                        }
                        else
                        {
                            message.reply("I have to be in a voice channel.");
                        }
                    }
                    else
                    {
                        message.reply("You have to be in a voice channel.");
                    }
                }
                else if (args[1] === 'current')
                {
                    YTDL.getInfo(musicList[0], function(err, info){
                    message.channel.send(`Now playing: **${info.title}** `);
                    });   
                }
                else if (args[1] === 'clear')
                {
                    if (message.member.voiceChannel)
                    {
                        if (!message.guild.voiceConnection)
                        {
                            musicQueue = [];
                            musicList = [];
                            message.channel.send("<@" + message.author.id + ">" + " -> The music list has been cleared successfully.");
                        }
                    }
                }
                else if (args[1] === 'list')
                {
                    var listToShow = "";
                    if (message.guild.voiceConnection)
                    {
                        if (musicList.length === 1)
                        {
                            message.channel.send("```1: " + musicList[0] + "```");
                        }
                        else if (musicList === [])
                        {
                            message.channel.send("The song list is empty");
                        }
                        else
                        {
                            for(i = 0; i < musicList.length; i++)
                            {
                                if (musicList[i] === musicList[0])
                                {
                                    var songNumber = i + 1;
                                    listToShow = "```" + songNumber + ": " + musicList[i];
                                }
                                else if (musicList[i] === musicList[musicList.length - 1])
                                {
                                    var songNumber = i + 1;
                                    listToShow = listToShow.concat("\n" + songNumber + ": " + musicList[i] + "```");
                                    message.channel.send(listToShow);
                                }
                                else
                                {
                                    var songNumber = i + 1;
                                    listToShow = listToShow.concat("\n" + songNumber + ": " + musicList[i]);
                                }
                            }
                        }
                    }
                    else
                    {
                        message.reply("I have to be in a voice channel");
                    }
                }
                break;
            //Random Commands
            case 'fight':
                var random = Math.floor(Math.random() * 5)
                switch (random)
                {
                    case 0:
                        message.channel.send(message.author.username + " GETS FUKD")
                        break;
                    case 1:
                        message.channel.send(message.author.username + " GETS FUKD")
                        break;
                    case 2:
                        message.channel.send(message.author.username + " GETS FUKD")
                        break;
                    case 3:
                        message.channel.send(messsage.author.username + " GETS FUKD")
                        break;
                    case 4:
                        message.channel.send(message.author.username + " GETS FUKD")
                        break;
                    case 5:
                        message.channel.send(message.author.username + " GETS FUKD")
                        break;
                }
                break;
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
                break;
            //-Custom Commands
            case "command":
                if (args[1] === 'add')
                {
                    if (args[2].startsWith("!"))
                    {
                        if (args[3])
                        {
                            var doesCommandExist = false;
                            var newCustomCommand = Object.create(CustomCommand);
                            newCustomCommand.init(args[2], argsNormalCase.slice(3).join(" "));
                            
                            customCommandsList.forEach(function (customCommand)
                            {
                                if (args[2] === customCommand.getCommandName())
                                {
                                    message.channel.send("This command already exists scrub");
                                    doesCommandExist = true;
                                    return;
                                }
                            })
                            if (doesCommandExist === false)
                            {
                                customCommandsList.push(newCustomCommand);
                                message.channel.send("<@" + message.author.id + ">" + " -> The command " + "\"" + newCustomCommand.getCommandName() + "\"" + " has been added successfully.");

                                fs.writeFile (customCommandsFile, JSON.stringify(customCommandsList, null, 2), err =>{
                                    if (err) throw err;
                                });
                                return;
                            }
                        }
                    }
                }
                else if (args[1] === 'remove')
                {
                    if (args[2].startsWith("!"))
                    {
                        var doesCommandExist = false;
                        for (i = 0; i < customCommandsList.length; i++)
                        {
                            if (args[2] === customCommandsList[i].getCommandName())
                            {
                                if (i === 0)
                                {
                                    customCommandsList.splice(i,i+1);
                                }
                                else if (i !== 0)
                                {
                                    customCommandsList.splice(i,i);
                                }
                                doesCommandExist = true;
                            }
                        }
                        if (doesCommandExist === true)
                        {
                            message.channel.send("<@" + message.author.id + ">" + " -> The command " + "\"" + args[2] + "\"" + " has been removed successfully.");

                            fs.writeFile (customCommandsFile, JSON.stringify(customCommandsList, null, 2), err =>{
                                if (err) throw err;
                            });
                            return;
                        }
                    }
                }
                else if (args[1] === 'edit')
                {
                    if (args[2].startsWith("!"))
                    {
                        if (args[3])
                        {
                            var doesCommandExist = false;
                            var newCustomCommand = Object.create(CustomCommand);
                            newCustomCommand.init(args[2], args.slice(3).join(" "));
                            for (i = 0; i < customCommandsList.length; i++)
                            {
                                if (args[2] === customCommandsList[i].getCommandName())
                                {
                                    if (i === 0)
                                    {
                                        customCommandsList.splice(i,i+1);
                                        customCommandsList.push(newCustomCommand);
                                    }
                                    else if (i !== 0)
                                    {
                                        customCommandsList.splice(i,i);
                                        customCommandsList.push(newCustomCommand);
                                    }
                                    doesCommandExist = true;
                                }
                            }
                            if (doesCommandExist === true)
                            {
                                message.channel.send("<@" + message.author.id + ">" + " -> The command " + "\"" + args[2] + "\"" + " has been edited successfully.");

                                fs.writeFile (customCommandsFile, JSON.stringify(customCommandsList, null, 2), err =>{
                                    if (err) throw err;
                                });
                                return;
                            }
                        }
                    }
                }
                else if (args[1] === 'clear')
                {
                    customCommandsList = [];
                    fs.writeFile (customCommandsFile, '[]', err =>{
                        if (err) throw err;
                    }); 
                    message.channel.send("<@" + message.author.id + ">" + " -> The command list" + " has been cleared successfully.");
                }
                else if (args[1] === 'list')
                var listToShow = "";
                if (customCommandsList.length === 1)
                {
                    listToShow = listToShow.concat("```" + "Command: " + customCommandsList[i].getCommandName() + ", " +customCommandsList[i].getCommandText() + "```");
                    message.channel.send(listToShow);
                }
                else
                {
                    for (i = 0; i < customCommandsList.length; i++)
                    {
                            if (customCommandsList[i] === customCommandsList[0])
                            {
                                listToShow = "```" + "Command: " + customCommandsList[i].getCommandName() + ", " + customCommandsList[i].getCommandText();
                            }
                            else if (customCommandsList[i] === customCommandsList[customCommandsList.length - 1])
                            {
                                listToShow = listToShow.concat("\n" + "Command: " + customCommandsList[i].getCommandName() + ", " +customCommandsList[i].getCommandText() + "```");
                                message.channel.send(listToShow);
                                return;
                            }
                            else
                            {
                                listToShow = listToShow.concat("\n" + "Command: " + customCommandsList[i].getCommandName() + ", " +customCommandsList[i].getCommandText());
                            }
                    }
                }
                break;  
            default:
                if (message.content.indexOf(PREFIX) === 0)
                {
                    customCommandsList.forEach(function (customCommand)
                    {
                        if ("!" + args[0] === customCommand.getCommandName())
                        {
                            message.channel.send(customCommand.getCommandText());
                        }
                    })
                }
                break;
        }
    }
})


bot.login(token);