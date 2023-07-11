const { getTranslateWorld } = require("./utils");

const translateWorld = async ({wordContainerElements, word}) => {
  const res = await getTranslateWorld({word})

  const translation = wordContainerElements.querySelector('.tooltip .translation')
  translation.innerHTML = res.wordTranslate

  // Play audio in tooltip
  const translationDictionary = wordContainerElements.getElementsByClassName('translation_dictionary')[0];
  translationDictionary.addEventListener('click', () => {
    const audioElement = translationDictionary.getElementsByClassName('translation-audio')[0]
    audioElement.play()
  })
}

module.exports = {
  translateWorld
}