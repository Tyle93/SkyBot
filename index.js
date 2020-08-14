const Discord = require('discord.js')
const client = new Discord.Client()
const db = require("./DB.js")

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
                parseCommand(messageArr, message.author.id)
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
    switch(params[0]){
        case "!register":
            try{
                db.registerProfile(database, id, params[1], params[2])
            }catch(e){
                throw e;
            }
            break
        case "!unregister":
            break
    }   
}

function formatResponse(){

}

client.login("NzQyMTE4ODYzNTM3MzA3Njg5.XzBeDA.BHNDKcoAPoX19dI-8bxUcsY1kGE")

