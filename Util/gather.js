const { table, log } = console
const { GoalNear } = require('mineflayer-pathfinder').goals

class Gather {
    // remember to pick up crafting table if it's placed somewhere before gathering, should be done in here I guess
    constructor(bot) {
        this.bot = bot
        this.enabled = false

        this.ressources = []
        this.current_block = []



        this.bot.G_clear_ressources = () => {
            this.ressources = []
            this.bot.stopDigging()
        }


        this.bot.G_list_ressources = () => {
            for (const res of this.ressources) {
                var block = res.block
                log(`${block.name}: ${block.position}`)
            }
            log('enabled:', this.enabled)
            log('amount:', this.ressources.length)
        }


        this.bot.G_toggle_gathering = (value, max_collect) => {
            if (value == null) value = !this.enabled

            this.enabled = value
            log('enabled:', this.enabled)
        }


    }


    sheep() {

    }


    _getRessources() {
        if (!this.enabled) return false

        if (this.current || this.ressources.length == 0) return
        this.current = true

        var minDistance = 2.5
        var block = this.ressources[0].block
        var pos = block.position

        // Gå hen til block
        // Ødelæg block
        
        this.bot.chat(String(block.position))

        this.bot.pathfinder.setGoal(new GoalNear(pos.x, pos.y, pos.z, minDistance))

        this.bot.on("goal_reached", () => {
            this.bot.chat("Den skal dø!")

            // vælg det rigtige værktøj
            
            this.bot.dig(block, false, () => {
                this.bot.stopDigging()
                this.current = false
            })
            this.ressources.shift()
        })
    }


    getResource(type, amount=64) {
        log(`Gathering ${amount}x ${type}...`)
        switch (type) {
            case 'diamonds':
                break
            case 'iron':
                break
            case 'cobblestone':
                break
            case 'wood':
                /*
                1. Find det nærmeste træ
                2. Gå hen til træet
                3. Selekter økse
                4. Hak eventuelt blade væk fra træet
                5. Hak træet og samle op.
                */

                this.bot.findBlocks({
                    'point': this.bot.entity.position,
                    'useExtraInfo': true,
                    'maxDistance': 50,
                    'count': amount,
                    'matching': (block) => {
                        if (block.material == 'wood' && block.name.includes('_log')) {

                            var distance = Math.pow(Math.abs(this.bot.entity.position.x - block.position.x), 2)
                            distance += Math.pow(Math.abs(this.bot.entity.position.y - block.position.y), 2)
                            distance += Math.pow(Math.abs(this.bot.entity.position.z - block.position.z), 2)
                            distance = Math.sqrt(distance)

                            // find den længste
                            var max_dist = -1
                            for (var bl of this.ressources) {
                                if (bl.distance > max_dist || max_dist == -1 ) {
                                    max_dist = bl.distance
                                }
                            }

                            if (distance < max_dist || max_dist == -1) {
                                var bl = {
                                    'block': block,
                                    'distance': distance
                                }
                                this.ressources.push(bl)
                            }


                            // Fjern den største
                            if (this.ressources.length > amount) {
                                max_dist = -1
                                var index = 0
                                for (var bl of this.ressources) {
                                    if (bl.distance > max_dist || max_dist == -1 ) {
                                        max_dist = bl.distance
                                    }
                                    index += 1
                                }

                                this.ressources.splice(index, 1)
                            }
                        }
                    }
                })



                break
            default:
                break
        }
    }
}


module.exports = Gather