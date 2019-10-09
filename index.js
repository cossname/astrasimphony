const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const fs = require('fs');
let config = require('./config.json');
let token = config.token;
let prefix = config.prefix;
let alertslist = require("./alertslist.json")
const pong = require("./cmds/pong.js");
let channelid = '615332089667256359';
let roleName = 'SEA';



fs.readdir('./cmds/', (err, files) => {
  if (err) console.log(err);
});

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function formatted_date() {
  var result = "";
  var d = new Date();
  //result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
  //          " "+ d.getHours()+":"+d.getMinutes()+":"+
  //          d.getSeconds()+" "+d.getMilliseconds();
  result += addZero(d.getUTCHours()) + ":" + addZero(d.getUTCMinutes());
  return result;
}


client.on('ready', () => {
  console.log(`Time UTC= ${formatted_date()}! Logged in as ${client.user.username}!`);
  interval = setInterval(checkalerts, 6100);
});

client.on('message', msg => {
  if (msg.author.bot) return;
  if (msg.channel.type != "dm") return;
  if (msg.content === 'test!') {
    console.log(msg);
  }
  if (!msg.content.startsWith(prefix)) return;

  let user = msg.author.username;
  //  console.log(`1[${user}]`);
  let userid = msg.author.id
  // console.log(`2[${userid}]`);
  let messageArray = msg.content.split(" ");
  // console.log(`3[${messageArray}]`);
  let commandrequst = messageArray[0].toLowerCase().slice(prefix.length);
  // console.log(`4[${commandrequst}]`);
  let args = messageArray.slice(1);
  console.log(`[${user}] [${userid}] [${messageArray}] [${commandrequst}] prefix.length:${prefix.length} - ${args} ${msg.createdTimestamp}`);

  if (commandrequst === 'ping') {
    msg.channel.send("Pinging ...") // Placeholder for pinging ... 
      .then((msg) => { // Resolve promise
        msg.edit("Pong: " + (Date.now() - msg.createdTimestamp) + " ms") // Edits message with current timestamp minus timestamp of message
      });
  }
  if (commandrequst === 'link') {
    client.generateInvite(["ADMINISTRATOR"]).then(link => {
      msg.channel.send(link)
    });
  }
  if (commandrequst === 'help') {
    let msgEmbed = new Discord.RichEmbed()
      .setColor('#0099ff')
      .setTitle('List of timers:')
    msg.channel.send('List of commands: ');
    // msg.channel.send(`${i+1}.  ${alertslist.alerts.timers[i].role} ${alertslist.alerts.timers[i].time}(UTC) ${alertslist.alerts.timers[i].type} # ${alertslist.alerts.timers[i].number}`);
    msgEmbed.addField(`!list`, `List of timers`);
    msgEmbed.addField(`!add`, `Add timer`);
    msgEmbed.addField(`!delete`, `Delete timer`);
    msgEmbed.addField(`!enable`, `Enable timer`);
    msgEmbed.addField(`!disable`, `Disable timer`);
    msg.channel.send(msgEmbed);
  }
  if (commandrequst === 'list') {
    let msgEmbed = new Discord.RichEmbed()
      .setColor('#0099ff')
      .setTitle('List of timers:')
    var limit = alertslist.alerts.timers.length;
    if (limit > 24) {
      limit = 24
    }
    msg.channel.send('List of ' + alertslist.alerts.timers.length + ' timers: ');
    for (i = 0; i < limit; i++) {
      // msg.channel.send(`${i+1}.  ${alertslist.alerts.timers[i].role} ${alertslist.alerts.timers[i].time}(UTC) ${alertslist.alerts.timers[i].type} # ${alertslist.alerts.timers[i].number}`);
      msgEmbed.addField(`${addZero(i+1)}. [${alertslist.turns[`${alertslist.alerts.timers[i].on}`]}] ${alertslist.alerts.timers[i].role} ${alertslist.alerts.timers[i].time}(UTC) ${alertslist.alerts.timers[i].type}`, `# ${alertslist.alerts.timers[i].number}`)
    }
    msg.channel.send(msgEmbed);
    //after 24 strings
    if (alertslist.alerts.timers.length > 24) {
      let msgEmbed = new Discord.RichEmbed()
        .setColor('#0099ff')
      msg.channel.send('List of ' + alertslist.alerts.timers.length + ' timers: ');
      for (i = limit; i < alertslist.alerts.timers.length; i++) {
        //  msg.channel.send(`${i+1}.  ${alertslist.alerts.timers[i].role} ${alertslist.alerts.timers[i].time}(UTC) ${alertslist.alerts.timers[i].type} # ${alertslist.alerts.timers[i].number}`);
        msgEmbed.addField(`${addZero(i+1)}. [${alertslist.turns[alertslist.alerts.timers[i].on]}]  ${alertslist.alerts.timers[i].role} ${alertslist.alerts.timers[i].time}(UTC) ${alertslist.alerts.timers[i].type}`, `# ${alertslist.alerts.timers[i].number}`)
      }
      msg.channel.send(msgEmbed);
    }
  }
  if (commandrequst === 'delete') {
    if (alertslist.alerts.timers.length > 0) {
      for (i = 0; i < alertslist.alerts.timers.length; i++) {
        if (alertslist.alerts.timers[i].number === args[0]) {
          alertslist.alerts.timers.splice(i, 1);
          console.log(`${args[0]} : deleted`);
          msg.channel.send(`Timer #${args[0]} : deleted`);
        } else {
          // console.log(`"${alertslist.alerts.timers[i].number}": "${args[0]}"`);
        }
      }
      fs.writeFile('./alertslist.json', JSON.stringify(alertslist), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    }
  }
  if (commandrequst === 'disable') {
    if (alertslist.alerts.timers.length > 0) {
      for (i = 0; i < alertslist.alerts.timers.length; i++) {
        if (alertslist.alerts.timers[i].number === args[0]) {
          alertslist.alerts.timers[i].on = 0;
          console.log(`${args[0]} :  Disabled`);
          msg.channel.send(`Timer #${args[0]} : Disabled`);
        }
      }
      fs.writeFile('./alertslist.json', JSON.stringify(alertslist), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    }
  }
  if (commandrequst === 'enable') {
    if (alertslist.alerts.timers.length > 0) {
      for (i = 0; i < alertslist.alerts.timers.length; i++) {
        if (alertslist.alerts.timers[i].number === args[0]) {
          alertslist.alerts.timers[i].on = 1;
          console.log(`${args[0]} : Enabled`);
          msg.channel.send(`Timer #${args[0]} : Enabled`);
        }
      }
      fs.writeFile('./alertslist.json', JSON.stringify(alertslist), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });
    }
  }
  if (commandrequst === 'add') {
    let msgEmbed = new Discord.RichEmbed()
    // .setColor('#0099ff')
    ///  .setTitle('List of timers.')		
    // var obj = JSON.parse(alertslist);
    // obj['alerts.timers'].push({"number":"4","time":"pending","type":"pending"});
    // alertslist = JSON.stringify(obj);
    if (args.length !== 3) {
      msg.channel.send(`Not Enough parameters to add timer (Time - UTC timezone)`);
      msg.channel.send(`Example: !add role 12:33 WorldBOss`);
      return
    };
    var timerNumber = msg.createdTimestamp;
    var data = alertslist.alerts.timers;
    args[2] = args[2].replace('_', ' ');
    var feed = {
      "number": `${timerNumber}`,
      "role": `${args[0]}`,
      "time": `${args[1]}`,
      "type": `${args[2]}`,
      "on": 1
    };
    data.push(feed);
    //console.log(JSON.stringify(data));
    alertslist.alerts.timers = data;
    console.log(`${timerNumber} : added`);
    msg.channel.send(`Timer #${timerNumber} : added`);
    fs.writeFile('./alertslist.json', JSON.stringify(alertslist), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    });
  }
});

async function checkalerts() {
  try {
    var guild = client.guilds.get("615332089243369492");
    if (!guild.available) {
      console.log('Error: Guild is not exists!');
      return
    }
  } catch (error) {
    console.log('Error: Guild is not exists!!');
    return
  }
  var datenow = new Date();
  var msgChannel = client.channels.find(channel => channel.id === channelid);
  if (alertslist) {
    for (i = 0; i < alertslist.alerts.timers.length; i++) {
      if (formatted_date() == alertslist.alerts.timers[i].time) {
        if (alertslist.alerts.timers[i].send != 1) {
          console.log(`${alertslist.alerts.timers[i].time}: ${alertslist.alerts.timers[i].number}:${alertslist.alerts.timers[i].role}:  ${alertslist.alerts.timers[i].type} = ${alertslist.alerts.timers[i].send}  /1 ${alertslist.alerts.timers[i].on}`);
          var msgChannel = client.channels.find(channel => channel.id === channelid); //DMCtest
          let roleName = alertslist.alerts.timers[i].role;
          var role = guild.roles.find(role => role.name === roleName);
          if (alertslist.alerts.timers[i].on != 0) {
            msgChannel.send(role + " " + alertslist.alerts.timers[i].type);
          }

          alertslist.alerts.timers[i].send = 1;
        }
      } else {
        if (alertslist.alerts.timers[i].send == 1) {
          alertslist.alerts.timers[i].send = 0;
        }

      }
    }
  }
}

client.login(token);
