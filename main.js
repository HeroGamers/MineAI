const { log, table } = console
const { readFileSync, writeFileSync } = require('fs')
const login_info = JSON.parse(readFileSync('login_info.json'))
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer


const bot = mineflayer.createBot({
    host: login_info.host,  // optional
    port: login_info.port,  // optional
    username: login_info.username,  // email and password are required only for
    password: login_info.password,  // online-mode=true servers
    version: login_info.version,    // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
    auth: login_info.auth   // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
})


const _Combat = require('./Util/combat.js')
const _Tools = require('./Util/tools.js')
const _Logger = require('./Util/logger.js')
const _Gather = require('./gather.js')
const Combat = new _Combat(bot)
const Tools = new _Tools(bot)
const Logger = new _Logger(bot, log)
const Gather = new _Gather(bot)

var save = {
    masters: []
}
try {
    save = JSON.parse(readFileSync('./save.json'))
} catch (err) {}


bot.on('chat', function (username, message) {
    if (username == bot.username) return // så er det botten selv, der skriver
    log("msg:", username, message)

    if (message.includes('.add_master')) {
        if (message.includes(bot.username)) {
            save.masters.push(username)
            bot.chat('Added ' + username + ' to masters')
        }
    }

    // Kommandoer
    if (!save.masters.includes(username)) return


    if (message == '.jump') {
        bot.setControlState('jump', true)
        bot.setControlState('jump', false)
    }
})

bot.once('spawn', () => {
    mineflayerViewer(bot, { port: login_info.view_port, firstPerson: login_info.first_person })


    loop = () => {
        // loopy thingy
        

        setTimeout(loop, 50)
    }
    loop()
})


process.stdin.resume()

function exitHandler(options, exitCode) {
    writeFileSync('save.json', JSON.stringify(save, 0, 4, true))

    if (options.cleanup) console.log('clean')
    if (exitCode || exitCode === 0) console.log(exitCode)
    if (options.exit) process.exit()
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}))

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}))

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}))
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}))

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}))