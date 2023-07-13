const { getTranslateWorld } = require("./utils");

const translateWorld = async ({wordContainerElements, word}) => {

  const { wordTranslate, textVersion } = await getTranslateWorld({word, targetLanguage: 'ru'})  

  if (wordTranslate) {
    const loadingElement  = wordContainerElements.getElementsByClassName('tooltip_loading')[0]
    const tooltipContent  = wordContainerElements.getElementsByClassName('tooltip_content')[0]
    loadingElement.style.display = 'none'
    tooltipContent.style.display = 'block'

    const tooltip = wordContainerElements.querySelector('.tooltip')
    const translationVersion = document.createElement('div')

    const translation = wordContainerElements.querySelector('.tooltip .translation')
    translation.innerHTML = wordTranslate
    
    for (let i = 0; i < textVersion.length; i++) {
      translationVersion.className = 'translation_version'
      translationVersion.innerHTML = `<span class="part_of_speech">${textVersion[i].synonym}</span><span class="text_version">${textVersion[i].text}</span>`
      tooltip.appendChild(translationVersion)
    }
  }

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