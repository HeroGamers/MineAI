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
const _Gather = require('./Util/gather.js')
const _Player = require('./Util/player.js')
const Combat = new _Combat(bot)
const Tools = new _Tools(bot)
const Logger = new _Logger(bot)
const Gather = new _Gather(bot)
const Player = new _Player(bot)

var save = {
    masters: []
}
try {
    save = JSON.parse(readFileSync('./save.json'))
} catch (err) {}


bot.on('chat', function (username, message) {
    if (username === bot.username) return // så er det botten selv, der skriver

    if (message.includes('.add_master')) {
        if (message.includes(bot.username)) {
            save.masters.push(username)
            bot.chat('Added ' + username + ' to masters')
        }
    }

    // Kommandoer
    if (!save.masters.includes(username)) return

    var arg1 = message.split(" ")[0].toLowerCase()
    var arg2 = "null"
    if (message.split(" ").length >= 2) {
        arg2 = message.split(" ")[1].toLowerCase()
    }

    switch (arg1) {
        case ".jump":
            bot.setControlState('jump', true)
            bot.setControlState('jump', false)
            break
        case ".get":
            switch (arg2) {
                case "diamond":
                    Gather.getResource("diamonds", 64)
                    break
                case "iron":
                    Gather.getResource("iron", 64)
                    break
                case "cobblestone":
                    Gather.getResource("cobblestone", 64)
                    break
                case "stone":
                    Gather.getResource("cobblestone", 64)
                    break
                case "wood":
                    Gather.getResource("wood", 64)
                    break
                default:
                    break
            }
            break
        case ".craft":
            switch (arg2) {
                case "ironpickaxe":
                    Player.craftPickaxe("iron")
                    break
                case "diamondpickaxe":
                    Player.craftPickaxe("diamond")
                    break
                case "woodenpickaxe":
                    Player.craftPickaxe("wooden")
                    break
                case "stonepickaxe":
                    Player.craftPickaxe("stone")
                    break
                case "craftingtable":
                    Player.craftCraftingTable()
                    break
                case "planks":
                    Player.craftPlanks()
                    break
                default:
                    break
            }
            break
        default:
            break
    }
})

bot.once('spawn', () => {
    mineflayerViewer(bot, { port: login_info.view_port, firstPerson: login_info.first_person })

    // Main bot loop
    //
    // loop = () => {
    //     var inventoryWindow = Player.getInventoryWindow()
    //     var inventoryWood = Player.getWindowWood(inventoryWindow)
    //
    //     // If inventory is full
    //     if (inventoryWindow.emptySlotCount() <= 1) {
    //         // Throw out crap or put in chest if possible
    //         log("Inventory is full.")
    //     }
    //     // If less than 30 wood logs in the inventory
    //     else if (inventoryWood[0] < 32) {
    //         // gather wood
    //         Gather.getResource('wood', 64-inventoryWood[0])
    //     }
    //     // We have wood, check for planks?
    //     else if (inventoryWood[1] < 32) {
    //         Player.craftPlanks(64-inventoryWood[1])
    //     }
    //     // We have planks, check for crafting table, either in inventory or near the bot
    //     else if (!Player.hasCraftingTable()) {
    //         Player.craftCraftingTable()
    //     }
    //     // If has enough diamonds for diamondpickaxe, craft that
    //     else if (inventoryWindow.count(581) >= 3) {
    //         Player.craftPickaxe('diamond')
    //     }
    //     // Check for a netherite, diamond or iron pickaxe first - since if we have those we can just go straight back to mining diamonds :)
    //     else if (Player.hasPickaxe('netherite') || Player.hasPickaxe('diamond') || Player.hasPickaxe('iron')) {
    //         Gather.getResource('diamonds', 1) // gather 1, if everything else checks out after next loop we can just pick up another :)
    //     }
    //     // Check for iron for iron pickaxe, if we have that craft it
    //     else if (inventoryWindow.count(582) >= 3) {
    //         Player.craftPickaxe('iron')
    //     }
    //     // Check for iron ore, if have it, smelt it (if we have cobble that is ahahah)
    //     else if (inventoryWindow.count(34) >= 3) {
    //         Player.smeltOre('iron')
    //     }
    //     // Since we don't have any iron, we gotta get that hehe, check for stone pickaxe
    //     else if (Player.hasPickaxe('stone')) {
    //         Gather.getResource('iron', 64-inventoryWindow.count(34))
    //     }
    //     // No stone pickaxe? Well, let's craft that - if we have cobblestone that is haha
    //     else if (inventoryWindow.count(14) >= 3) {
    //         Player.craftPickaxe('stone')
    //     }
    //     // No cobble? Let's fix that - check for shitty wooden pickaxe
    //     else if (Player.hasPickaxe('wooden')) {
    //         Gather.getResource('cobblestone',3)
    //     }
    //     // Craft wooden pickaxe
    //     else {
    //         Player.craftPickaxe('wooden')
    //     }
    //
    //     // Loop forever :D
    //     setTimeout(loop, 50)
    // }
    // loop()
})


process.stdin.resume()

function exitHandler(options, exitCode) {
    log("Exit handler running...")
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