const speechSoundIcon = require('../source/svg/icon-speech-sound.svg');
const addToDictionaryIcon = require('../source/svg/add-to-dictionary.svg');
const whiteCheckedIcon = require("../source/svg/white-checked.svg");

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
    <span class="tooltip_loading">Loading translation...</span>
    <div class="tooltip_content">
      ${addToDictionary}
      ${translationDictionary}
      ${translatedText}
      ${translation}
    </div>
  </span>`.replace(/\s+/g, ' ')

  return ` <span class="word-container">${content}</span>`
}

const subtitlesComponent = ({videoPlayer}) => {
  const selectSubtitlesButton = videoPlayer.controlBar.addChild('button', {
    className: 'vjs-subtitles-button vjs-menu-button vjs-menu-button-popup vjs-control vjs-button'
  });

  const selectSubtitlesTooltip = document.createElement('div');
  selectSubtitlesTooltip.className ='vjs-menu vjs-hidden'

  const subtitlesMenu = document.createElement('ul');
  subtitlesMenu.role='menu'
  subtitlesMenu.className ='vjs-menu-content'

  const fontSizeControl = document.createElement('div');
  fontSizeControl.className = 'font-size-control'
  fontSizeControl.role = 'menuitem'
  fontSizeControl.innerHTML = `
    <span class="text">Subtitle size:</span>
    <div class="item js-dec">А-</div>
    <div class="item js-inc">А+</div>
  `.replace(/\s+/g, ' ')

  subtitlesMenu.appendChild(fontSizeControl);
  selectSubtitlesButton.el().appendChild(selectSubtitlesTooltip);
  selectSubtitlesTooltip.appendChild(subtitlesMenu);
  selectSubtitlesButton.el().getElementsByClassName('vjs-control-text')[0].innerHTML = 'en'

  selectSubtitlesTooltip.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  selectSubtitlesButton.on('click', function() {
    const isTooltipHidden = selectSubtitlesTooltip.classList.contains('vjs-hidden');
    selectSubtitlesButton.el().classList.toggle('active', isTooltipHidden);
    selectSubtitlesTooltip.classList.toggle('vjs-lock-showing', isTooltipHidden);
    selectSubtitlesTooltip.classList.toggle('vjs-hidden', !isTooltipHidden);
  });

  const languages = [
    {'3': 'Es'},
    {'4': 'It'},
    {'5': 'Pt'},
    {'6': 'Fr'},
    {'7': 'De'},
    {'8': 'Pl'},
    {'9': 'Tr'},
    {'0': 'Cs'},
    {'1': 'En'},
    {'2': 'Ru'},
  ]
  languages.forEach((lng) => {
    const [key, value] = Object.entries(lng)[0];
    const menuItem = document.createElement('li');
    const checkboxItem = document.createElement('span');
    checkboxItem.className = 'checkbox-item';

    menuItem.classList.add('vjs-menu-item');
    menuItem.setAttribute('role', 'menuitemradio');
    menuItem.setAttribute('tabindex', '-1');
    menuItem.setAttribute('aria-checked', 'false');
    menuItem.setAttribute('aria-disabled', 'false');

    if (key === '2' || key === '1') {
      if (key === '1') {
        const dividerItem = document.createElement('div');
        dividerItem.className = 'divider';
        subtitlesMenu.appendChild(dividerItem);
      }

      menuItem.classList.add('main-lang');
    }

    menuItem.innerHTML += `
      <span>${value}</span>
      <sup>${key}</sup>
    `.replace(/\s+/g, ' ');
    subtitlesMenu.appendChild(menuItem);

    menuItem.addEventListener('click', () => {
      const isChecked = menuItem.classList.toggle('vjs-selected');
      menuItem.setAttribute('aria-checked', isChecked ? 'true' : 'false');
      checkboxItem.innerHTML = isChecked ? `${whiteCheckedIcon}` : '';
    });
   
    menuItem.appendChild(checkboxItem);
  });
}

const nextButtonComponent = ({videoPlayer}) => {
  const nextButton = videoPlayer.controlBar.addChild('button', {
    className: 'vjs-next-button vjs-control vjs-button',
    type: "button",
    title:"Next"
  });

  nextButton.el().getElementsByClassName('vjs-control-text')[0].innerHTML = 'Next'
}


module.exports = {
  wordContainer,
  qualityButtonComponent,
  nextButtonComponent,
  subtitlesComponent
}