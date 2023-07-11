const speechSoundIcon = require('../source/svg/icon-speech-sound.svg');
const addToDictionaryIcon = require('../source/svg/add-to-dictionary.svg');

const wordContainer = ({trimmedWord}) => {

  const translatedText = `<p class="translated_text"><span>${trimmedWord}</span></p>`;

  const translation = `<span class="translation"></span>`;
  
  const translationDictionary = `<div class="translation_dictionary translation_dictionary_image added" title="In dictionary">
      ${speechSoundIcon}
      <audio class="translation-audio" preload="none" src="https://ororo.tv/api/frontend/text_to_speech?locale=en&amp;message=${trimmedWord}"></audio>
    </div>`;

  const addToDictionary = `<button class="translation_dictionary_image">
      ${addToDictionaryIcon}
    </button>`;

  const content = `<span class="word">${trimmedWord}</span><span class="tooltip" style="display: none;">
    ${addToDictionary}
    ${translationDictionary}
    ${translatedText}
    ${translation}
  </span>`.replace(/\s+/g, ' ')

  return ` <span class="word-container">${content}</span>`
}


module.exports = {
  wordContainer
}