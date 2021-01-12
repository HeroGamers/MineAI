class Logger {
    // Eksempler
    constructor(bot, log) {
        // Log errors and kick reasons:
        bot.on('kicked', (reason, loggedIn) => log(reason, loggedIn))
        bot.on('error', err => log(err))

        // Log messages
        bot.on('chat', function (username, message) {
            if (username === bot.username) return // så er det botten
            log('\x1b[32m[Message]\x1b[0m%s', " <"+username+"> " + message)
        })
    }
}


module.exports = Logger