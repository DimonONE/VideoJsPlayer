const { getTranslateWorlds } = require("./utils");
const whiteCheckedIcon = require("../source/svg/white-checked.svg");

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

const translateWorld = async ({wordContainerElements, word}) => {
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
  }

  // Play audio in tooltip
  const translationDictionary = wordContainerElements.getElementsByClassName('translation_dictionary')[0];
  translationDictionary.addEventListener('click', () => {
    const audioElement = translationDictionary.getElementsByClassName('translation-audio')[0]
    audioElement.play()
  })
}

let resizeLocalState = null
const resizeSubtitle = ({ videoPlayer, defaultSize = 1.3}) => {
  const subtitleSizeStore = localStorage.getItem('subtitle-size')
  resizeLocalState = Number(subtitleSizeStore)

  const updateFontSize = (delta, reload) => {
    const subtitles = document.querySelectorAll('.video-js .vjs-text-track-display .vjs-text-track-cue > div');
    if (subtitles) {
      subtitles.forEach(subtitle => {
        const currentFontSize = parseFloat(subtitle.style.fontSize) || (resizeLocalState || defaultSize);
        const newFontSize = currentFontSize + delta;
        subtitle.style.fontSize = `${newFontSize}em`;
        resizeLocalState = newFontSize

        if (reload) {
          localStorage.setItem('subtitle-size', +newFontSize)
        }
      });
    }
  };

  const subtitleDec = videoPlayer.el().querySelector('.font-size-control .js-dec');
  const subtitleInc = videoPlayer.el().querySelector('.font-size-control .js-inc');

  subtitleDec.addEventListener('click', () => {
    updateFontSize(-0.1, true);
  });

  subtitleInc.addEventListener('click', () => {
    updateFontSize(0.1, true);
  });

  videoPlayer.on('texttrackchange', () => {
    updateFontSize(0); 
  });
};


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
  checkboxItem.innerHTML = isChecked ? `${whiteCheckedIcon}` : '';
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
  console.log('event.code', event.code);
  if (event.code === 'Space') {
    if (videoPlayer.paused()) {
      videoPlayer.play();
    } else {
      videoPlayer.pause();
    }
  } 
}

const playerControls = ({videoPlayer}) => {
   document.addEventListener('keydown', function(event) {
    rewindVideo(event, videoPlayer)
    soundAdjustment(event, videoPlayer)
    toggleFullscreen(event, videoPlayer)
    togglePlayback(event, videoPlayer)
  });
}


module.exports = {
  translateWorld,
  playerControls,
  addSubtitles,
  toggleSubtitle,
  resizeSubtitle,
  checkedItem,
}