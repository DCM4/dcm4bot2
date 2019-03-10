const Discord = require("discord.js");
const moment = require("moment");

const bot = new Discord.Client()
let BotSettings = require("./botsettings.json")

bot.on("ready", async () => {
    console.log(`Bot ist eingeloggt als: ${bot.user.tag} \nPrefix: ${BotSettings.prefix}`)
    bot.user.setStatus("online")
})
setInterval(async function () {
    let moduleG = [`mit ${bot.users.get(BotSettings.OwnerID).tag}`,`auf ${bot.guilds.size} Servern`,`mit ${bot.users.size} Usern`]
    let random = moduleG[Math.floor(Math.random() * moduleG.length)];
    
    bot.user.setActivity(random, {type: "PLAYING"});

}, 10000);

//Welcome Message
bot.on("guildMemberAdd", async member => {
    if(member.guild.id == "497866135618715650") {
        bot.channels.get("551846307824664617").send(`${member} Willkommen auf dem **${member.guild.name}**`)
        member.addRole("498168931920510991")
    }
});

//Goodbye Message
bot.on("guildMemberRemove", async member => {
    if(member.guild.id == "497866135618715650") {
        bot.channels.get("551846307824664617").send(`${member.user.tag} hat den **${member.guild.name}** verlassen.`)
    }
})


bot.on("message", async message => {

    var args = message.content.slice(BotSettings.prefix.length).trim().split(" ")
    var command = args.shift()

//Restart
if(message.content == `${BotSettings.prefix}restart`) {
    if(message.author.id == BotSettings.OwnerID || message.author.id == "399664511084265472") {
        let rschannel = message.channel

        bot.destroy()
        .then(bot.login(process.env.BOT_TOKEN))
        message.channel.send(`Neustart...`)
        bot.on("ready", async () => rschannel.send(`${message.author}, Neustart hat geklappt!`))
    } else {
        message.channel.send(`Nur der Bot-Owner kann das. ${message.author}`)
    }
}

//Help
if(message.content == `${BotSettings.prefix}help`) {
    var Helpembed = new Discord.RichEmbed()

    .setColor("#1ABC9C")
    .setTitle("Help Befehl")
    .setThumbnail(bot.user.avatarURL)
    .addField(`${BotSettings.prefix}about`, `Infos über den Bot`)
    .addField(`${BotSettings.prefix}kick`,`Kickt einen Nutzer`)
    .addField(`${BotSettings.prefix}ban`,`Bannt einen Nutzer`)
    .addField(`${BotSettings.prefix}say`,`Wiederholt deine Nachricht`)
    .addField(`${BotSettings.prefix}restart`,`Startet den Bot neu`)
    .addField(`${BotSettings.prefix}clear`,`Löscht die Nachrichten`)
    .addField(`${BotSettings.prefix}addrole`,`Gibt dir die Rolle die du willst`)
    .addField(`${BotSettings.prefix}removerole`,`Nimmt dir die Rolle weg,die du willst`)
    message.channel.send(Helpembed)
}

//About
if(message.content == `${BotSettings.prefix}about`) { 

    let t = new Date(bot.uptime)
    let days = t.getUTCDate()-1;

    let minutes = t.getUTCMinutes();
    let hours = t.getUTCHours();


    let seconds = t.getUTCSeconds();

    let zeit = `${days} Tagen, ${hours} Stunden, ${minutes} Minuten und ${seconds} Sekunden`

    var Aboutembed = new Discord.RichEmbed()

   .setColor("#1ABC9C")
   .setTitle(`Infos über ${bot.user.username}`)
   .setDescription(`[Discord Server](https://discord.gg/V34PPMC)`)
   .setThumbnail(bot.user.avatarURL)
   .addField(`Name + Tag`,`${bot.user.username}#${bot.user.discriminator}`)
   .addField(`Onlinezeit`,`Online seit ${zeit}`)
   .addField(`Erstellungsdatum`,`${moment(bot.user.createdAt).format("DD.MM.YYYY")}`)
   message.channel.send(Aboutembed)
}

//Say
if(message.content.startsWith(`${BotSettings.prefix}say`)){
    if(message.member.hasPermission("MANAGE_MESSAGES")) { 
        var Say = args.join(" ") 
        if(Say) {
            message.channel.send(Say) 
        } else { 
            message.channel.send(`Was soll ich bitte sagen? ${message.author}`)
        }
    } else { 
        message.channel.send(`Du brauchst Nachrichten Verwalten Rechte ${message.author}`)
    }
    message.delete();
}


//Kick
if(message.content.startsWith(`${BotSettings.prefix}kick`)) {
    if(message.member.hasPermission("KICK_MEMBERS")) {
        var member = message.mentions.members.first()

        if(!member)

        return message.reply(`Dieses User existiert nicht!`)

        if(!message.guild.me.hasPermission("KICK_MEMBERS"))

        return message.reply(`Ich habe keine Berechtigungen dazu!`)

        var grund = args.slice(1).join(" ")

        if(!grund)return message.reply(`Du musst einen Grund angeben!`)

        await member.kick(grund)

        return message.reply(`${member.user.tag} wurde gekickt wegen **${grund}**`)
    } else {
        message.channel.send(`Du hast keine Kick Rechte!`)
    }

}

//Ban
if(message.content.startsWith(`${BotSettings.prefix}ban`)) {
    if(message.member.hasPermission("BAN_MEMBERS")) {
        var member = message.mentions.members.first()

        if(!member)

        return message.reply(`Dieses User existiert nicht!`)

        if(!message.guild.me.hasPermission("BAN_MEMBERS"))

        return message.reply(`Ich habe keine Berechtigungen dazu!`)

        var grund = args.slice(1).join(" ")

        if(!grund)return message.reply(`Du musst einen Grund angeben!`)

        await member.ban(grund)

        return message.reply(`${member.user.tag} wurde gebannt wegen **${grund}**`)
    } else {
        message.channel.send(`Du hast keine Ban Rechte!`)
    }

}


//AddRole
if(message.content.startsWith(`${BotSettings.prefix}addrole`)) {
    if(message.member.hasPermission("ADMINISTRATOR"))  {
    var Rolle = args.join(" ")  
      if(message.guild.roles.find)(role => role.name === Rolle)
      message.member.addRole(message.guild.roles.find(role => role.name === Rolle).id)
      .then(message.channel.send(`Dir wurde die Rolle ${Rolle} hinzugefügt`)).catch(error => {
          message.channel.send(`Ein Fehler ist aufgetaucht: \n${error}`)
      })
    } else {
        message.channel.send(`Du hast keine Admin Rechte!`)
    }
}

//RemoveRole
if(message.content.startsWith(`${BotSettings.prefix}removerole`)) {
    if(message.member.hasPermission("ADMINISTRATOR"))  {
    var Rolle = args.join(" ")  
      if(message.guild.roles.find)(role => role.name === Rolle)
      message.member.removeRole(message.guild.roles.find(role => role.name === Rolle).id)
      .then(message.channel.send(`Dir wurde die Rolle ${Rolle} entfernt`)).catch(error => {
          message.channel.send(`Ein Fehler ist aufgetaucht: \n${error}`)
      })
    } else {
        message.channel.send(`Du hast keine Admin Rechte!`)
    }
}


//Clear
if(message.content.startsWith(`${BotSettings.prefix}clear`)) {
    if(message.member.hasPermission("MANAGE_MESSAGES"))  {

        let deleteCount = parseInt(args[0], 10);

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) return message.reply("Bitte gib eine Nummer zwischen **2** und **100**.");

        let deleted = await message.channel.bulkDelete(deleteCount).catch(error => message.reply(`Ich kann die nachrichten nicht löschen weil ${error}`));    

        let clear = await message.channel.send(`**${deleted.size}** Nachrichten wurden gelöscht. ${message.author}`)
        setTimeout(async () => {clear.delete()}, 4000)
    } else {
        message.channel.send(`Du hast keine Nachrichten-Verwalten Rechte!`)
    }
}
  



//eval
if(message.content.startsWith(`${BotSettings.prefix}eval`)) {
    if(message.author.id == BotSettings.OwnerID || message.author.id == "399664511084265472") {
        let command = args.join(" ");
        function clean(text) {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          } 
         try {
          let code = args.join(" ");
          let evaled = eval(command);
     
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
     
          message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }              
    } else {
        message.channel.send(`Nur der Bot-Owner kann das. ${message.author}`)
    }
}

//usermessage
if(message.content.startsWith(`${BotSettings.prefix}usermessage`)) {
    if(message.member.hasPermission("SEND_MESSAGES"))
    message.delete();

    let BotSettings = bot.settings;



    try {

        const target = message.mentions.members.first() || message.guild.members.get(message.args[0])

        message.args.shift()



        let MissEmbedArgs = new Discord.RichEmbed()

            .setColor("#F1C40F")

            .setTitle(`Hm. Irgendwas ist falsch gelaufen!.`)

            .setDescription(`Bitte gib eine volle Nachricht an.`)


            if (message.args.length < 1) return message.channel.send(message.author, MissEmbedArgs)



        let userembed = new Discord.RichEmbed()



            .setColor(message.vars.embedRandom)

            .setTitle(`Du hast eine Nachricht von ${message.author.username}#${message.author.discriminator}`)

            .setDescription(`${message.args.join(" ")}`)

            .setAuthor(target.user.tag, target.user.displayAvatarURL)

            .setThumbnail(message.vars.AuthorLogo)

            .setFooter(message.guild.name, message.vars.YuiLogo)





        bot.users.get(target.id).send(userembed)



        var successEmbed = new Discord.RichEmbed()

            .setColor("#1afd4c")

            .setTitle(`Nachricht war erfolgreich!`)

            .setDescription(`Deine Nachricht wurde an **${target.user.username}**#${target.user.discriminator}.`)



        let msguser = await message.channel.send(message.author, successEmbed)

        setTimeout(async () => {

            msguser.delete()

        }, 3000)



    } catch (error) {

        let ErrEmbed = new Discord.RichEmbed()

            .setColor("#a21018")

            .setTitle(`Command execution failed`)

            .setDescription(`Hm. Irgendwas ist falsch gelaufen.\n\n\`\`\`${error}\`\`\``)



        message.channel.send(message.author, ErrEmbed)

    }

}



module.exports.help = {

    name: "usermessage",

    desc: "Ich sende die Nachrichten an den ausgewählten Spieler.",

    usage: "usermessage / [member] / [ID]",

    perms: "None",

    footer: {

        name: "Help",

        icon: "https://cdn.discordapp.com/attachments/495571358604853258/510530358169698314/tada.png"

    },

    color: "#e74c3c"

}
}

)    

bot.login(BotSettings.token)
