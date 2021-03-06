'use strict'

const tiny = require('tiny-json-http')
const { DEFAULT_SCHEMAS, validate } = require('./../validation.js')

module.exports = async (message, args, flags) => {
  validate(args, DEFAULT_SCHEMAS.emptyArray)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  try {
    // get insult with promise
    const { body } = await tiny.get({
      url: 'https://evilinsult.com/generate_insult.php',
      // language english
      // retrieve as json
      data: {
        lang: 'en',
        type: 'json'
      }
    })

    // send insult in embed
    return message.channel.send({
      embed: { description: JSON.parse(body).insult }
    })
  // catch error
  } catch (err) { console.error(err) }
}
