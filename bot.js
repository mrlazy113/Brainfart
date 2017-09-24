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

// Let thingys XD

let points = JSON.parse(fs.readFileSync("./data/points.json", "utf8"));

// COMMANDS

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

bot.on("message", message => {
	if (message.author.bot) return;
	if (!points[message.author.id]) points[message.author.id] = {
    	points: 0,
    	level: 0
	};
	let userData = points[message.author.id];
	userData.points++;

	let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
	if (curLevel > userData.level) {
    	// Level up!
    	userData.level = curLevel;
    	message.reply(`You've leveled up to level **${curLevel}**! Ain't that dandy?`);
  	}
  	fs.writeFile("./data/points.json", JSON.stringify(points), (err) => {
  		if (err) console.error(err)
  	});
  	let args = message.content.split(' ').slice(1);
  	if(!message.content.startsWith(prefix)) return;
  	let command = message.content.split(' ')[0];
  	command = command.slice(prefix.length);
  	if (command === "level") {
    	message.reply(`You are currently level ${userData.level}, with ${userData.points} points.`);
  	}
});

// MUSIC CODE - NO PLAYLIST SUPPORT - YET
// BTW this requires a config file for music and aslo a folder called data with a error.json file

var errorlog = require("./data/errors.json");

try {
    var config = require('./config.json');
    console.log("Config file detected!");
} catch (err) {
    console.log(err);
    console.log("No config detected, attempting to use environment variables...");
    if (process.env.MUSIC_BOT_TOKEN && process.env.YOUTUBE_API_KEY) {
        var config = {
            "token": process.env.MUSIC_BOT_TOKEN,
            "client_id": "",
            "prefix": "\\",
            "owner_id": "193090359700619264",
            "status": "Musicccc",
            "youtube_api_key": process.env.YOUTUBE_API_KEY,
            "admins": ["193090359700619264"]
        };
    } else {
        console.log("No token passed! Exiting...");
        process.exit(0);
    }
}
const admins = config.admins;
const rb = "```";
const queues = {};
const opts = {
    part: 'snippet',
    maxResults: 10,
    key: config.youtube_api_key
};
var intent;

function getQueue(guild) {
    if (!guild) return;
    if (typeof guild == 'object') guild = guild.id;
    if (queues[guild]) return queues[guild];
    else queues[guild] = [];
    return queues[guild];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

var paused = {};

//Fix dis shit
function getRandomMusic(queue, msg) {
    fs.readFile('./data/autoplaylist.txt', 'utf8', function(err, data) {
        if (err) throw err;
        console.log('OK: autoplaylist.txt');
        var random = data.split('\n');
        var num = getRandomInt(random.length);
        console.log(random[num]);
        var url = random[num];
        msg.author.username = "AUTOPLAYLIST";
        play(msg, queue, url);
    });
}

function play(msg, queue, song) {
    try {
        if (!msg || !queue) return;
        if (song) {
            search(song, opts, function(err, results) {
                if (err) return msg.channel.send("Video not found please try to use a youtube link instead.");
                song = (song.includes("https://" || "http://")) ? song : results[0].link;
                let stream = ytdl(song, {
                    audioonly: true
                });
                let test;
                if (queue.length === 0) test = true;
                queue.push({
                    "title": results[0].title,
                    "requested": msg.author.username,
                    "toplay": stream
                });
                console.log("Queued " + queue[queue.length - 1].title + " in " + msg.guild.name + " as requested by " + queue[queue.length - 1].requested);
                msg.channel.send({
                embed: {
                    author: {
                        name: bot.user.username,
                        icon_url: bot.user.avatarURL,
                        url: "http://takohell.com:3000"
                    },
                    color: 0x00FF00,
                    title: `Queued`,
                    description: "**" + queue[queue.length - 1].title + "**"
                }
                    });
                if (test) {
                    setTimeout(function() {
                        play(msg, queue)
                    }, 1000);
                }
            });
        } else if (queue.length !== 0) {
                        msg.channel.send({
        embed: {
            author: {
                name: bot.user.username,
                icon_url: bot.user.avatarURL,
                url: "http://takohell.com:3000"
            },
            color: 0x00FF00,
            title: `Now Playing`,
            description: `**${queue[0].title}** | Requested by ***${queue[0].requested}***`
        }
            });
            console.log(`Playing ${queue[0].title} as requested by ${queue[0].requested} in ${msg.guild.name}`);
            let connection = msg.guild.voiceConnection;
            if (!connection) return console.log("No Connection!");
            intent = connection.playStream(queue[0].toplay);

            intent.on('error', () => {
                queue.shift()
                play(msg, queue)
            });

            intent.on('end', () => {
                queue.shift()
                play(msg, queue)
            });
        }
    } catch (err) {
        console.log("WELL LADS LOOKS LIKE SOMETHING WENT WRONG!\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!");
        });
    }
}
function isCommander(id) {
	if(id === config.owner_id) {
		return true;
	}
	for(var i = 0; i < admins.length; i++){
		if(admins[i] == id) {
			return true;
		}
	}
	return false;
}
bot.on('ready', function() {
    try {
        config.client_id = bot.user.id;
        bot.user.setStatus('online', config.status);
        var msg = `
------------------------------------------------------
> Do 'git pull' periodically to keep your bot updated!
> Logging in...
------------------------------------------------------
Logged in as ${bot.user.username} [ID ${bot.user.id}]
On ${bot.guilds.size} servers!
${bot.channels.size} channels and ${bot.users.size} users cached!
Bot is logged in and ready to play some tunes!
LET'S GO!
------------------------------------------------------`

        var errsize = Number(fs.statSync("./data/errors.json")["size"])
        console.log("Current error log size is " + errsize + " Bytes")
        if (errsize > 5000) {
            errorlog = {}
            fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
                if (err) return console.log("Uh oh we couldn't wipe the error log");
                console.log("Just to say, we have wiped the error log on your system as its size was too large")
            })
        }
        console.log("------------------------------------------------------")
    } catch (err) {
        console.log("WELL LADS LOOKS LIKE SOMETHING WENT WRONG!\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!");
        })

    }
})

bot.on('voiceStateUpdate', function(oldMember, newMember) {
	var svr = bot.guilds.array()
    for (var i = 0; i < svr.length; i++) {
        if (svr[i].voiceConnection) {
            if (paused[svr[i].voiceConnection.channel.id]) {
                if (svr[i].voiceConnection.channel.members.size > 1) {
					paused[svr[i].voiceConnection.channel.id].player.resume()
					var game = bot.user.presence.game.name;
                    delete paused[svr[i].voiceConnection.channel.id]
                    game = game.split("?")[1];
					bot.user.setGame(game);
                }
            }
            if (svr[i].voiceConnection.channel.members.size === 1 && !svr[i].voiceConnection.player.dispatcher.paused) {
                svr[i].voiceConnection.player.dispatcher.pause();
                var game = bot.user.presence.game.name;
                paused[svr[i].voiceConnection.channel.id] = {
                    "player": svr[i].voiceConnection.player.dispatcher
                }
                bot.user.setGame("? " + game);
            }
        }
    }
});

bot.on("message", function(msg) {
    try {
        if (msg.channel.type === "dm") return;
        if (msg.author === bot.user)
            if (msg.guild === undefined) {
                msg.channel.send("The bot only works in servers!")

                return;
            }
        if (msg.content.startsWith(prefix + 'play')) {
            if (!msg.guild.voiceConnection) {
                if (!msg.member.voiceChannel) return msg.channel.send('You need to be in a voice channel')
                var chan = msg.member.voiceChannel
                chan.join()
            }
            let suffix = msg.content.split(" ").slice(1).join(" ")
            if (!suffix) return msg.channel.send('You need to specify a song link or a song name!')

            play(msg, getQueue(msg.guild.id), suffix)
        }

        if (msg.content.startsWith(prefix + "clear")) {
            if (msg.guild.owner.id == msg.author.id || msg.author.id == config.owner_id || config.admins.indexOf(msg.author.id) != -1 || msg.channel.permissionsFor(msg.member).hasPermission('MANAGE_SERVER')) {
                let queue = getQueue(msg.guild.id);
                if (queue.length == 0) return msg.channel.send(`No music in queue`);
                for (var i = queue.length - 1; i >= 0; i--) {
                    queue.splice(i, 1);
                }
                msg.channel.send(`Cleared the queue`)
            } else {
                msg.channel.send({
                    embed: {
                        "title": ":x: You dont have the required permissions to do that. Required: Manage Server or Owner",
                        "color": 16711680,
                    }
                })
            }
        }

        if (msg.content.startsWith(prefix + 'skip')) {
            if (msg.guild.owner.id == msg.author.id || msg.author.id == config.owner_id || config.admins.indexOf(msg.author.id) != -1 || msg.channel.permissionsFor(msg.member).hasPermission('MANAGE_GUILD') || hasRole(msg.member, 'Can Skip')){
                let player = msg.guild.voiceConnection.player.dispatcher
                if (!player || player.paused) return msg.channel.send("Bot is not playing!")
                msg.channel.send('Skipping song...');
                queue.shift();
                play(msg, queue);
            } else {
                msg.channel.send({
                    embed: {
                        "title": ":x: You dont have the required permissions to do that. Required: Manage Server or Owner",
                        "color": 16711680,
                    }
                })
            }
        }

        if (msg.content.startsWith(prefix + 'pause')) {
            if (msg.guild.owner.id == msg.author.id || msg.author.id == config.owner_id || config.admins.indexOf(msg.author.id) != -1) {
                let player = msg.guild.voiceConnection.player.dispatcher
                if (!player || player.paused) return msg.channel.send("Bot is not playing")
                player.pause();
                msg.channel.send("Pausing music...");
            } else {
                msg.channel.send({
                    embed: {
                        "title": ":x: You dont have the required permissions to do that. Required: Manage Server or Owner",
                        "color": 16711680,
                    }
                })
            }
        }
        if (msg.content.startsWith(prefix + 'volume')) {
            let suffix = msg.content.split(" ")[1];
            var player = msg.guild.voiceConnection.player.dispatcher
            if (!player || player.paused) return msg.channel.send('No music m8, queue something with `' + prefix + 'play`');
            if (!suffix) {
                msg.channel.send(`The current volume is ${(player.volume * 100)}`);
            } else if (msg.guild.owner.id == msg.author.id || msg.author.id == config.owner_id || config.admins.indexOf(msg.author.id) != -1) {
                let volumeBefore = player.volume
                let volume = parseInt(suffix);
                if (volume > 100) return msg.channel.send("The music can't be higher then 100");
                player.setVolume((volume / 100));
                msg.channel.send(`Volume changed from ${(volumeBefore * 100)} to ${volume}`);
            } else {
                msg.channel.send({
                    embed: {
                        "title": ":x: You dont have the required permissions to do that. Required: Manage Server or Owner",
                        "color": 16711680,
                    }
                })
            }
        }

        if (msg.content.startsWith(prefix + 'resume')) {
            if (msg.guild.owner.id == msg.author.id || msg.author.id == config.owner_id || config.admins.indexOf(msg.author.id) != -1) {
                let player = msg.guild.voiceConnection.player.dispatcher
                if (!player) return msg.channel.send('No music is playing at this time.');
                if (player.playing) return msg.channel.send('The music is already playing');
                var queue = getQueue(msg.guild.id);
                bot.user.setGame(queue[0].title);
                player.resume();
                msg.channel.send("Resuming music...");
            } else {
                msg.channel.send({
                    embed: {
                        "title": ":x: You dont have the required permissions to do that. Required: Manage Server or Owner",
                        "color": 16711680,
                    }
                })
            }
        }

        if (msg.content.startsWith(prefix + 'np') || msg.content.startsWith(prefix + 'nowplaying')) {
            let queue = getQueue(msg.guild.id);
            if (queue.length === 0) return msg.channel.send("No music in queue");
            msg.channel.send({
        embed: {
            author: {
                name: bot.user.username,
                icon_url: bot.user.avatarURL,
                url: "http://takohell.com:3000"
            },
            color: 0x00FF00,
            title: `Currently playing`,
            description: `${queue[0].title} | by ${queue[0].requested}`
        }
            });
        }

        if (msg.content.startsWith(prefix + 'queue')) {
            let queue = getQueue(msg.guild.id);
            if (queue.length == 0) return msg.channel.send("No music in queue");
            let text = '';
            for (let i = 0; i < queue.length; i++) {
                text += `${(i + 1)}. ${queue[i].title} | requested by ${queue[i].requested}\n`
            };
            msg.channel.send({
        embed: {
            author: {
                name: bot.user.username,
                icon_url: bot.user.avatarURL,
                url: "http://takohell.com:3000"
            },
            color: 0x00FF00,
            title: `Queue`,
            description: `\n${text}`
        }
            });
        }
    } catch (err) {
        console.log("WELL LADS LOOKS LIKE SOMETHING WENT WRONG! Visit Joris Video and quote this error:\n\n\n" + err.stack)
        errorlog[String(Object.keys(errorlog).length)] = {
            "code": err.code,
            "error": err,
            "stack": err.stack
        }
        fs.writeFile("./data/errors.json", JSON.stringify(errorlog), function(err) {
            if (err) return console.log("Even worse we couldn't write to our error log file! Make sure data/errors.json still exists!");
        })

    }
})

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
