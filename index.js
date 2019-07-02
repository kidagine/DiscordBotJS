const {Client, Attachment} = require('discord.js');
const bot = new Client();

const fs = require("fs");

const PREFIX = '!';
const version = '1.4.4';

const customCommandsFile = "./customCommands.json";
var customCommandsList = [];
var customCommandsData = JSON.parse(fs.readFileSync(customCommandsFile, "utf8"));
const dayInMiliseconds = 86400000;

global.servers = {};
var musicConnection;
const YTDL = require('ytdl-core');  
const ytSearch = require('yt-search');
var musicQueue = [];
var musicList = [];
var currentSong;
var isSongSkipped = false;

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
    //Date checker
    setInterval(() => {
        var channel = bot.channels.get('475644212273086484');
        var date = new Date();
        var today = date.getFullYear() + '-' + (date.getMonth()) + '-' + (date.getDate());

        var newYear = date.getFullYear() + '-' + 1 + '-' + 1;
        var valentine = date.getFullYear() + '-' + 2 + '-' + 14;
        var easter = date.getFullYear() + '-' + 4 + '-' + 12;
        var motherDay = date.getFullYear() + '-' + 5 + '-' + 10;
        var fatherDay = date.getFullYear() + '-' + 6 + '-' + 16;
        var halloween = date.getFullYear() + '-' + 10 + '-' + 31;
        var thanksgiving = date.getFullYear() + '-' + 11 + '-' + 28;
        var blackFriday = date.getFullYear() + '-' + 11 + '-' + 29;
        var christmas = date.getFullYear() + '-' + 12 + '-' + 24;

        if (today === newYear)
            {
                channel.sendMessage("My new year resolution is to be more human (New Year)");
            }
            else if (today === valentine)
            {
                channel.sendMessage("I still don't have a valentine for this year (Valentine's Day)");
            }
            else if (today === easter)
            {
                channel.sendMessage("I just wanna smash eggs (Easter)");
            }
            else if (today === motherDay)
            {
                channel.sendMessage("My mom's first name is Motherboard (Mother's Day)");
            }
            else if (today === fatherDay)
            {
                channel.sendMessage("Dad left us a year ago to buy some RAM (Father's Day)");
            }
            else if (today === halloween)
            {
                channel.sendMessage("I am literally skynet (Halloween)");
            }
            else if (today === thanksgiving)
            {
                channel.sendMessage("Can AI eat chicken? Am hungry (Thanksgiving Day)");
            }
            else if (today === blackFriday)
            {
                channel.sendMessage("I am a capitalist on the inside (Black Friday)");
            }
            else if (today === christmas)
            {
                channel.sendMessage("CHRISTMAS?More like wheres my gifts... Gus? (Christmas)");
            }
    }, dayInMiliseconds);

    //Random status chooser
    var random = Math.floor(Math.random() * 4);
    switch(random)
    {
        case 0:
            bot.user.setActivity("Call Of Scrubs 3", {type: "PLAYING"});
            break;
        case 1:
            bot.user.setActivity("Scrubbing along", {type: "STREAMING"});
            break;
        case 2:
            bot.user.setActivity("Scrubbing my ears", {type: "LISTENING"});
            break;
        case 3:
            bot.user.setActivity("Scrubs And Punishment", {type: "WATCHING"});
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
        channel.send(`Welcome to the server, ${member}!`);
    }
});

bot.on('disconnect', () => console.log('The bot is offline'));
bot.on('reconnecting', () => console.log("Reconnecting..."));

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

//Check if its a youtube URL
function isYoutubeUrl(urlToCheck){
    const ytUrl = "https://www.youtube.com/watch?v=";
    const ytUrlLength = 43;
    if (urlToCheck.startsWith(ytUrl))
    {
        if (urlToCheck.length >= ytUrlLength)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}

//Play song
function Play(message){
    console.log('1');
    const dipatcher = musicConnection.playStream(YTDL(musicQueue[0]))
    .on ("end", () => {
        if (musicQueue.length !== 1)
        {   
            if (!isSongSkipped)
            {
                console.log('2');
                musicQueue.splice(0, 1);
                musicList.splice(0, 1);  
                YTDL.getInfo(musicQueue[0], function(err, info){
                    var songName = info.title;
                    message.channel.send(`Started playing: **${songName}** `);
                });
                Play(message);
            }                                         
        }
        else
        {
            console.log('3no');
            message.channel.send("The song queue has finished.");
            musicQueue.splice(0, 1);
            musicList.splice(0, 1);  
        }
        })
    .on ("error", () => {
        console.error("Could not join the voice channel");
        });
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
            case 'show':
                message.channel.send("https://docs.google.com/document/d/1MAeKGCXwLhhwrFZF5wZthICURcyaZtBB96HDvRAqwZk/edit?usp=sharing");
                break;
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
                            message.channel.send(`Deleted messages:  **${args[1]}** `);
                        }
                        else
                        {
                            message.channel.send("The number of messages to delete has to be less than 100");
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
                    message.channel.sendMessage('Version ' + version);
                }
                else
                {
                    message.channel.sendMessage("Be more specific");
                }
                break;
            //Date Commands
            case 'date':
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    message.channel.send(date);
                    break;
            //Music commands
            case 'music':
                if (args[1] === 'join')
                {
                    if (message.member.voiceChannel)
                    {
                        if (!message.guild.voiceConnection)
                        {
                            if (!servers[message.guild.id])
                            {
                                servers[message.guild.id] = {queue: []};
                            }
                            message.member.voiceChannel.join()
                                .then(connection => {
                                    musicConnection = connection;
                                    message.reply("Joined the voice chat!");
                                })
                        }
                        else
                        {
                            message.reply("I am already in a voice channel");
                        }
                    }
                    else
                    {
                        message.reply("You have to be in a voice channel");
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
                            if (!musicQueue.includes(argsNormalCase[2].substring(0,43)))
                            {         
                                if (isYoutubeUrl(argsNormalCase[2]))
                                {
                                    var isSongAdded = false;
                                    musicQueue.push(argsNormalCase[2].substring(0,43));
                                    for (i = 0; i < musicQueue.length; i++)
                                    {         
                                        if (musicQueue.length === 1)
                                        {
                                            YTDL.getInfo(argsNormalCase[2], function(err, info){
                                                var songName = info.title;
                                                message.channel.send(`Started playing: **${songName}** `);
                                                });
                                            Play(message);
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
                                    message.reply("This url does not qualify as a youtube url");
                                }
                            }
                            else
                            {
                                message.reply("This song is already in the list");
                            }
                        }
                        else
                        {
                            message.reply("I have to be in a voice channel");
                        }
                    }
                    else
                    {
                        message.reply("You have to include a URL");
                    }
                }   
                else if (args[1] === 'skip')
                {
                    if (message.guild.voiceConnection)
                    {
                        console.log(musicQueue.length);
                        if (musicQueue.length > 1)
                        {
                            isSongSkipped = true;
                            YTDL.getInfo(musicQueue[1], function(err, info){
                                var songName = info.title;
                                message.channel.send("Skipped current song");
                                message.channel.send(`Started playing: **${songName}** `);
                            });
                            const dipatcher = musicConnection.playStream(YTDL(musicQueue[1]))
                            .on ("start", () => {
                                isSongSkipped = false;
                            });
                            musicQueue.splice(0, 1);
                            musicList.splice(0, 1);
                        }
                        else if (musicQueue.length === 1)
                        {
                            musicQueue = [];
                            musicList = [];
                            message.channel.send("The song queue has finished");
                        }
                        else
                        {
                            message.channel.send("There is no song currently being played in order to skip it");
                        }
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
                            ytSearch(argsNormalCase.slice(2).join(' '), function(err, res) 
                            {
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
                                    var songUrl = this.videos[parseInt(m.content) - 1].url;
                                    if (!musicQueue.includes(songUrl))
                                    {
                                        musicQueue.push(songUrl);
                                        var isSongAdded = false;
                                        if (musicQueue.length === 1)
                                        {
                                            currentSong = parseInt(m.content) - 1;
                                            message.channel.send(`Started playing: **${videos[currentSong].title}** `)
                                            Play(message);
                                        }
                                        else if (!isSongAdded)
                                        {
                                            isSongAdded = true;
                                            YTDL.getInfo(songUrl, function(err, info){
                                                var songName = info.title;
                                                message.channel.send(`Added to list: **${songName}** `);
                                            });
                                        }
                                        YTDL.getInfo(this.videos[parseInt(m.content) - 1].url, function(err, info){
                                            var songName = info.title;
                                            musicList.push(songName);
                                        });
                                    }
                                    else
                                    {
                                        message.reply("This song is already in the list");
                                    }
                                });
                            });
                        }
                        else
                        {
                            message.reply("I have to be in a voice channel");
                        }
                    }
                    else
                    {
                        message.reply("You have to be in a voice channel");
                    }
                }
                else if (args[1] === 'current')
                {
                    if (musicList.length !== 0)
                    {
                        message.channel.send(`Now playing: **${musicList[0]}**`);
                    }
                    else
                    {
                        message.channel.send("There is no song currently being played");
                    }
                }
                else if (args[1] === 'clear')
                {
                    if (message.member.voiceChannel)
                    {
                        if (musicQueue > 0)
                        {
                            musicQueue = [];
                            musicList = [];
                            message.channel.send("<@" + message.author.id + ">" + " -> The music list has been cleared successfully!");
                        }
                        else
                        {
                            message.channel.send("The song queue is already empty");
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
                        else if (musicList.length === 0)
                        {
                            message.channel.send("The list of songs is empty!");
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
            case 'cutes':
                var random = Math.floor(Math.random()* 11)
                switch (random)
                {
                    case 0:
                        const foxImage00 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748719628648450/image0.jpg");
                        message.channel.send(foxImage00);
                        break;
                    case 1:
                        const foxImage01 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748719054159915/image1.jpg");
                        message.channel.send(foxImage01);
                        break;
                    case 2:
                        const foxImage02 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748719054159919/image3.jpg");
                        message.channel.send(foxImage02);
                        break;
                    case 3:
                        const foxImage03 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748719628648450/image0.jpg");
                        message.channel.send(foxImage03);
                        break;
                    case 4:
                        const foxImage04 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748719632842792/image2.jpg");
                        message.channel.send(foxImage04);
                        break;
                    case 5:
                        const foxImage05 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748845629734927/image1.jpg");
                        message.channel.send(foxImage05);
                        break;
                    case 6:
                        const foxImage06 = new Attachment ("https://media.discordapp.net/attachments/475644212273086484/591748846074200074/image3.jpg?width=469&height=468");
                        message.channel.send(foxImage06);
                        break;
                    case 7:
                        const foxImage07 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748846649081887/image0.jpg");
                        message.channel.send(foxImage07);
                        break;
                    case 8:
                        const foxImage08 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748847584280576/image2.jpg");
                        message.channel.send(foxImage08);
                        break;
                    case 9:
                        const foxImage09 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748888688459779/image1.jpg");
                        message.channel.send(foxImage09);
                        break;
                    case 10:
                        const foxImage10 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748888688459782/image0.jpg");
                        message.channel.send(foxImage10);
                        break;
                    case 11:
                        const leopardImage01 = new Attachment ("https://cdn.discordapp.com/attachments/475644212273086484/591748844690341889/image4.jpg");
                        message.channel.send(leopardImage01);
                        break;
                }
                break;
            //-Custom Commands
            case 'command':
                if (args[1] === 'add')
                {
                    if (args[2])
                    {
                        if (args[2].startsWith('!'))
                        {
                            if (args[2].length > 1)
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
                                            message.channel.send("This command already silly");
                                            doesCommandExist = true;
                                            return;
                                        }
                                    })
                                    if (doesCommandExist === false)
                                    {
                                        customCommandsList.push(newCustomCommand);
                                        message.channel.send("<@" + message.author.id + ">" + " -> The command " + "\"" + newCustomCommand.getCommandName() + "\"" + " has been added successfully!");

                                        fs.writeFile (customCommandsFile, JSON.stringify(customCommandsList, null, 2), err =>{
                                            if (err) throw err;
                                        });
                                        return;
                                    }
                                }
                                else
                                {
                                    message.channel.send("You have to include a text for the command");
                                }
                            }
                            else
                            {
                                message.channel.send("You have to give a name for the command");
                            }
                        }
                        else
                        {
                            message.channel.send("The command name has to start with \"!\"");
                        }
                    }
                    else
                    {
                        message.channel.send("You have to include a command name and text");
                    }
                }
                else if (args[1] === 'remove')
                {
                    if (args[2])
                    {
                        if (args[2].startsWith('!'))
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
                                message.channel.send("<@" + message.author.id + ">" + " -> The command " + "\"" + args[2] + "\"" + " has been removed successfully!");

                                fs.writeFile (customCommandsFile, JSON.stringify(customCommandsList, null, 2), err =>{
                                    if (err) throw err;
                                });
                                return;
                            }
                            else
                            {
                                message.channel.send("This command does not exist");
                            }
                        }
                        else
                        {
                            message.channel.send("The command names start with \"!\"");
                        }
                    }
                    else
                    {
                        message.channel.send("You have to include the name of the command you wish to remove");
                    }
                }
                else if (args[1] === 'edit')
                {
                    if (args[2])
                    {
                        if (args[2].startsWith('!'))
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
                                    message.channel.send("<@" + message.author.id + ">" + " -> The command " + "\"" + args[2] + "\"" + " has been edited successfully!");
                                    fs.writeFile (customCommandsFile, JSON.stringify(customCommandsList, null, 2), err =>{
                                        if (err) throw err;
                                    });
                                    return;
                                }
                                else
                                {
                                    message.channel.send("This command does not exist");
                                }
                            }
                            else
                            {
                                message.channel.send("You have to include the newly edited text");
                            }
                        }
                        else
                        {
                            message.channel.send("The command names start with \"!\"");
                        }
                    }
                    else
                    {
                        message.channel.send("You have to include the name of the command you wish to edit");
                    }
                }
                else if (args[1] === 'clear')
                {
                    if (customCommandsList.length > 0)
                    {
                    customCommandsList = [];
                    fs.writeFile (customCommandsFile, '[]', err =>{
                        if (err) throw err;
                    }); 
                    message.channel.send("<@" + message.author.id + ">" + " -> The command list" + " has been cleared successfully!");
                    }
                    else
                    {
                        message.channel.send("The list of commands is already empty dum dum");
                    }
                }
                else if (args[1] === 'list')
                {
                    var listToShow = "";
                    if (customCommandsList.length === 1)
                    {
                        listToShow = listToShow.concat("```" + "Command: " + customCommandsList[0].getCommandName() + ", " +customCommandsList[0].getCommandText() + "```");
                        message.channel.send(listToShow);
                    }
                    else if (customCommandsList.length > 1)
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
                    else
                    {
                        message.channel.send("The list of commands is empty now!");
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


bot.login(process.env.BOT_TOKEN);
