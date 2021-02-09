const { table, log } = console
var vec3 = require('vec3')

class Miner {
	constructor(bot) {
		this.bot = bot
		console.log(this.bot.entity.position)
		this.mcData = require('minecraft-data')(bot.version);
		console.log("running")
	}

	mine() {
		console.log("mine", this.bot.entity.position)
		var fallingBlocks = [28, 29]
		function fallingBlockFix(block, placeBlock) {
			this.bot.dig(block, true, (err) => {
				this.bot.placeBlock(placeBlock, vec3(0, 1, 0), (err) => {
					if (err) {
						fallingBlockFix(block, placeBlock)
					} else {
						mine()
					}
				})
			})
		}
		var block0 = this.bot.blockAt(this.bot.entity.position.offset(0, 1, 1))
		var block1 = this.bot.blockAt(this.bot.entity.position.offset(0, 0, 1))
		var block2 = this.bot.blockAt(this.bot.entity.position.offset(0, -1, 1))
		var mbySand = this.bot.blockAt(this.bot.entity.position.offset(0, 2, 1))
		var curretYVal = this.bot.entity.position.y
		if (curretYVal < 14) {
			this.bot.chat("i am at level 13 now :))")
		} else if (fallingBlocks.includes(mbySand.type)) {
			fallingBlockFix(mbySand, block0)
		} else {
			this.bot.dig(block0, true, (err) => {
				this.bot.dig(block1, true, (err) => {
					this.bot.dig(block2, true, (err) => {
						this.bot.setControlState('forward', true)
						var amIHere = setInterval(checkpos, 10)

						function checkpos() {
							if (this.bot.entity.position.y === curretYVal - 1) {
								clearInterval(amIHere);
								this.bot.clearControlStates();
								setTimeout(function() {
									mine()
								}, 100);
							}
						}
					})
				})
			})
		}
	}


	getResource(ore, amount=64) {
		log(`Gathering ${amount}x ${type}...`)
		switch (type) {
			case 'diamonds':
			case 'iron':
			case 'stone':
			case 'cobblestone':
				this.mine()
				break
			default:
				break
		}
	}
}

module.exports = Miner