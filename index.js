const Discord = require('discord.js')
const client = new Discord.Client()
const db = require("./DB.js")

const token = process.argv[2]

let database = null
client.on("ready", () => {
    try{
        database = db.initialize_db()
    }catch(e){
        console.log(e)
    }
})

client.on("message", (message) => {
    messageArr = message.content.split(" ")
    if(!isCommand(messageArr[0])){
       return
    }else{
        try{
            if(messageArr.length < 3){
                message.reply("Invalid Command.")
            }else{
                let reply = parseCommand(messageArr, message.author.id)
                message.reply(reply)
            }
        }catch(e){
            message.reply(e)
        }
    }
})

function isCommand(message){
    return (message.charAt(0) === '!')
}

function parseCommand(params,id){
    let reply = ""
    switch(params[0]){
        case "!register":
            try{
                if(params.length === 3){
                    reply = db.registerProfile(database, id, params[1], params[2])
                }else{
                    reply = "Not enough arguements given."
                }
            }catch(e){
                throw e;
            }
            break
        case "!unregister":
            break
        case "!help":
            reply = " \
                -!register: \
                -!unregister:\
                -!help\
            "
            break
    }   
    return reply
}

function formatResponse(){

}



client.login("NzQyMTE4ODYzNTM3MzA3Njg5.XzBeDA.3qIw912ITgarN9fqRa7NcIV4Ezc")

