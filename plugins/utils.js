// Chandler Utilities
// Core Features/Functions
// Added to main Bot object.

const Moment = require('moment')

module.exports = (Bot) => {

  Bot.booted = false

  Bot.no = ['off', 'false', 'disable']
  Bot.yes = ['on', 'true', 'enable']

  Bot.sleep = require("util").promisify(setTimeout)
  Bot.when = time => Moment(time).fromNow()

  Bot.byID = (id) => { return el => el.id == id }
  Bot.byName = (name) => { return el => el.name == name }

  Bot.log = (message) => {
    console.info(message)
    // Always print logs in console
    // If Server mode, print in channel
    if (Bot._logger) Bot._logger.send(message)
  }

  Bot.findCommand = (cmd) => {
    return Bot.commands[cmd] || Bot.commands[Bot.aliases[cmd]]
  }

  Bot.parseEmbed = (str) => {
    try {
      let obj = JSON.parse(str)
      return obj.embed ? obj : { embed: obj }
    }
    catch(e) { return false }
  }

  Bot.stripIDs = (str) => {
    if (str.indexOf('<') == 0) {
      let trim = str.indexOf('@&') == 1 ? 3 : 2
      return str.substring(trim, str.length - 1)
    } else return str
  }

  Bot.verifyAccess = (msg, modsID) => {
    const member = msg.member
    if (msg.member.user.id == Bot.conf.owner) return 9
    if (msg.member.user.id == msg.member.guild.ownerID) return 7
    if (msg.member.hasPermission('ADMINISTRATOR')) return 5
    if (msg.memeber.roles.has(modsID)) return 3
    return 1
  }

  Bot.verifyUser = (msg, data) => {
    let user = msg.guild.members.get(Bot.stripIDs(data))
    if (!user) user = msg.guild.members.find(Bot.byName(data))
    return user
  }

  Bot.verifyChannel = (msg, data) => {
    let chan = msg.guild.channels.get(Bot.stripIDs(data))
    if (!chan) chan = msg.guild.channels.find(Bot.byName(data))
    return chan
  }

  Bot.verifyRole = (msg, data) => {
    let role = msg.guild.roles.get(Bot.stripIDs(data))
    if (!role) role = msg.guild.roles.find(Bot.byName(data))
    return role
  }

}