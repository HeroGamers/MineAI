class Player {
    constructor(bot) {
        this.bot = bot
    }

    getInventoryWindow() {
        return this.bot.inventory
    }

    hasCraftingTable() {

    }

    craftCraftingTable() {

    }

    getWindowWood(window) {
        //* Returns an array with amount of logs total and amount of planks total, *//
        var log_ids = [37, 38, 39, 40, 41, 42, 45, 46, 47, 48, 49, 50]
        var plank_ids = [15, 16, 17, 18, 19, 20, 21, 22]

        var logs = 0
        var planks = 0

        for (var log_id in log_ids) {
            logs = logs + window.count(log_id)
        }
        for (var plank_id in plank_ids) {
            planks = planks + window.count(plank_id)
        }

        return [logs, planks]
    }

    craftPlanks(amount) {
        //* Crafts an x amount of planks, if possible *//
        var inventoryWood = this.getWindowWood(this.getInventoryWindow())


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