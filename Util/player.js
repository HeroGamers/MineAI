const { log } = console
var vec3 = require('vec3')

class Player {
    constructor(bot) {
        this.bot = bot
        this.log_ids = [37, 38, 39, 40, 41, 42, 45, 46, 47, 48, 49, 50]
        this.plank_ids = [15, 16, 17, 18, 19, 20, 21, 22]
        this.mcData = require('minecraft-data')(bot.version)
    }

    getInventoryWindow() {
        return this.bot.inventory
    }

    getCraftingTable() {
        var craftingBlock = this.bot.findBlock({
            matching: this.mcData.blocksByName.crafting_table.id,
            maxDistance: 6,
            count: 1
        })
        if (craftingBlock) {
            return ["block", craftingBlock]
        }
        var inventory = this.getInventoryWindow()
        if (inventory.count(183) >= 1) {
            return ["inventory", inventory.findInventoryItem(183, null)]
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

        for (var i in this.log_ids) {
            logs = logs + window.count(this.log_ids[i])
        }
        for (i in this.plank_ids) {
            planks = planks + window.count(this.plank_ids[i])
        }

        return [logs, planks]
    }

    async craftPlanks(amount=64) {
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
            log("Crafting planks x" + planks.toString() + "...")
            for (var i = 0; i < recipes.length; i++) {
                await this.bot.craft(recipes[i][1], recipes[i][0], null)
            }
        }
        else {
            log("Not enough wood to craft planks...")
        }
    }

    hasPickaxe(type, cb) {
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

    placeInteractable(item, cb) {
        // get position to place it
        var blockToPlaceOn = this.bot.findBlock({
            useExtraInfo: true,
            matching: (block) => {
                if (block.type !== 0 && block.name !== "furnace" && block.name !== "crafting_table" && block.name !== "chest") {
                    if (this.bot.blockAt(block.position.offset(0, 1, 0)).type === 0) {
                        if (this.bot.canSeeBlock(block)) {
                            return block
                        }
                    }
                }
                return false
            },
            maxDistance: 6,
            count: 1
        })
        // Equip item
        this.bot.equip(item, "hand", () => {
            // place it
            this.bot.placeBlock(blockToPlaceOn, vec3(0, 1, 0), () => {
                cb(this.bot.blockAt(blockToPlaceOn.position.offset(0, 1, 0)))
            })
        })
    }

    getCraftingTableBlock() {
        let craftingTable = this.getCraftingTable()
        if (!craftingTable) {
            log("No crafting table!")
            return null
        }

        if (craftingTable[0] === "inventory") {
            this.placeInteractable(craftingTable[1], (block) => {
                return block
            })
        }
        else {
            return craftingTable[1]
        }
    }

    async craftSticks(amount=64) {
        let inventoryWindow = this.getInventoryWindow()

        let doCraft = async () => {
            log("Trying to craft sticks x" + amount.toString() + "...")
            //* Crafts an x amount of sticks, if possible *//
            // round down amount to fit
            amount = Math.floor(amount/4)*4

            if (amount < 4) {
                amount = 4
            }

            var planks = 0

            for (var i = 0; i < this.plank_ids.length; i++) {
                planks += inventoryWindow.count(this.plank_ids[i])
            }

            var max_sticks = Math.floor(planks/2)*2*4

            if (max_sticks >= 4) {
                i = 0

                if (amount > max_sticks) {
                    amount = max_sticks
                }

                var craft_times = amount/4

                const item = this.mcData.findItemOrBlockByName("stick")

                log("Crafting sticks x" + amount.toString() + "...")
                for (i = 0; i < craft_times; i++) {
                    var recipe = this.bot.recipesFor(item.id, null, 1, null)[0]
                    await this.bot.craft(recipe, 1, null)
                }
            }
            else {
                log("Not enough planks to craft sticks...")
            }
        }


        // craft sticks with planks
        if (this.getWindowWood(inventoryWindow)[1] >= 2) {
            await doCraft()
        }
        else {
            await this.craftPlanks(2)
            if (this.getWindowWood(this.getInventoryWindow())[1] >= 2) {
                await doCraft()
            }
        }
    }

    async craftPickaxe(type) {
        let inventoryWindow = this.getInventoryWindow()

        var craftingTable = this.getCraftingTableBlock()
        var doCraft = async () => {
            log("crafting pickaxe...")
            var recipe
            switch (type) {
                case "diamond":
                    if (inventoryWindow.count(this.mcData.findItemOrBlockByName("diamond").id) >= 3) {
                        recipe = this.bot.recipesFor(this.mcData.findItemOrBlockByName("diamond_pickaxe").id, null, null, craftingTable)[0]
                        await this.bot.craft(recipe, 1, craftingTable)
                    }
                    else {
                        log("Not enough diamonds")
                    }
                    break
                case "iron":
                    if (inventoryWindow.count(this.mcData.findItemOrBlockByName("iron_ingot").id) >= 3) {
                        recipe = this.bot.recipesFor(this.mcData.findItemOrBlockByName("iron_pickaxe").id, null, null, craftingTable)[0]
                        await this.bot.craft(recipe, 1, craftingTable)
                    }
                    else {
                        log("Not enough iron")
                    }
                    break
                case "golden":
                    if (inventoryWindow.count(this.mcData.findItemOrBlockByName("gold_ingot").id) >= 3) {
                        recipe = this.bot.recipesFor(this.mcData.findItemOrBlockByName("golden_pickaxe").id, null, null, craftingTable)[0]
                        await this.bot.craft(recipe, 1, craftingTable)
                    }
                    else {
                        log("Not enough gold")
                    }
                    break
                case "stone":
                    if (inventoryWindow.count(this.mcData.findItemOrBlockByName("cobblestone").id) >= 3) {
                        recipe = this.bot.recipesFor(this.mcData.findItemOrBlockByName("stone_pickaxe").id, null, null, craftingTable)[0]
                        await this.bot.craft(recipe, 1, craftingTable)
                    }
                    else {
                        log("Not enough cobblestone")
                    }
                    break
                case "wooden":
                    log("Crafting wooden pickaxe")
                    if (this.getWindowWood(inventoryWindow)[1] >= 3) {
                        recipe = this.bot.recipesFor(this.mcData.findItemOrBlockByName("wooden_pickaxe").id, null, null, craftingTable)[0]
                        await this.bot.craft(recipe, 1, craftingTable)
                    }
                    else {
                        log("Not enough planks")
                    }
                    break
                default:
                    break
            }
        }

        if (inventoryWindow.count(this.mcData.findItemOrBlockByName("stick").id) < 2) {
            await this.craftSticks(2)
            if (this.getInventoryWindow().count(this.mcData.findItemOrBlockByName("stick").id) >= 2) {
                await doCraft()
            }
        }
        else {
            await doCraft()
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

    init() {
        this.mcData = require('minecraft-data')(this.bot.version)
    }
}


module.exports = Player