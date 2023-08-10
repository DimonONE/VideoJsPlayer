const { getTranslateWorlds } = require("./utils");
const checkedIcon = require("../source/svg/icon-checked.svg");

const tooltipContainsSynonym = (tooltip, synonym) => {
  const translationVersions = tooltip.querySelectorAll('.translation_version');
  for (const version of translationVersions) {
    const partOfSpeechElement = version.querySelector('.part_of_speech');
    if (partOfSpeechElement && partOfSpeechElement.textContent === synonym) {
      return true;
    }
  }
  return false;
}

const translateWorld = async ({wordContainerElements, word, isMobile}) => {
  const { wordTranslate, textVersion } = await getTranslateWorlds({
    word,
    targetLanguage: 'ru',
    apiKey: 'AIzaSyBo3oWEmnNgLg4UDrYpG7f5qUmrbYSKY7A'
  })  

  if (wordTranslate) {
    const loadingElement  = wordContainerElements.getElementsByClassName('tooltip_loading')[0]
    const tooltipContent  = wordContainerElements.getElementsByClassName('tooltip_content')[0]
    loadingElement.style.display = 'none'
    tooltipContent.style.display = 'block'

    const tooltip = wordContainerElements.querySelector('.tooltip')

    const translation = wordContainerElements.querySelector('.tooltip .translation')
    translation.innerHTML = wordTranslate

    for (let i = 0; i < textVersion.length; i++) {
      const synonym = textVersion[i].synonym;
      if (tooltipContainsSynonym(tooltip, synonym)) {
        continue; // Skip adding this synonym to avoid duplicates
      }

      // If the synonym does not exist, add the translationVersion block
      const translationVersion = document.createElement('div');
      translationVersion.className = 'translation_version';
      translationVersion.innerHTML = `<span class="part_of_speech">${synonym}</span><span class="text_version">${textVersion[i].text}</span>`;
      tooltip.appendChild(translationVersion);
    }

    // Fix position subtitles on Mobile
    if (isMobile) {
      const tooltipHeight = tooltip.offsetHeight
      const wordHeight = wordContainerElements.getElementsByClassName('word')[0].offsetHeight
      tooltip.style.marginTop = `${-tooltipHeight - wordHeight}px`
    }
  }

  // Play audio in tooltip
  const translationDictionary = wordContainerElements.getElementsByClassName('translation_dictionary')[0];
  translationDictionary.addEventListener(isMobile ? 'touchstart' : 'click', () => {
    const audioElement = translationDictionary.getElementsByClassName('translation-audio')[0]
    audioElement.play()
  })
}

const resize = ({subtitles, delta, reload, defaultSize, resizeLocalState, isPriorityItems}) => {

  subtitles.forEach(subtitle => {
    const priority = subtitle.classList.contains('vjs-text-track-cue-en')
    const subtitleDiv = subtitle.querySelector('div')
    const subtitleSizeStore = localStorage.getItem('subtitle-size')
    resizeLocalState = Number(subtitleSizeStore)

    if (priority || !isPriorityItems.length) {
      subtitle.classList.add('vjs-text-track-cue-priority')
    } 
    
    if (!priority) {
      resizeLocalState -= 0.3
    } 

    const currentFontSize = parseFloat(subtitleDiv.style.fontSize) || (parseFloat(resizeLocalState) || defaultSize);
    const newFontSize = (currentFontSize + delta).toFixed(1);

    subtitleDiv.style.fontSize = `${newFontSize}em`;
    resizeLocalState = newFontSize

    if (reload) {
      localStorage.setItem('subtitle-size', +newFontSize)
    }
  });
};

let resizeLocalState = null
const resizeSubtitle = ({ videoPlayer, isMobile, defaultSize = 1.3}) => {
  const updateFontSize = (delta, reload) => {

    const subtitlesMenu = document.querySelector('.vjs-subtitles-button .vjs-menu-content') 
    const selectedItem = Array.from(subtitlesMenu.getElementsByClassName('vjs-menu-item'));
    const isPriorityItems = selectedItem.filter(item => item.querySelector('.lng').innerHTML === 'En' && item.getAttribute('aria-checked') === 'true')

    const subtitles = document.querySelectorAll('.video-js .vjs-text-track-display .vjs-text-track-cue');
    if (subtitles) {
      resize({subtitles, delta, reload, defaultSize, resizeLocalState, isPriorityItems})
    }
  };

  const subtitleDec = videoPlayer.el().querySelector('.font-size-control .js-dec');
  const subtitleInc = videoPlayer.el().querySelector('.font-size-control .js-inc');

  subtitleDec.addEventListener(isMobile ? 'touchstart' :'click', () => {
    updateFontSize(-0.1, true);
  });

  subtitleInc.addEventListener(isMobile ? 'touchstart' :'click', () => {
    updateFontSize(0.1, true);
  });

  videoPlayer.on('texttrackchange', () => {
    updateFontSize(0); 
  });
};

let controlTextChecked = ''
const textSelectItem = ({selectedItemLength, isChecked, selectedItem, controlText, value}) => {
  const subtitlesCheckedText = selectedItem.filter(item => item.isChecked).map(item => item.name).join('+')

  if (selectedItemLength) {
    if (selectedItemLength > 2) {
      controlTextChecked = `${isChecked 
          ? value 
          : selectedItem.filter(item => item.isChecked && item.name !== value)[0].name}+${selectedItemLength-1}
        `.replace(/\s+/g, '')
    } else {
    controlTextChecked = subtitlesCheckedText
    }
  } else {
      controlTextChecked = `OFF`
  }

  controlText.innerHTML = controlTextChecked
  localStorage.setItem('subtitles-control-text', controlTextChecked === 'OFF' ? '' : controlTextChecked)
  localStorage.setItem('subtitles-control-text-checked', subtitlesCheckedText)
}


const addSubtitles = ({ videoPlayer, src, srclang, label, ...props }) => {
  videoPlayer.addRemoteTextTrack({
    kind: 'subtitles',
    src: src,
    srclang,
    label,
    ...props
  });
};

const toggleSubtitle = ({ videoPlayer, language, toggle }) => {
  const tracks = videoPlayer.textTracks();

  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].language === language) {
      tracks[i].mode = toggle ? 'showing' : 'hidden';
    }
  }
};

const checkedItem = (menuItem, checkboxItem) => {
  const isChecked = menuItem.classList.toggle('vjs-selected');

  menuItem.setAttribute('aria-checked', isChecked ? 'true' : 'false');
  checkboxItem.innerHTML = isChecked ? `${checkedIcon}` : '';
}


const rewindVideo = async (event, videoPlayer) => {
  const rewindTime = 5; 
  if (event.code === 'ArrowLeft') {
    event.preventDefault();
    videoPlayer.currentTime(videoPlayer.currentTime() - rewindTime);
  } else if (event.code === 'ArrowRight') {
    event.preventDefault();
    videoPlayer.currentTime(videoPlayer.currentTime() + rewindTime);
  }
}

const soundAdjustment = async (event, videoPlayer) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    videoPlayer.volume(videoPlayer.volume() + 0.1);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    videoPlayer.volume(videoPlayer.volume() - 0.1);
  }
}

const toggleFullscreen = async (event, videoPlayer) => {
  if (event.code === 'Enter') {
    if (videoPlayer.isFullscreen()) {
      videoPlayer.exitFullscreen();
    } else {
      videoPlayer.requestFullscreen();
    }
  } 
}

const togglePlayback = async (event, videoPlayer) => {
  if (event.code === 'Space') {
    if (videoPlayer.paused()) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  } 
}

const changeSubtitleBind = async (event, videoPlayer) => {
  const numItem = event.code.slice(-1);
  const digit = Array.from({ length: 10 }, (_, i) => `Digit${i}`);

  if (digit.includes(event.code)) {
    const menuItem = document.getElementsByClassName(`vjs-menu-item-${numItem}`)[0]
    const value = menuItem.getElementsByClassName('lng')[0].innerHTML
    const checkboxItem = menuItem.getElementsByClassName(`checkbox-item`)[0]
    const subtitlesMenu = document.querySelector('.vjs-subtitles-button .vjs-menu-content') 
    const selectedItem = Array.from(subtitlesMenu.getElementsByClassName('vjs-menu-item')).map((item) => ({
      name: item.querySelector('.lng').innerHTML?.toLowerCase(),
      isChecked: value.toLowerCase() === item.querySelector('.lng').innerHTML?.toLowerCase() 
      ?  item.getAttribute('aria-checked') !== 'true' 
      : item.getAttribute('aria-checked') === 'true'
    }));
    const isChecked = menuItem.classList.contains('vjs-selected');
    const selectedItemLength = selectedItem.filter(item => item.isChecked).length
    const selectSubtitlesButton = document.querySelector('.vjs-subtitles-button.vjs-menu-button') 
    const controlText = selectSubtitlesButton.getElementsByClassName('vjs-control-text')[0]

    checkedItem(menuItem, checkboxItem)
    toggleSubtitle({videoPlayer, language: value.toLowerCase(), toggle: !isChecked})
    textSelectItem({selectedItemLength, isChecked: !isChecked, selectedItem, controlText, value})
  }
  
}

const playerControls = ({videoPlayer}) => {
   document.addEventListener('keydown', function(event) {
    rewindVideo(event, videoPlayer)
    soundAdjustment(event, videoPlayer)
    toggleFullscreen(event, videoPlayer)
    togglePlayback(event, videoPlayer)
    changeSubtitleBind(event, videoPlayer)
  });
}


module.exports = {
  translateWorld,
  playerControls,
  addSubtitles,
  toggleSubtitle,
  resizeSubtitle,
  checkedItem,
  textSelectItem
}