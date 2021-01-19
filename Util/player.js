const { log } = console

class Player {
    constructor(bot) {
        this.bot = bot
        this.log_ids = [37, 38, 39, 40, 41, 42, 45, 46, 47, 48, 49, 50]
        this.plank_ids = [15, 16, 17, 18, 19, 20, 21, 22]
    }

    getInventoryWindow() {
        return this.bot.inventory
    }

    getCraftingTable() {
        var inventory = this.getInventoryWindow()
        if (inventory.count(183) >= 1) {
            return ["inventory", inventory.findInventoryItem(183, null)]
        }
        var craftingBlock = this.bot.findBlock({
            matching: [183],
            maxDistance: 6
        })
        if (craftingBlock) {
            return ["block", craftingBlock]
        }
        return null
    }

    craftCraftingTable() {
        log("Trying to craft a crafting table...")

        var craftingTableRecipe = this.bot.recipesFor(183, null, null, null)

        if (craftingTableRecipe.length >= 1) {
            this.bot.craft(craftingTableRecipe[0], null, null, () => {
                log("Done crafting!")
            })
        }
        else {
            log("Could not craft a crafting table...")
        }
    }

    getWindowWood(window) {
        //* Returns an array with amount of logs total and amount of planks total, *//
        var logs = 0
        var planks = 0

        for (var log_id in this.log_ids) {
            logs = logs + window.count(log_id)
        }
        for (var plank_id in this.plank_ids) {
            planks = planks + window.count(plank_id)
        }

        return [logs, planks]
    }

    craftPlanks(amount=64) {
        log("Trying to craft planks x" + amount.toString() + "...")
        //* Crafts an x amount of planks, if possible *//
        // round down amount to fit
        amount = Math.floor(amount/4)*4

        let inventoryWindow = this.getInventoryWindow()
        var planks = 0
        var recipes = []

        for (var i = 0; i < this.log_ids.length; i++) {
            var log_count = inventoryWindow.count(this.log_ids[i])
            if (log_count >= 1) {
                var plankRecipe = null
                switch (this.log_ids[i]) {
                    case 37:
                    case 45:
                        plankRecipe = this.bot.recipesFor(15, null, null, null)[0]
                        break
                    case 38:
                    case 46:
                        plankRecipe = this.bot.recipesFor(16, null, null, null)[0]
                        break
                    case 39:
                    case 47:
                        plankRecipe = this.bot.recipesFor(17, null, null, null)[0]
                        break
                    case 40:
                    case 48:
                        plankRecipe = this.bot.recipesFor(18, null, null, null)[0]
                        break
                    case 41:
                    case 49:
                        plankRecipe = this.bot.recipesFor(19, null, null, null)[0]
                        break
                    case 42:
                    case 50:
                        plankRecipe = this.bot.recipesFor(20, null, null, null)[0]
                        break
                    default:
                        break
                }
                var planks_with_log = inventoryWindow.count(this.log_ids[i])*4
                if (planks_with_log+planks >= amount) {
                    planks_with_log = Math.floor((amount-planks)/4)*4
                    planks = planks + planks_with_log
                    if (planks_with_log > 0) {
                        recipes.push([planks_with_log/4, plankRecipe])
                    }
                    break
                }
                else {
                    planks = planks + planks_with_log
                    recipes.push([planks_with_log/4, plankRecipe])
                }
            }
        }
        if (planks) {
            var i = 0

            log("Crafting planks x" + planks.toString() + "...")
            var doCraft = () => {
                if (i < recipes.length) {
                    this.bot.craft(recipes[i][1], recipes[i][0], null, () => {
                        i++
                        doCraft()
                    })
                }
            }
            doCraft()
        }
        else {
            log("Not enough wood to craft planks...")
            this.bot.chat("I don't have enough wood to craft planks!")
        }
    }

    hasPickaxe(type) {
        let inventoryWindow = this.getInventoryWindow()
        switch (type) {
            case "netherite":
                return inventoryWindow.count(608) >= 1
            case "diamond":
                return inventoryWindow.count(597) >= 1
            case "iron":
                return inventoryWindow.count(573) >= 1
            case "golden":
                return inventoryWindow.count(604) >= 1
            case "stone":
                return inventoryWindow.count(593) >= 1
            case "wooden":
                return inventoryWindow.count(589) >= 1
            default:
                return false
        }
    }

    craftPickaxe(type) {
        let inventoryWindow = this.getInventoryWindow()
        switch (type) {
            case "netherite":
                // todo
                break
            case "diamond":
                // todo
                break
            case "iron":
                // todo
                break
            case "golden":
                // todo
                break
            case "stone":
                // todo
                break
            case "wooden":
                // todo
                break
            default:
                break
        }
    }

    smeltOre(type) {
        switch (type) {
            case "iron":
                // todo
                break
            default:
                break
        }
    }
}


module.exports = Player