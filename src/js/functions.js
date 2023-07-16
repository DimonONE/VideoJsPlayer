const { getTranslateWorlds } = require("./utils");
const whiteCheckedIcon = require("../source/svg/white-checked.svg");

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

const rewindVideo = async ({videoPlayer}) => {
  document.addEventListener('keydown', function(event) {
    const rewindTime = 1; 

    if (event.code === 'ArrowLeft') {
      event.preventDefault();
      videoPlayer.currentTime(videoPlayer.currentTime() - rewindTime);
    } else if (event.code === 'ArrowRight') {
      event.preventDefault();
      videoPlayer.currentTime(videoPlayer.currentTime() + rewindTime);
    }
  });
}

const soundAdjustment = async ({videoPlayer}) => {
  document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      videoPlayer.volume(videoPlayer.volume() + 0.1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      videoPlayer.volume(videoPlayer.volume() - 0.1);
    }
  });
}

let resizeLocalState = null
const resizeSubtitle = ({ videoPlayer, defaultSize = 1.3}) => {
  const subtitleSizeStore = localStorage.getItem('subtitle-size')
  resizeLocalState = Number(subtitleSizeStore)

  const updateFontSize = (delta, reload) => {
    const subtitle = document.querySelector('.video-js .vjs-text-track-display .vjs-text-track-cue > div');
    if (subtitle) {
      const currentFontSize = parseFloat(subtitle.style.fontSize) || (resizeLocalState || defaultSize);
      const newFontSize = currentFontSize + delta;
      subtitle.style.fontSize = `${newFontSize}em`;
      resizeLocalState = newFontSize

      if (reload) {
        localStorage.setItem('subtitle-size', +newFontSize)
      }
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

const addSubtitles = ({videoPlayer, src, srclang, label}) => {
  videoPlayer.addRemoteTextTrack({
    kind: 'subtitles',
    src: src,
    srclang,
    label,
  });
}

const toggleSubtitle = async ({videoPlayer, language}) => {
  addSubtitles({
    videoPlayer,
    src: 'http://localhost:3000/Black.Mirror.S01E01.WEB.DL.x264-ITSat_1503952150_720p.vtt',
    srclang: 'en',
    label: 'English',
    default: true
  })

  addSubtitles({
    videoPlayer,
    src: 'http://localhost:3000/Black.Mirror.S01E01.WEB.DL.x264-ITSat_1503952150_720p-2.vtt',
    srclang: 'ru',
    label: 'Russian',
  })


   const tracks = videoPlayer.textTracks();
  for (let i = 0; i < tracks.length; i++) {
    tracks[i].mode = 'showing';
  }
  console.log('tracks', tracks);

}

const checkedItem = (menuItem, checkboxItem) => {
  const isChecked = menuItem.classList.toggle('vjs-selected');
  menuItem.setAttribute('aria-checked', isChecked ? 'true' : 'false');
  checkboxItem.innerHTML = isChecked ? `${whiteCheckedIcon}` : '';
}

module.exports = {
  translateWorld,
  rewindVideo,
  soundAdjustment,
  addSubtitles,
  toggleSubtitle,
  resizeSubtitle,
  checkedItem
}