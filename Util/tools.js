class Tools {
    constructor(bot) {
        this.bot = bot
    }

    // Eksempler

    // Getter
    get area() {
        return this.calcArea()
    }
    
    // Method
    calcArea() {
        return this.height * this.width
    }
}


module.exports = Tools