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
    let reply = ""
    let type = get_account_type(accountType)
    if(type){
        try{
            let sqlStr = `INSERT INTO users (id,${type}) VALUES (\"${id}\",\"${value}\") ON CONFLICT (id) DO UPDATE SET ${AccountTypes.BNET} = \"${value}\"`
            db.run(sqlStr, (err) => {
                if(err){
                    console.log(err)
                    throw err
                }
            })
            reply = `Succesfully registered ${type.toUpperCase()}: ${value}`
        }catch(e){
            console.log(e)
            throw 'Failed to register account.'
        }
    }
    return reply
}

function get_account_type(accountType){
    let values = Object.values(AccountTypes)
    for(let val in values){
        let arr = accountDict[values[val]];
        for(i in arr){
            if(arr[i] === accountType){
                return values[val]
            }
        }
    }
    throw `${accountType} is not a valid account type.`
}

exports.get_account =  (id, accountType="*") => {
    return new Promise((resolve,reject) =>{ 
        db.get(`SELECT * FROM users WHERE id = \"${id}\"`, (err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    })
}

exports.create_table = (db, command) => {
    try{
        db.run(command)
    }catch(e){
        console.log(e)
    }
}


exports.AccountTypes = AccountTypes

