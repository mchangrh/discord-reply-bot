'use strict'

const {
  DEFAULT_SCHEMAS,
  validate
} = require('../validation.js')
const reallyLongPhrase = '`Hi Yes Im Sure I Want To Do This I Understand The Consequences Do It Now`'
const secretPhrase = 'ILoveL85'

module.exports = async (message, args, flags, config) => {
  const argSchema = {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 2
  }

  validate(args, argSchema)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  // check if phrase is correct and secret phrase is correct
  if (args && args[0] === reallyLongPhrase.replace(/ /g, '').replace(/`/g, '') && args[1] === secretPhrase) {
    // start cleaning
    const startmsg = await message.channel.send('deleting your messages')
    try {
      // fetch messages
      const messages = await message.channel.fetchMessages()

      // filter messages
      const botRelatedMessages = messages.filter((msg) => {
        // Delete all messages by author
        return msg.author === message.author
      })

      // delete messages
      const deletedMessages = await message.channel.bulkDelete(botRelatedMessages, true)
      const toDelete = await message.channel.send(`Deleted ${deletedMessages.size} shameful messages`)
      startmsg.delete(config.autoDeleteDelay)
      return toDelete.delete(config.autoDeleteDelay)
    } catch (err) {
      console.error(err)
    }
  } else {
    const msg1 = await message.channel.send('this command wipes your messages. If you\'re sure you want to do this:')
    const msg2 = await message.channel.send('resend with this phrase: ' + reallyLongPhrase + ' but without spaces')
    const msg3 = await message.channel.send('followed by the secret code from the admins')
    msg1.delete(config.autoDeleteDelay * 5)
    msg2.delete(config.autoDeleteDelay * 5)
    msg3.delete(config.autoDeleteDelay * 5)
  }
}
