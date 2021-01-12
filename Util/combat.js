class Combat {
    // Eksempler
    constructor(bot) {
        this.bot = bot
    }

    // Getter
    get area() {
        return this.calcArea()
    }

    // Method
    say_hello() {
        return "hello"
    }
}


module.exports = Combat