class Logger {
    // Eksempler
    constructor() {

    }

    // Getter
    get area() {
        return this.calcArea()
    }

    // Method
    say_hello() {
        return "hello"
    }

    // Log errors and kick reasons:
    bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn))
    bot.on('error', err => console.log(err))
}


module.exports = Logger