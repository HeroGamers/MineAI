const Item = require("prismarine-item")("1.16");

class Logger {
    constructor(bot, log, mineflayer) {
        // Log errors and kick reasons:
        bot.on('kicked', (reason, loggedIn) => log(reason, loggedIn))
        bot.on('error', err => log(err))

        // Log messages
        bot.on('chat', function (username, message) {
            if (username === bot.username) return // så er det botten
            log("%c[Message] %c<"+username+"> " + message, "color: green", "color: white")
        })

        // Log health and stuff
        bot.on('death', () => log("I'm dead."))
        bot.on('health', () => log("Health changed."))

        // Bot player changes
        bot.on('heldItemChanged', function(heldItem) {
            if (heldItem) {
                log("[Bot] New held item(s): " + heldItem.name + " (x" + heldItem.count + ")")
            }
        })
        bot.on('playerCollect', function(collector, collected) {
            if (collected.type === 'object') {
                if (collector === bot.entity) {
                    // The bot collected a new item
                    var rawItem = collected.metadata[7]
                    var item = Item.fromNotch(rawItem)
                    log("[Bot] Picked up new item(s): " + item.name + " (x" + item.count + ")")
                }
                else {
                    // Another entity picked up an item?
                }
            }
        })
        var priorPosition = null
        bot.on('move', () => {
            if (priorPosition === null) {
                priorPosition = bot.entity.position
            }

            var currentPosition = bot.entity.position

            if (priorPosition.distanceTo(currentPosition) > 1) {
                priorPosition = currentPosition
                log("[Bot] Moved to " + currentPosition)
            }
        })

        // Gamesense
        bot.on('blockBreakProgressEnd', (block) => log("[GameSense] Block break progress end: " + block.name))
        bot.on('diggingCompleted', (block) => log("[GameSense] Block was broken: " + block.name))
        bot.on('blockBreakProgressObserved', (block, destroyStage) => log("[GameSense] Block is being broken: " + block.name + " ("+destroyStage+"/9)"))
    }
}


module.exports = Logger