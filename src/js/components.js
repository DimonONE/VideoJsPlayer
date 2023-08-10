const speechSoundIcon = require('../source/svg/icon-speech-sound.svg');
const addToDictionaryIcon = require('../source/svg/icon-like.svg');
const nextPlayIcon = require("../source/svg/icon-next-play.svg");
const playlistPlayerIcon = require("../source/svg/icon-playlist-player.svg");
const arrowLeftIcon = require("../source/svg/icon-arrow-left.svg");
const arrowRightIcon = require("../source/svg/icon-arrow-right.svg");
const { toggleSubtitle, resizeSubtitle, checkedItem, textSelectItem } = require('./functions');

const isMobile = window.outerWidth < 480


const qualityButtonComponent = ({videoPlayer, qualityButtonWrapper}) => {
  const settingsQuality = [ '720', '420', 'auto']
  const controlBar = videoPlayer.controlBar;

  qualityButtonWrapper.className = 'vjs-resolution-button-wrapper vjs-menu-button vjs-menu-button-popup vjs-control vjs-button';
  controlBar.el().appendChild(qualityButtonWrapper);

  const qualityMenu = document.createElement('div');
  qualityMenu.className ='vjs-menu vjs-hidden'

  const qualityMenuUl = document.createElement('ul');
  qualityMenuUl.role='menu'
  qualityMenuUl.className ='vjs-menu-content'
  qualityMenu.appendChild(qualityMenuUl);
  
  settingsQuality.forEach((_, i) => {
    const qualityMenuLi = document.createElement('li');
    qualityMenuLi.className ='vjs-menu-item'
    const qualityItemText = document.createElement('span');
    qualityItemText.className ='vjs-menu-item-text'
    qualityItemText.innerHTML = settingsQuality[i]
    qualityMenuLi.appendChild(qualityItemText);
    qualityMenuUl.appendChild(qualityMenuLi);

    qualityMenuLi.addEventListener('click', function() {
        console.log('qualityMenuUl', qualityMenuUl);

      Array.from(qualityMenuUl).forEach((quality) => {
        quality.classList?.remove('vjs-selected')
      })
      qualityMenuLi.classList.add('vjs-selected')
    });
  });

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

const textTranslate = () => {
  const textTrackElement = document.getElementsByClassName('vjs-text-track-display');
  if (textTrackElement.length) {
    const textTrackCues = textTrackElement[0].getElementsByClassName('vjs-text-track-cue');

    if (textTrackCues.length) {
      const punctuationRegex = /([.,!?])|\s+/g;

       Array.from(textTrackCues).forEach((track) => {
        const textTrack = track.getElementsByTagName('div')[0];
        const text = textTrack.innerHTML;
        const words = text.split(punctuationRegex).filter((word) => word !== undefined);
        const isDuplicate = text.includes('class="word"');
        if (!isDuplicate) {
          const wordContainers = words.map((word) => {
            const trimmedWord = word.trim();
            const hasPunctuation = /[.,!?'"`]/.test(trimmedWord.slice(-1));

            if (hasPunctuation) {
              return `${trimmedWord} `;
            } else {

              return wordContainer({trimmedWord});
            }
          });

          textTrack.innerHTML = wordContainers.join('');
        }
      });
    }
  }
};

const subtitlesComponent = ({videoPlayer}) => {
  const selectSubtitlesButton = videoPlayer.controlBar.addChild('button', {
    className: 'vjs-subtitles-button vjs-menu-button vjs-menu-button-popup vjs-control vjs-button'
  });

  const controlText = selectSubtitlesButton.el().getElementsByClassName('vjs-control-text')[0]
  
  // Select default language => en
  const controlSubtitlesText = localStorage.getItem('subtitles-control-text') || 'en'
  controlText.innerHTML = controlSubtitlesText ? controlSubtitlesText : 'OFF'  

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
  resizeSubtitle({videoPlayer, isMobile})

  selectSubtitlesTooltip.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  selectSubtitlesButton.on(isMobile ? 'touchstart' :'click', function(event) {
    const isToggle = isMobile ? event.target === selectSubtitlesButton.el().querySelector('.vjs-control-text') : true

    if (isToggle) {
      const isTooltipHidden = selectSubtitlesTooltip.classList.contains('vjs-hidden');
      selectSubtitlesButton.el().classList.toggle('active', isTooltipHidden);
      selectSubtitlesTooltip.classList.toggle('vjs-lock-showing', isTooltipHidden);
      selectSubtitlesTooltip.classList.toggle('vjs-hidden', !isTooltipHidden);
    }
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
    menuItem.classList.add(`vjs-menu-item-${key}`);
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
      <span class="lng">${value}</span>
       <sup>${key}</sup>
    `.replace(/\s+/g, ' ');
    subtitlesMenu.appendChild(menuItem);

    menuItem.addEventListener(isMobile ? 'touchstart' : 'click', () => {
      checkedItem(menuItem, checkboxItem)

      const selectedItem = Array.from(subtitlesMenu.getElementsByClassName('vjs-menu-item')).map((item) => ({
        name: item.querySelector('.lng').innerHTML?.toLowerCase(),
        isChecked: item.getAttribute('aria-checked') === 'true' 
      }));

      const selectedItemLength = selectedItem.filter(item => item.isChecked).length
      const isChecked = menuItem.classList.contains('vjs-selected');
      
      textSelectItem({selectedItemLength, isChecked, selectedItem, controlText, value})
      toggleSubtitle({videoPlayer, language: value.toLowerCase(), toggle: isChecked})
    });

    menuItem.appendChild(checkboxItem);
  });
  
  // Select default language => en
  const controlSubtitlesTextChecked = localStorage.getItem('subtitles-control-text-checked') || 'en'
  Array.from(subtitlesMenu.getElementsByClassName('vjs-menu-item')).forEach((menuItem) => {
    const value = menuItem.querySelector('.lng')?.innerHTML.toLowerCase()
    const isChecked = controlSubtitlesTextChecked?.includes(value)
    const checkboxItemElement = menuItem.getElementsByClassName('checkbox-item')[0]

    if (isChecked && checkboxItemElement) {
      checkedItem(menuItem, checkboxItemElement)
    }
  });
}

const nextButtonComponent = (videoPlayer, callback) => {
  const nextButton = videoPlayer.controlBar.addChild('button', {
    className: 'vjs-next-button vjs-control vjs-button',
    type: "button",
    title:"Next"
  });

  const svgContainer = document.createElement('div')
  svgContainer.classList.add('svg-container')
  svgContainer.innerHTML = nextPlayIcon
  nextButton.el().appendChild(svgContainer)
  nextButton.el().getElementsByClassName('vjs-control-text')[0].innerHTML = 'Next'
  nextButton.on(isMobile ? 'touchstart' :'click', () => {
    if (callback) callback()
  })
}

const seasonComponent = ({videoPlayer, videojs, seriesData, title, seasonPrev, seasonNext}) => {
  const season = videojs.dom.createEl('div', {
    className: 'vjs-title-wrapper vjs-menu-button vjs-menu-button-popup vjs-control vjs-button has-menu',
  });

  const menuButton = videoPlayer.controlBar.addChild('button', {
    className: 'vjs-next-button vjs-control vjs-button vjs-title-control vjs-menu-button',
    type: "button",
  });

  const controlText = menuButton.el().getElementsByClassName('vjs-control-text')[0]
  controlText.innerHTML = 'S01E01 Slumber Party Panic'

  const svgContainer = document.createElement('div')
  svgContainer.className = 'svg-container';
  svgContainer.innerHTML = playlistPlayerIcon

  menuButton.el().appendChild(controlText)
  menuButton.el().appendChild(svgContainer)
  season.appendChild(menuButton.el()); 
  
  const seasonMenu = document.createElement('div');
  seasonMenu.className ='vjs-menu vjs-hidden'

  const menuTitle = document.createElement('div');
  menuTitle.className ='vjs-menu-title'
  menuTitle.innerHTML = title || 'Season 1'

  const bottomLine = document.createElement('div');
  bottomLine.className ='bottom-line'
  
  const seasonControl = document.createElement('div');
  seasonControl.className ='season-control'

  //content
  const menuContent = document.createElement('div');
  menuContent.classList.add('vjs-menu-content')

  const changeSeasonPane = document.createElement('div');
  changeSeasonPane.className ='season-pane js-resize-height js-scrollbar ps-container ps-theme-default'

  seriesData.forEach(({name, href}) => {
    const series = document.createElement('a');
    series.setAttribute('href', href)
    series.innerHTML = name
    changeSeasonPane.appendChild(series)
  })
  menuContent.appendChild(changeSeasonPane)

  // bottom buttons
  if (seasonPrev?.title && seasonPrev?.onClick) {
    const changeSeasonPrev = document.createElement('span');
    changeSeasonPrev.className ='js-change-season prev'
    changeSeasonPrev.setAttribute('data-target', 'prev')
    changeSeasonPrev.innerHTML = `${arrowLeftIcon}<span>${seasonPrev.title}</span>`
    seasonControl.appendChild(changeSeasonPrev)

    changeSeasonPrev.addEventListener('click', () => {
      seasonPrev.onClick()
    })
  }

  if (seasonNext?.title && seasonNext?.onClick) {
    const changeSeasonNext = document.createElement('span');
    changeSeasonNext.className ='js-change-season next'
    changeSeasonNext.setAttribute('data-target', 'next')
    changeSeasonNext.innerHTML = `<span>${seasonNext.title}</span>${arrowRightIcon}`
    seasonControl.appendChild(changeSeasonNext)

    changeSeasonNext.addEventListener('click', () => {
      seasonNext.onClick()
    })
  }

  season.appendChild(seasonMenu); 
  seasonMenu.appendChild(menuTitle)
  seasonMenu.appendChild(menuContent)
  bottomLine.appendChild(seasonControl)
  seasonMenu.appendChild(bottomLine)

  menuButton.on(isMobile ? 'touchstart' : 'click', function() {
    const isTooltipHidden = seasonMenu.classList.contains('vjs-hidden');
    seasonMenu.classList.toggle('vjs-lock-showing', isTooltipHidden);
    seasonMenu.classList.toggle('vjs-hidden', !isTooltipHidden);
    season.classList.toggle('active', isTooltipHidden)
  });

  videoPlayer.controlBar.el().appendChild(season);
};

const playerHelper = ({videoPlayer}) => {
  const playerHelp = document.createElement('div')
  playerHelp.id = 'player-help'

  playerHelp.innerHTML = `
    <div class="container-title">
      <h4>Player controls</h4> 
      <button class="close"></button>
    </div>
    <div class="keyboard">
      <p>enter — toggle fullscreen</p>
      <p>space — toggle playback</p>
      <p>T — translate subtitle cue</p>
      <p>H — player controls reference</p>
      <p>А — auto-start next episode</p>
      <p>P — auto-pause on tab navigation</p>
      <p>C — show/hide controls</p>
      <p>S — toggle subtitles</p>
      <p>1,2...9 — toggle subtitle language</p>
      <p>SHIFT + F  —  search other subtitle</p>
      <p>- (minus) — decrease subtitle size</p>
      <p>= (equal) — increase subtitle size</p>
      <p>← — back to previous cue or for 5 sec.</p>
      <p>→ — forward to next cue or for 5 sec.</p>
      <p>SHIFT + ← or SHIFT + → — subtitle timing</p>
      <p>SHIFT + &lt; or SHIFT + &gt; — change playback rate</p>
    </div>
  `
  videoPlayer.el().appendChild(playerHelp);

  const helpButton = videoPlayer.controlBar.addChild('button', {
    className: 'vjs-help-button'
  });

  helpButton.on(isMobile ? 'touchstart' : 'click', () => {
    playerHelp.classList.toggle('active');
  })

  const closeButton = playerHelp.querySelector('.container-title .close')
  closeButton.addEventListener(isMobile ? 'touchstart' : 'click', () => {
    playerHelp.classList.toggle('active');
  })
}

module.exports = {
  wordContainer,
  textTranslate,
  qualityButtonComponent,
  nextButtonComponent,
  subtitlesComponent, 
  seasonComponent,
  playerHelper
}