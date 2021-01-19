const { log, table } = console
const { readFileSync, writeFileSync } = require('fs')
const login_info = JSON.parse(readFileSync('login_info.json'))
const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
var vec = require('vec3')


const bot = mineflayer.createBot({
    host: login_info.host,  // optional
    port: login_info.port,  // optional
    username: login_info.username,  // email and password are required only for
    password: login_info.password,  // online-mode=true servers
    version: login_info.version,    // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
    auth: login_info.auth   // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
})

bot.loadPlugin(pathfinder)

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


// Our command listener
let checkChat = function (username, message, source) {
    if (username === bot.username) return // så er det botten selv, der skriver

    // skriv i chat: tilføj mig som herre <navn på bot>
    if (message.toLowerCase().includes('gør mig til din herre')) {
        if (message.includes(bot.username)) {
            if (!save.masters.includes(username)) {
                save.masters.push(username)
                bot.chat('Du er nu min herre, ' + username + '.')
                writeFileSync('save.json', JSON.stringify(save, 0, 4, true))
            }
            else {
                bot.chat("Jeg er allerede din slave, min herre.")
            }
        }
        return
    }

    // Kommandoer
    if (!save.masters.includes(username)) {return}
    // Kommando prefix


    // McData og Pathfinder
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.pathfinder.setMovements(defaultMove)

    // args
    var arg1 = message.split(" ")[0].toLowerCase()
    var arg2 = "null"
    if (message.split(" ").length >= 2) {
        arg2 = message.split(" ")
        arg2.shift()
        arg2 = arg2.join(" ").toLowerCase()
    }

    switch (arg1) {
        case ".say":
            if (arg2 !== "null") {
                bot.chat(arg2)
            }
            break
        case ".save":
            log("Saving...")
            writeFileSync('save.json', JSON.stringify(save, 0, 4, true))
            break
        case ".jump":
            bot.setControlState('jump', true)
            bot.setControlState('jump', false)
            break
        case ".comehere":
            log("Trying to get to master...")
            const target = bot.players[username] ? bot.players[username].entity : null
            if (!target) {
                bot.chat("Sorry, I can't see you...")
                return
            }

            const p = target.position

            bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))

            bot.on("goal_reached", () => {
                bot.chat("I've reached your position, master.")
            })
            break
        case ".goto":
            log("Trying to reach position...")
            var position = arg2.split(" ")
            for (var i = 0; i < 3; i++) {
                try {
                    position[i] = parseFloat(position[i])
                }
                catch {
                    bot.chat("Cannot parse position!")
                    return
                }
            }

            bot.pathfinder.setGoal(new GoalNear(position[0], position[1], position[2], 1))

            bot.on("goal_reached", () => {
                bot.chat("I've reached the desired position, master.")
            })

            break
        case ".inventory":
            function itemToString (item) {
                if (item) {
                    return `${item.name} x ${item.count}`
                } else {
                    return '(nothing)'
                }
            }
            const output = bot.inventory.items().map(itemToString).join(', ')
            if (output) {
                bot.chat(output)
            } else {
                bot.chat('empty')
            }
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
}

// Listen for both whispers and chats
bot.on('chat', function (username, message) {
    checkChat(username, message, "chat")
})
bot.on('whisper', function (username, message) {
    checkChat(username, message, "whisper")
})

bot.once('spawn', () => {
    mineflayerViewer(bot, { port: login_info.view_port, firstPerson: login_info.first_person })

    // Main bot loop
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
    //     else if (!Player.getCraftingTable()) {
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