const { readFileSync, writeFileSync } = require('fs')

const login_info = JSON.parse(readFileSync('login_info.json'))

const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

const Combat = require('./combat.js')
const Tools = require('./tools.js')


const bot = mineflayer.createBot({
    host: login_info.host,  // optional
    port: login_info.port,  // optional
    username: login_info.username,  // email and password are required only for
    password: login_info.password,  // online-mode=true servers
    version: login_info.version,    // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
    auth: login_info.auth   // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
})


bot.on('chat', function (username, message) {
    if (username === bot.username) return
    bot.chat(Combat.say_hello())
})

bot.once('spawn', () => {
  mineflayerViewer(bot, { port: login_info.view_port, firstPerson: login_info.first_person })
})


// Log errors and kick reasons:
bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
bot.on('error', err => console.log(err))