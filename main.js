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
const Combat = new _Combat(bot)
const Tools = new _Tools(bot)
const Logger = new _Logger(bot, log)


bot.on('chat', function (username, message) {
    if (username === bot.username) return // så er det botten

    if (message === '.jump') {
        bot.setControlState('jump', true)
        bot.setControlState('jump', false)
    }
})

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: login_info.view_port, firstPerson: login_info.first_person })
})
