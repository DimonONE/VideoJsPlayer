const speechSoundIcon = require('../source/svg/icon-speech-sound.svg');
const addToDictionaryIcon = require('../source/svg/add-to-dictionary.svg');

const qualityButtonComponent = ({videoPlayer, qualityButtonWrapper}) => {
  const controlBar = videoPlayer.controlBar;
  const settingsQuality = [ '720', '420', 'auto']

  qualityButtonWrapper.className = 'vjs-resolution-button-wrapper vjs-menu-button vjs-menu-button-popup vjs-control vjs-button';
  controlBar.el().appendChild(qualityButtonWrapper);

  const qualityMenu = document.createElement('div');
  qualityMenu.className ='vjs-menu vjs-hidden'

  const qualityMenuUl = document.createElement('ul');
  qualityMenuUl.role='menu'
  qualityMenuUl.className ='vjs-menu-content'
  qualityMenu.appendChild(qualityMenuUl);

  for (let i = 0; i < settingsQuality.length; i++) {
    const qualityMenuLi = document.createElement('li');
    qualityMenuLi.className ='vjs-menu-item'
    const qualityItemText = document.createElement('span');
    qualityItemText.className ='vjs-menu-item-text'
    qualityItemText.innerHTML = settingsQuality[i]
    qualityMenuLi.appendChild(qualityItemText);
    qualityMenuUl.appendChild(qualityMenuLi);
  }

  // quality following button
  const qualityButton = document.createElement('button');
  qualityButton.className ='vjs-resolution-button vjs-menu-button vjs-menu-button-popup vjs-button'
  qualityButtonWrapper.appendChild(qualityMenu);

  qualityButton.addEventListener('click', function() {
    const tooltip = qualityButtonWrapper.querySelector('.vjs-menu');
    const isTooltipHidden = tooltip.classList.contains('vjs-hidden');

    tooltip.classList.add(isTooltipHidden ? 'vjs-lock-showing' : 'vjs-hidden');
    tooltip.classList.remove(isTooltipHidden ?'vjs-hidden' : 'vjs-lock-showing');
  });

  qualityButtonWrapper.appendChild(qualityButton);
}

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
  wordContainer,
  qualityButtonComponent
}