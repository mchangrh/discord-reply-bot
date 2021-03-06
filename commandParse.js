'use strict'

function splitQuoted (original) {
  let remaining = original
  const splitStrings = []

  function addQuoted (boundMarker) {
    if (remaining.startsWith(boundMarker)) {
      let arg = remaining.substr(boundMarker.length)
      let splitIndex = arg.search(new RegExp(`(?<!\\\\)${boundMarker}`))
      if (splitIndex === -1) {
        splitIndex = arg.length
      }
      splitStrings.push({ str: arg.substr(0, splitIndex), quoted: true })
      remaining = arg.substr(splitIndex + boundMarker.length)
      if (remaining.length && remaining.search(/\s/)) {
        throw new Error(`Illegal argument format: ${original}`)
      }
      remaining = remaining.trim()
    }
  }

  while (remaining.length) {
    if (remaining.startsWith('\'')) {
      addQuoted('\'')
    } else if (remaining.startsWith('"')) {
      addQuoted('"')
    } else {
      let splitIndex = remaining.search(/\s/)
      if (splitIndex === -1) splitIndex = remaining.length
      splitStrings.push({ str: remaining.substr(0, splitIndex), quoted: false })
      remaining = remaining.substr(splitIndex + 1).trim()
    }
  }

  return splitStrings
}

module.exports = (rawMessage) => {
  const { PREFIX, FLAG_PREFIX } = process.env
  const output = {
    commandName: null,
    flags: {},
    args: []
  }

  // Check whether the message is a command
  if (!rawMessage.startsWith(PREFIX)) {
    return output
  }

  // Split quoted
  const splitStrings = splitQuoted(rawMessage)
  const commandName = (splitStrings.shift() || { str: '' }).str

  // Check for valid command
  if (commandName.length <= PREFIX.length) {
    throw new Error(`Invalid command: ${rawMessage}`)
  }

  // Build command
  output.commandName = commandName.substr(PREFIX.length)
  while (splitStrings.length && (splitStrings[0].quoted || !splitStrings[0].str.startsWith(FLAG_PREFIX))) {
    output.args.push(splitStrings.shift().str)
  }

  // Build flags
  const { flags } = splitStrings.reduce(({ lastFlag, flags }, { str, quoted }) => {
    if (str.startsWith(FLAG_PREFIX) && !quoted) {
      lastFlag = str.substr(FLAG_PREFIX.length)
      flags[lastFlag] = []
    } else {
      flags[lastFlag].push(str)
    }

    return { lastFlag, flags }
  }, { lastFlag: null, flags: {} })
  output.flags = flags

  return output
}
