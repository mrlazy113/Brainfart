const Discord     = require('discord.js');
const bot         = new Discord.Client();
const prefix      = '\\'
const cheerio     = require('cheerio');
const snekfetch   = require('snekfetch');
const querystring = require('querystring');
const ytdl        = require('ytdl-core');
const search      = require('youtube-search');
const fs          = require("fs");
const http        = require("http");
const https       = require("https");
const link        = "http://bit.ly/2fcWOTk";
var servers = {};
// FUNCTIONS

function pluck(array) {
    return array.map(function (item) { return item['name']; });
}

function hasRole(mem, role) {
	if (pluck(mem.roles).includes(role)){
		return true;
  } else {
		return false;
  }
}

// COMMANDS
bot.on('ready', () => {
  console.log('ready!');
});
bot.on('message', message => {
  let args = message.content.split(' ').slice(1);
  if(!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0];
  command = command.slice(prefix.length);
  if(command === "ping"){
		message.channel.send({
      embed: {
        color: 3447003,
        description: `Pong! :ping_pong: Took ${bot.ping} ms to reply.`
      }
    });
  } else if(command === "purge" || command === "purge") {
		 message.delete()
    	if (message.member.hasPermission('MANAGE_MESSAGES')) {
        if (args.length >= 3) {
          message.channel.send('You defined too many arguments. Usage: `\\purge (amount of messages to delete)`');
        } else {
        	var msg;
          if (args.length === 1) {
            msg = 2;
          } else {
            msg = parseInt(args[1]);
          }
          message.channel.fetchMessages({ limit: msg }).then(messages => message.channel.bulkDelete(messages)).catch(console.error)
        }
      } else {
      	message.channel.send({
        embed: {
          "title": ":x: You dont have the required permissions to do that. Required: Manage Messages.",
          "color": 16711680,
        }
		});
    }
  } else if(command === "search") {
			googleCommand(message, args);
  } else if(command === "kick") {
  	message.delete();
    	if (message.member.hasPermission('KICK_MEMBERS')) {
        if (args.length < 1) {
          message.channel.send('You did not define an argument correctly. Usage: `\\kick <user>`');
        } else {
          message.guild.member(message.mentions.users.first()).kick().catch(console.error);
        }
      } else {
        message.channel.send({
        embed: {
          "title": ":x: You dont have the required permissions to do that. Required: Kick Members.",
          "color": 16711680,
      }
    });
    }
  } else if(command === "ban") {
  	message.delete();
    	if (message.member.hasPermission('BAN_MEMBERS')) {
        if (args.length < 1) {
          message.channel.send('You did not define an argument correctly. Usage: `\\ban <user>`');
        } else {
          message.guild.member(message.mentions.users.first()).ban().catch(console.error);
          message.mentions.users.first().send({
  			embed: {
  				"title": "YOU WERE BANNED!",
  				"image": "https://brainfart.ml/bot_stuff/THE_HAMMER.png"
  			}
          });
        }
      } else {
        message.channel.send({
        embed: {
          "title": ":x: You dont have the required permissions to do that. Required: Ban Members.",
          "color": 16711680,
      }
    });
    }
	}else if(command === "help") {
		message.delete();
    	message.channel.send("Ive sent you the help message in a DM!");
    	message.author.send({
    	embed: {
        "title": "**This is Brain Farts's help message.**",
        "description": "More commands Coming Soon!",
        "color": 3447003,
        "footer": {
          "icon_url": "https://cdn.discordapp.com/avatars/340582967594450944/611bd50f85dea6ac5027e13239607714.png",
          "text": "Brain Fart coded in Discord.js by ProfessorHicman#7783 and Sherlock Holmes#7739"
        },
        "thumbnail": {
          "url": "https://cdn.discordapp.com/avatars/340582967594450944/611bd50f85dea6ac5027e13239607714.png"

        },
        "author": {
          "name": "Brain Fart Help Page",
          "url": "https://discord.gg/S62RuQh",
          "icon_url": "https://cdn.discordapp.com/avatars/340582967594450944/611bd50f85dea6ac5027e13239607714.png"
        },
        "fields": [
        	{
        		"name": "**\\ping**",
          	"value": "Shows the bots reaction rate."
        	},
        	{
          	"name": "**\\kick**",
          	"value": "Kicks a member."
       		},
        	{
          	"name": "**\\ban**",
          	"value": "SWING THE BAN HAMMER!"
          },
        	{
            "name": "**\\search**",
            "value": "Searchs Google."
        	},
          {
            "name": "CBA TO DO MUSIC COMMANDS",
            "value": "Ill do it later. I promise...."
        	},
          {
            "name": "**\\play <song name/URL>**",
            "value": "Plays a song from youtube."
          },
          {
            "name": "**\\skip**",
            "value": "Skips a song. Vote not implemented yet. Anyone with certain permissions or roles can skip no matter what."
        	},
          {
            "name": "**\\canskip <@users name>**",
            "value": "Lets a user skip songs regardless of permissions."
          },
          {
            "name": "**\\queue**",
            "value": "Shows whats currently in the queue."
          },
        	{
            "name": "**\\pause**",
            "value": "Pauses playback."
          },
          {
            "name": "**\\resume**",
            "value": "Resumes playback. Seems to break in certain cases."
          },
          {
            "name": "**\\volume <Amount>**",
            "value": "Sets the playback volume. Recommended to not be over 200 otherwise clipping may occur."
          },
          {
            "name": "**\\clear**",
            "value": "Clears queue."
          },
          {
            "name": "**\\voicejoin**",
            "value": "Forces the bot to join the voice channel your in."
          }
        ]
      }
  	});
	} else if(command === 'stats') {
		let embed = new Discord.RichEmbed();
		embed.setAuthor(bot.user.username, bot.user.avatarURL);
		embed.setTitle('Server Stats');
		embed.setDescription('Below are the stats of your server.');
		embed.setTimestamp();
		embed.setColor(0x00AE86);
		embed.addField('Name:', message.guild.name);
		embed.addField('Owner:', message.guild.owner.displayName, true);
		embed.addField('Users:', message.guild.memberCount);
		embed.addField('Large Guild(more than 250 members):', message.guild.large, true);
		message.channel.send({embed});
	} else if(command === 'prune') {
		if(message.member.hasPermission('ADMINISTRATOR')) {
			message.guild.prune(args[0]);
		} else {
            message.channel.send({
				embed: {
					"title": ":x: You dont have the required permissions to do that. Required: Administrator.",
					"color": 16711680,
				}
			});
		}
	} else if(command === "mute"){
        if (message.member.hasPermission('MANAGE_ROLES')) {
            if (message.guild.roles.exists('name', 'Muted')){
                let role = message.guild.roles.find("name", "Muted");
                let member = message.mentions.members.first();
                member.addRole(role).catch(console.error);
                if(message.mentions.members.first().roles.has(role)) {
                    message.channel.send(`Failed to add role....`);
                } else {
                    message.channel.send(`${message.mentions.members.first()} is muted! Make sure the Muted role is higher than any other roles this user may have!`);
                }
            } else {
                let member = message.mentions.members.first();
                message.guild.createRole({
				name: "Muted",
				permissions: "READ_MESSAGES",
				position: 2
				});
                message.channel.send(`\\mute ${message.mentions.members.first()}`);
			}
        } else {
            message.channel.send({
            embed: {
                "title": ":x: You dont have the required permissions to do that. Required: Manage Roles.",
                "color": 16711680,
                }
            });
        }
	} else if(command === "unmute"){
        if (message.member.hasPermission('MANAGE_ROLES')) {
            if (message.guild.roles.exists('name', 'Muted')){
                let role = message.guild.roles.find("name", "Muted");
                let member = message.mentions.members.first();
                if(message.mentions.members.first().roles.has(role)) return;
                member.removeRole(role).catch(console.error);
                if(message.mentions.members.first().roles.has(role)) {
                    message.channel.send(`Failed to unmute....`);
                } else {
                    message.channel.send(`${message.mentions.members.first()} is now unmuted!`);
                }
            }
        } else {
            message.channel.send({
            embed: {
                "title": ":x: You dont have the required permissions to do that. Required: Manage Roles.",
                "color": 16711680,
                }
            });
        }
	} else if(command === "unban") {
		if(message.member.hasPermission('ADMINISTRATOR')) {
			if(args.length > 0) {
				message.guild.unban(args[0]);
			} else {
				let embed = new Discord.RichEmbed();
				embed.setTitle(':x: Please include an ID');
				embed.setColor(16711680);
				message.channel.send({embed});
			}
		} else {
            message.channel.send({
            embed: {
                "title": ":x: You dont have the required permissions to do that. Required: Administrator.",
                "color": 16711680,
                }
            });
        }
	} else if(command === "invite") {
    message.reply("Use the link " + link + " to invite the bot to your server. Please note: to invite the bot to a server you must be an admin on the server.");
  } else if(command === "shorten") {
    if(args != null) {
      var url = 'https://api-ssl.bitly.com/v3/shorten?access_token=aac6e754360a1d2238da99a45adac44a17294b97&longUrl=' + args;

      https.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
          body += chunk;
        });

        res.on('end', function(){
          var bitlyrep = JSON.parse(body);
          message.reply(bitlyrep.data.url);
        });
      }).on('error', function(e){
        console.log("Got an error: ", e);
      });
    } else {
      message.reply("Usage \\shorten [URL]");
    }
  } else if(command === "expand") {
    if(args != null) {
      var url = 'https://api-ssl.bitly.com/v3/expand?access_token=aac6e754360a1d2238da99a45adac44a17294b97&shortUrl=' + args;

      https.get(url, function(res){
        var body = '';

        res.on('data', function(chunk){
          body += chunk;
        });

        res.on('end', function(){
          var bitlyrep = JSON.parse(body);
          message.reply(bitlyrep.data.expand[0].long_url);
        });
      });
    } else {
      message.reply("Usage \\expand [URL]");
    }
  }
});

// MUSIC CODE - NO PLAYLIST SUPPORT - YET
// BTW this requires a config file for music and aslo a folder called data with a error.json file

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

  server.queue.shift()

  server.dispatcher.on("end", function() {
    if(server.queue[0]) play(connection, message);
    else connection.disconnect;
  })
}
bot.on('message', message => {
  let args = message.content.split(' ').slice(1);
  if(!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0];
  command = command.slice(prefix.length);
  if(command === "play") {
    if(!args[0]) {
      message.channel.send('Please provide a YouTube link.');
      return;
    }
    if(!message.member.voiceChannel) {
          message.channel.send('You must be in a voice channel.');
          return;
    }
    if(!servers[message.guild.id]) servers[message.guild.id] = {
      queue: []
    }

    var server = servers[message.guild.id]
    server.queue.push(args[0]);
    if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
      play(connection, message);
    });
  } else if(command === 'skip') {
    if(message.member.voiceChannel) {
      var server = servers[message.guild.id];
      if(server.dispatcher) {
        server.dispatcher.end();
      } else {
        message.channel.send('Bot is not playing a song!');
      }
    } else {
      message.channel.send('You must be in a voice channel for this command to work.');
    }
  }
});

process.on("unhandledRejection", err => {
    console.error("Uncaught We had a promise error, if this keeps happening report to dev server: \n" + err.stack);
});

async function googleCommand(msg, args) {
   let searchMessage = await msg.reply('Searching... Sec.');
   let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(msg.content)}`;
   return snekfetch.get(searchUrl).then((result) => {
      let $ = cheerio.load(result.text);
      let googleData = $('.r').first().find('a').first().attr('href');
      googleData = querystring.parse(googleData.replace('/url?', ''));
      searchMessage.edit(`Result found!\n${googleData.q}`);
  }).catch((err) => {
     searchMessage.edit('No results found!');
  });
}

bot.login('MzQwNTgyOTY3NTk0NDUwOTQ0.DF0oNw.FEuaEMVZfl1VTFlU-Rbw_-HKajo')
