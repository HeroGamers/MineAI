class Gather {
    // remember to pick up crafting table if it's placed somewhere before gathering, should be done in here I guess
    constructor(bot) {
        this.bot = bot
    }

    sheep() {

    }

    getResource(type, amount=64) {
        switch (type) {
            case 'diamonds':
                break
            case 'iron':
                break
            case 'cobblestone':
                break
            case 'wood':
                break
            default:
                break
        }
    }
}


module.exports = Gather