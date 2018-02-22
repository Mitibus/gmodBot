const Discord = require('discord.js');
var bot = new Discord.Client();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
var YoutubeStream = require('youtube-audio-stream')
const adapters = new FileSync('database.json')
const db = low(adapters);

db.defaults({histoire: [], xp: []}).write();

var dispatcher;
const PREFIXE = "/";
var version = Discord.version;
var randNum = 0;


bot.on('ready', function(){
    bot.user.setPresence({ game: { name: "/help | Gmod Bot V" + version }});
    console.log("Prêt pour travailler !")
    console.log(Discord.version);
});



bot.on('message', message => {
    
    if(message.content[0] === PREFIXE){
        let splitMessage = message.content.split(" ");
        if(splitMessage[0] === "/play"){
            if(splitMessage.length === 2){
                if(message.member.voiceChannel){
                    let voiceChannel = message.member.voiceChannel
                    
                    voiceChannel
                        .join()
                        .then(function (connection) {
                            let stream = YoutubeStream(splitMessage[1])
                            connection.playStream(stream).on('end', function() {
                                connection.disconnect()
                            })
                        })
                    
                }else{
                    message.reply("Vous n'etes pas connécté a un salon vocal")
                }
            }else{
                message.reply("Absence de paramètre !")
            }
        }
    }

    var msgauthor = message.author.id;

    if(message.author.bot) return;

    if(!db.get('xp').find({user: msgauthor}).value()){
        db.get('xp').push({user: msgauthor, xp: 1, level: 0, coin: 1}).write();
        console.log("Un nouvel utilisateur : " + message.author.username + " ajouté a la BDD XP")
    }else{
        var userxpdb = db.get('xp').filter({user: msgauthor}).find("xp").value();
        console.log(userxpdb);

        var userxp = Object.values(userxpdb);
        console.log(userxp);
        console.log(`Nombre d'xp ${userxp[1]}`);

        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1, coin: userxp[3] +=1}).write();

        userxpafter = userxp[1];

        if(userxpafter === 50){
            message.reply(":thumbsup:  Bien joué tu viens tout juste d'atteindre le level " + (userxp[2]+1))
            db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] -=49, level: userxp[2] += 1}).write();

        }
    }



    if (!message.content.startsWith(PREFIXE)) return;
    var args = message.content.substring(PREFIXE.length).split(" ");

    switch (args[0].toLowerCase()){
        case "newstory":
        var value = message.content.substr(10);
        var author = message.author.id;
        var number = db.get('histoire').map('id').value();
        console.log(value);
        message.reply("Ajout de l'histoire a la base de donnée")
        db.get('histoire')
            .push({ id : number + 1, story_value: value, story_author: author})
            .write();
        console.log("Command : / requested by : " + message.author.username + " Value : " + value);

        break;

        case "kick":
        if(!message.channel.permissionsFor(message.member).hasPermissions('KICK_MEMBERS')){
            message.reply("Tu n'as pas les autorisations requises pour kick cet utilisateur");
        }else{
            if(!member.kickable){
                message.reply("Impossible de kick cet utilisateur pour une raison inconnue :confused: ")
            }else{
                member.kick().then((member) => {
                message.channel.send(`${member.displayName} a été kick ! Il va en profiter pour se calmer et reviendra plus tard !`);
                }).catch(() => {
                    message.channel.send("Kick refusé !");
                })
            }
        }
        break;

    }
 

    if(message.content === PREFIXE + "ping"){
        message.reply("Pong :smile:");
        console.log("Command : !ping requested by : " + message.author.username);
    }
    if (message.content === PREFIXE + "humeur"){
        random();
        if(randNum == 0){
            console.log("Commande : /humeur requested by : " + message.author.username + " Value : " + randNum);
        }
        if(randNum == 1){
            message.reply("Tout va bien :smile: Merci !");
            console.log("Commande : /humeur requested by : " + message.author.username + " Value : " + randNum);
        }else if (randNum == 2 ){
            message.reply("Bof un peu débordé mais ca va ! :sweat:");
            console.log("Commande : /humeur requested by : " + message.author.username + " Value : " + randNum);

        }else if (randNum == 3){
            message.reply("Ca pourrait aller mieux :weary:");
            console.log("Commande : /humeur requested by : " + message.author.username + " Value : " + randNum);

        }
    
    }

    if(message.content === PREFIXE + "help"){
        var help_embed = new Discord.RichEmbed()
            .setColor('#01B0F0')
            .addField("Liste des commandes : ", "   ***/help*** : Affcihe la liste des commandes")
            .addField("Modération : ", "   ***/kick [user] [reason]*** : Kick l'utilisateur mentionné pour une certaine raison précisée", true)
            .addField("-----", "   ***/ban [user] [reason]*** : Ban l'utilisateur mentionné pour une certaine raison précisée")
            .addField("Games", "   ***/ping *** : Un petit jeu qui amuse fortement notre bot")
            .addField("-----", "   ***/humeur*** : Connaitre l'humeur de notre bot")


        message.channel.sendEmbed(help_embed);
        console.log("Command : /help requested by : " + message.author.username);
    }

    if (message.content === PREFIXE + "info"){
        var userxpdb = db.get('xp').filter({user: msgauthor}).find("xp").value();
        console.log(userxpdb);

        var userxp = Object.values(userxpdb);

        var help_embed = new Discord.RichEmbed()
            .setColor('#01B0F0')
            .addField("Utilisateur : ", message.author.username)
            .addField("ID utilisateur : ", message.author.id)
            .addField("-----", "-")
            .addField("Level : ", userxp[2])
            .addField("Coins : ", userxp[3] + " $")
            .addField("-----", "-")

        message.channel.sendEmbed(help_embed);
        console.log("Command : /info requested by : " + message.author.username);
    }

    if(message.content === PREFIXE + "location"){

    }

}) 


function random(min, max){
    min = Math.ceil(1);
    max = Math.floor(4);
    randNum = Math.floor(Math.random() * (max - min + 1) + min)
}

bot.on('guilMemberAdd', member => {
    member.createDM().then(channel => {
        return channel.sendMessage("Bienvenue à toi " + member.displayName + " sur le serveur discord de la communauté World Life RP")
        console.log('User joinned : ' + member.displayName)
    })
})



bot.login("");
