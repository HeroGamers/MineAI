class Logger {
    // Eksempler
    constructor(bot, log) {
        // Log errors and kick reasons:
        bot.on('kicked', (reason, loggedIn) => log(reason, loggedIn))
        bot.on('error', err => log(err))

        // Log messages
        bot.on('chat', function (username, message) {
            if (username === bot.username) return // så er det botten
            log("%c[Message] %c<"+username+"> " + message, "color: green", "color: white")
        })
    }
}


module.exports = Logger