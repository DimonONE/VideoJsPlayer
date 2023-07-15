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

const addSubtitles = async ({videoPlayer, srclang, label}) => {
  const track = {
    src: trackUrl,
    kind: captions,
    srclang,
    label
  };

  videoPlayer.addRemoteTextTrack(track, true);
}

const resizeSubtitle  = async ({videoPlayer}) => {
  const subtitleDec = videoPlayer.el().querySelector('.font-size-control .js-dec');
  const subtitleInc = videoPlayer.el().querySelector('.font-size-control .js-inc');

  subtitleDec.addEventListener('click', () => {
    const subtitle = document.querySelector('.video-js .vjs-text-track-display .vjs-text-track-cue > div');
    if (subtitle) {
      const currentFontSize = subtitle.style.fontSize || '1.3em';
      const newFontSize = Number(currentFontSize.slice(0, -2)) - 0.1; 
      subtitle.style.fontSize = `${newFontSize}em`
    }
  })

  subtitleInc.addEventListener('click', () => {
    const subtitle = document.querySelector('.video-js .vjs-text-track-display .vjs-text-track-cue > div');
    if (subtitle) {
      const currentFontSize = subtitle.style.fontSize || '1.3em';
      const newFontSize = Number(currentFontSize.slice(0, -2)) + 0.1; 
      subtitle.style.fontSize = `${newFontSize}em`
    }
  })
}

const toggleSubtitle  = async ({videoPlayer, language}) => {
  const textTracks = videoPlayer.textTracks();

  for (let i = 0; i < textTracks.length; i++) {
    const track = textTracks[i];
    // console.log('track.kind', track.kind);
    // console.log('track.label', track.label);
   
    if (track.label === language) {
      console.log('track.mode', track.mode);
      track.mode = track.mode === 'hidden' || track.mode === 'disabled' ? 'showing' : 'hidden' ;
    }
  }
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