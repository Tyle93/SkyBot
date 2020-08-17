const Discord = require('discord.js')
const client = new Discord.Client()
const db = require("./DB.js")

let token = ""
if(process.env.discToken){
    token = process.env.discToken
}else{
    token = process.argv[2]
}
let database = null

let commandDescriptionDict = {}

const Commands = {
    REGISTER: {
        name: "!register",
        args: {
            AccountType: "AccountType",
            AccountName: "AccountName"
        },
        argMin: 3,
        argMax: 3,
        exec: (message) => {
            return new Promise((resolve, reject) => {
                let params = message.content.split(" ")
                if(params.length === Commands.REGISTER.argMin){
                    resolve(db.registerProfile(database, message.author.id, params[1], params[2]))
                }else{
                    console.log(params)
                    reject("Incorrect Format.")
                }
            })
        }
    },
    HELP: {
        name: "!help",
        args: {

        },
        argMin: 1,
        argMax: 1,
        exec: (message) => {
            return new Promise((resolve,reject) => {
                try{
                    let desc = commandDescriptionDict["!help"]
                    resolve(desc)
                }catch(e){
                    reject(e)
                }
            })
        }
    },
    UNREGISTER: {
        name: "!unregister",
        args: {
            userID: "UserID",
            accountType: "AccountType"
        },
        argMin: 1,
        argMax: 2,
        exec: (message) => {
            return new Promise((resolve,reject) => {
                let id = message.author.id
                let params = getArgs(message)
                if(params.length === Commands.UNREGISTER.argMin){
                    resolve(db.removeProfile(database, id))
                }else if(params.length == Commands.UNREGISTER.argMax){
                    if(params[1] === "-help" || params[1] === "help"){
                        resolve(commandDescriptionDict["!unregister"])
                    }
                    resolve(db.removeProfile(database,id,params[1]))
                }else{
                    reject("Incorrect Format.")
                }
            })
        }
    },
    GETID: {
        name: "!getid",
        args: {
            UserName: "UserName",
            AccountType: "AccountType"
        },
        argMin: 2,
        argMax: 3,
        exec: (message) => {
            return new Promise((resolve,reject) => {
                params = getArgs(message)
                let id = message.mentions.users.first().id
                db.get_account(id).then((result) => {
                    formatResponse(result).then((result) => {
                        resolve(result)
                    }).catch((err) => {
                        reject(err)
                    })
                }).catch((err) => {
                    reject(err)
                })
            })
        }
    }
}

commandDescriptionDict[Commands.GETID.name] = "\n!getid @user [accountType](optional)"
commandDescriptionDict[Commands.REGISTER.name] = "\n!register accountType accountName"
commandDescriptionDict[Commands.HELP.name] = "\n\
\t-!register: \n\
\t-!unregister:\n\
\t-!help\n\
"
commandDescriptionDict[Commands.UNREGISTER.name] = " "

client.on("ready", () => {
    client.user.setAvatar("./resources/Skybot.png").then(() => {
        console.log("Bot Avatar successfully set.")
    }).catch((err) => {
        console.log("Failed to set bot avatar.")
    })
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
    if(message.author.username === client.user.username){
        return
    }
    params = getArgs(message)
    if(!isCommand(params[0])){
        return
    }else{
        try{
            parseCommand(params[0]).then((result) => {
                result.exec(message).then((result) => {
                    message.reply(result)
                }).catch((err) => {
                    message.reply(err)
                })
            }).catch((err) => {
                message.reply(err)
            })
        }catch(e){
            message.reply(e)
        }
    }
})

function isCommand(command){
    if(commandDescriptionDict[command]){
        return true 
    }
    return false

}
function parseCommand(command){
    return new Promise((resolve, reject) => {
        for(comm in Commands){
            if(Commands[comm].name === command){
                resolve(Commands[comm])
            }
        }
        reject("Not a valid Command!")
    })
    
}

function formatResponse(result){
    return new Promise((resolve,reject) => {
        try{
            let vals = Object.values(result);
            let keys = Object.keys(result);
            let response = "\n"
            let insertions = 0;
            for(val in vals){
                if(vals[val] && keys[val] != "id"){
                    response += `\t${keys[val].toUpperCase()}: ${vals[val]}\n`
                    insertions += 1
                }
            }
            if(insertions === 0){
                reject("There are currently no accounts registered to this user.")
            }
            resolve(response)
        }catch(e){
            reject(e)
        }  
    })
}

function getArgs(message){
    return message.content.toLowerCase().split(" ")
}

client.login(token).then(() => {
    console.log("Successfully logged into client.")
}).catch((err) => {
    console.log(err)
})
