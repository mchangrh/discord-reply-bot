const eyes = ['^', 'U', ';;']
const oEyes = ['o', 'O', 'Ó', 'Õ', '๏', 'ʘ', '°', '゜', '𝐨', '𝐎', '𝙊', 'σ', 'ø', 'Ø', '𝕠', '𝕆', '𝔬', '𝖔', '𝒪', '𝓞', '\u006f\u0332']
const symbolEyes = ['♥', '✧', '☆', '@', '◕', '◔', 'ᅌ', 'Ꭷ', '⓪']
const mouth = ['w', '𝓌', '𝔀', '𝕨', '𝐰', '𝙬', '𝔴', '𝖜', 'ω', 'ᗯ', 'ᵕ', '꒳', 'Ꮗ', '\u0077\u0332', '\u0077\ufe20']
const enclosure = [['(', ')'], ['(。', '。)'], ['ღ(', 'ღ)'], ['', '']]

const randElement = (array) => array[Math.floor(Math.random() * array.length)]

const randomFactory = (elements) => () => randElement(elements)

const randEyeFactory = randomFactory([...eyes, ...oEyes, ...symbolEyes])
const randMouthFactory = randomFactory(mouth)
const randEnclosureFactory = randomFactory(enclosure)

const owoFactory = (eyesFactory, mouthFactory, enclosureFactory) => () => {
  let eye = eyesFactory()
  let mouth = mouthFactory()
  let enclosure = enclosureFactory()
  return `${enclosure[0]}${eye}${mouth}${eye}${enclosure[1]}`
}

const owoRandom = owoFactory(randEyeFactory, randMouthFactory, randEnclosureFactory)

module.exports = { owoRandom, owoFactory }
