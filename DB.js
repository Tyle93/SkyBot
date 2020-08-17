const sqlite = require("sqlite3")

const AccountTypes = {BNET: "bnetid",
                            ORIGIN: "originid",
                            STEAM: "steamid",
                            ACTIVISION: "activisionid",
                            UPLAY: "uplayid"
}

let accountDict = {}
accountDict[AccountTypes.BNET] = ["bnet","bnetid","battlenet","battlenetid"]
accountDict[AccountTypes.STEAM] = ["steam", "steamid"]
accountDict[AccountTypes.ORIGIN] = ["origin", "originid"]
accountDict[AccountTypes.ACTIVISION] = ["activision", "activisionid"]
accountDict[AccountTypes.UPLAY] = ["uplay","uplayid"]

let db = new sqlite.Database("./data/database.db")

exports.initialize_db = () => {
    let db = new sqlite.Database("./data/database.db", (err) => {
        if(err){
            console.log(err)
            console.log("Failed to initialize database.")
            process.exit()
        }else{
            try{
                db.run("CREATE TABLE IF NOT EXISTS users(id text PRIMARY KEY, steamid text, bnetid text, originid text)")
                return db
            }catch(e){
                console.log(e)
            }
        }
    })
    return db
}

exports.registerProfile = (db, id, accountType, value) => {
    return new Promise((resolve,reject) => {
        let type = get_account_type(accountType)
        if(type){
            try{
                db.run(`INSERT INTO users (id,${type}) VALUES (\"${id}\",\"${value}\") ON CONFLICT (id) DO UPDATE SET ${type} = \"${value}\"`, (err) => {
                    if(err){
                        console.log(err)
                        reject(err)
                    }else{
                        resolve(`Succesfully registered ${type.toUpperCase()}: ${value}`)
                    }
                })
            }catch(e){
                console.log(e)
                reject('Failed to register account.')
            }
        }
    })
    
}

exports.removeProfile = (db, id, accountType="*") => {
    return new Promise((resolve,reject) => {
        try{
            if(accountType === "*"){
                db.run(`DELETE FROM users WHERE id = \"${id}\"`,(err) => {
                    if(err){
                        console.log(err)
                        reject("Failed to unregister.")
                    }else{
                        resolve("Successfully unregistered")
                    }
                })
            }else{
                get_account_type(accountType).then((result) =>{
                    db.run(`UPDATE users SET ${result} = NULL WHERE id = \"${id}\"` , (err) =>{
                        if(err){
                            reject("Failed to ungregister.")
                        }else{
                            resolve("Successfully unregistered ")
                        }
                    })
                }).catch((err) => {
                    reject(err)
                })
            }
        }catch(e){
            reject("Failed to unreigster.")
        }
    })
}

function get_account_type(accountType){
    return new Promise((resolve, reject) => {
        let values = Object.values(AccountTypes)
        for(let val in values){
            let arr = accountDict[values[val]];
            for(i in arr){
                if(arr[i] === accountType){
                    resolve(values[val])
                }
            }
        }
        reject(`${accountType} is not a valid account type.`)
    })

}

exports.get_account =  (id, accountType="*") => {
    return new Promise((resolve,reject) =>{ 
        try{
            db.get(`SELECT * FROM users WHERE id = \"${id}\"`, (err, result) => {
                if (err) {
                    reject("No accounts found registered to that user.")      
                }
                else if(result){
                    resolve(result)
                }else{
                    reject("No accounts found registered to that user.")
                }
            })
        }catch(err){
            console.log(err)
            reject("No accounts found registered to that user.")
        }
    })
}

exports.AccountTypes = AccountTypes

