const sqlite = require("sqlite3")

const AccountTypes = {BNET: "bnetid",
                            ORIGIN: "originid",
                            STEAM: "steamid",
                            ACTIVISION: "activisionid",
                            UPLAY: "uplayid"
}

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
    switch(accountType){
        case AccountTypes.BNET:
            try{
                let sqlStr = `INSERT INTO users (id,${AccountTypes.BNET}) VALUES (\"${id}\",\"${value}\") ON CONFLICT (id) DO UPDATE SET ${AccountTypes.BNET} = \"${value}\"`
                db.run(sqlStr)
            }catch(e){
                console.log(e)
            }
            break
        case AccountTypes.ORIGIN:
            try{
                let sqlStr = `INSERT INTO users (id,${AccountTypes.ORIGIN}) VALUES (\"${id}\",\"${value}\") ON CONFLICT (id) DO UPDATE SET ${AccountTypes.ORIGIN} = \"${value}\"`
                db.run(sqlStr)
            }catch(e){
                console.log(e)
            }
            break
        case AccountTypes.STEAM:
            try{
                let sqlStr = `INSERT INTO users (id,${AccountTypes.STEAM}) VALUES (\"${id}\",\"${value}\") ON CONFLICT (id) DO UPDATE SET ${AccountTypes.STEAM} = \"${value}\"`
                db.run(sqlStr)
            }catch(e){
                console.log(e)
            }
            break
        case AccountTypes.ACTIVISION:
            try{
                let sqlStr = `INSERT INTO users (id,${AccountTypes.ACTIVISION}) VALUES (\"${id}\",\"${value}\") ON CONFLICT (id) DO UPDATE SET ${AccountTypes.ACTIVISION} = \"${value}\"`
                db.run(sqlStr)
            }catch(e){
                console.log(e)
            }
            break
        case AccountTypes.UPLAY:
            try{
                let sqlStr = `INSERT INTO users (id,${AccountTypes.UPLAY}) VALUES (\"${id}\",\"${value}\") ON CONFLICT (id) DO UPDATE SET ${AccountTypes.UPLAY} = \"${value}\"`
                db.run(sqlStr)
            }catch(e){
                console.log(e)
            }
            break
        default: 
            throw `\"${accountType}\" is not a valid account type.`
    }
}

exports.create_table = (db, command) => {
    try{
        db.run(command)
    }catch(e){
        console.log(e)
    }
}

exports.AccountTypes = AccountTypes
