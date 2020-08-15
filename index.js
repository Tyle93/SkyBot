const Discord = require('discord.js')
const client = new Discord.Client()
const db = require("./DB.js")

const token = process.argv[2]

let database = null
client.on("ready", () => {
    client.user.setAvatar("./resources/Skybot.png")
    try{
        database = db.initialize_db()
    }catch(e){
        console.log(e)
    }
})

client.on("guildMemberAdd", (newMember) => {
    newMember.user.send(`Hello ${newMember.user}, welcome to ${newMember.guild}! First and foremost,\
 please make sure to check out and read the #roles! It has all the\
instructions to unlock all the other channels for you!  Thank you for joining us,\
and we hope you enjoy yourselves with our amazing community and its members!`)
})

client.on("message", (message) => {
    messageArr = message.content.split(" ")
    if(!isCommand(messageArr[0])){
       return
    }else{
        try{
            parseCommand(messageArr, message).then((result) => {
                    message.reply(result)
            }).catch((err) => {
                message.reply(err)
            })
        }catch(e){
            message.reply(e)
        }
    }
})

function isCommand(message){
    return (message.charAt(0) === '!')
}

function parseCommand(params,message){
    return new Promise((resolve,reject) =>{
        switch(params[0]){
            case "!register":
                try{
                    if(params.length === 3){
                        resolve(db.registerProfile(database, message.author.id, params[1], params[2]))
                    }else{
                        reject("Incorrect Format.")
                    }
                }catch(e){
                    reject(e);
                }
                break
            case "!unregister":
                break
            case "!help":
                resolve(" \n\
                    -!register: \n\
                    -!unregister:\n\
                    -!help\n\
                ")
                break
            case "!get":
                let id = message.mentions.users.first().id
                db.get_account(id).then((result) => {
                    formatResponse(result).then((result) => {
                        resolve(result)
                    }).catch((err) => {
                        reject(e)
                    })
                }).catch((err) => {
                    reject(err)
                })
        }   
    })
}

function formatResponse(result){
    return new Promise((resolve,reject) => {
        try{
            let vals = Object.values(result);
            let keys = Object.keys(result);
            let response = "\n"
            for(val in vals){
                if(vals[val] && keys[val] != "id"){
                    response += `${keys[val].toUpperCase()}: ${vals[val]}\n`
                }
            }
            resolve(response)
        }catch(e){
            reject(e)
        }  
    })
}

client.login(token)
