const { default: videojs } = require("video.js");
const { qualityButtonComponent, nextButtonComponent, subtitlesComponent, seasonComponent, textTranslate, playerHelper } = require("./components");
const { translateWorld, addSubtitles, toggleSubtitle, playerControls } = require("./functions");
const { resizeEventListener } = require("./helpers");

const videoPlayer = videojs('video-player', {
    playbackRates: [0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.25, 1.50, 2.00],
    textTrackDisplay: {
      allowMultipleShowingTracks: true
    }
});

const closeButton = document.getElementById('video-close-button');
videoPlayer.on("userinactive", function() {
  closeButton.style.opacity = '0'
});

videoPlayer.on("useractive", function() {
  closeButton.style.opacity = '1'
});

// Video controls
playerControls({videoPlayer})

// Rounding of speed values to 2 decimal places
const menuItemText = document.querySelectorAll('.vjs-playback-rate .vjs-menu-item-text')
for (let i = 0; i < menuItemText.length; i++) {
  const speedToFixed = Number(menuItemText[i].innerHTML.slice(0, -1)).toFixed(2)
  menuItemText[i].innerHTML = speedToFixed;  
}

let following = false
const playbackRateButton = videoPlayer.controlBar.getChild('PlaybackRateMenuButton');
playbackRateButton.on('click', function() {
  const tooltip = playbackRateButton.el().querySelector('.vjs-menu');
  tooltip.classList.add(!following ? 'vjs-lock-showing' : 'vjs-hidden');
  tooltip.classList.remove(!following ? 'vjs-hidden' : 'vjs-lock-showing');
  following ^= true
});

// on blur speed/quality/subtitles 
document.addEventListener('click', function(event) {
  const target = event.target;
  const isPlaybackRateButton = target.closest('.vjs-playback-rate');
  const isPlaybackResolutionButton = target.closest('.vjs-resolution-button-wrapper');
  const isPlaybackSubtitlesButton = target.closest('.vjs-subtitles-button');
  const isPlaybackSeasonButton = target.closest('.vjs-title-wrapper.vjs-menu-button');
  if (!isPlaybackRateButton) {
    following = false
  }
  
  if (!isPlaybackSubtitlesButton) {
    const element = videoPlayer.controlBar.el().querySelector('.vjs-subtitles-button .vjs-menu');
    element.classList.add('vjs-hidden');
    element.classList.remove('vjs-lock-showing');
  }

  if (!isPlaybackSeasonButton) {
    const element = videoPlayer.controlBar.el().querySelector('.vjs-title-wrapper.vjs-menu-button');
    const menu = element.querySelector('.vjs-menu');
    element.classList.toggle('active', false)
    menu.classList.add('vjs-hidden');
    menu.classList.remove('vjs-lock-showing');
  }

  if (!isPlaybackResolutionButton) {
    const element = qualityButtonWrapper.querySelector('.vjs-resolution-button-wrapper .vjs-menu');
    element.classList.add('vjs-hidden');
    element.classList.remove('vjs-lock-showing');
  }
});

// Create a custom component for the quality switch button
const qualityButtonWrapper = document.createElement('div');
qualityButtonComponent({videoPlayer, qualityButtonWrapper})


// // Custom translate visuals
videoPlayer.on('timeupdate', function() {
  textTranslate()
});


// Hover effect in word
let wordIdHash
videoPlayer.on('timeupdate', function() {
  const wordContainerElements = document.getElementsByClassName('word-container');
  if(wordContainerElements.length) {
    for (let i = 0; i < wordContainerElements.length; i++) {
      wordContainerElements[i].addEventListener('mouseenter', function() {
        const word = wordContainerElements[i].getElementsByClassName('word')[0].innerHTML
        const isDuplicate = wordIdHash === `${word}-${i}`
        const isAlreadyTranslated = wordContainerElements[i].getElementsByClassName('translation')[0].innerHTML
        wordContainerElements[i].classList.add('active')

        if (!isDuplicate ) {
          if (!isAlreadyTranslated) {
            translateWorld({wordContainerElements: wordContainerElements[i], word})
            wordIdHash = `${word}-${i}`
          }
          
          // Fix output tooltip beyond the screen
          const divElement = wordContainerElements[i].getElementsByClassName('tooltip')[0];
          resizeEventListener({divElement})
        }

      });

      wordContainerElements[i].addEventListener('mouseleave', function() {
        wordContainerElements[i].classList.remove('active')
        wordIdHash = ''
      });
    }
  }
});


// Helper
playerHelper({videoPlayer})


let isFirstLoad = true;
const subtitleInitialize = (tracks) => {
  videoPlayer.on('loadedmetadata', function() {
    if (isFirstLoad) {
      tracks.forEach(track => {
        addSubtitles({
          videoPlayer,
          src: track.src,
          srclang: track.srclang,
          label: track.label,
          default: track?.default
        });
      });
   
      const controlSubtitlesTextChecked = localStorage.getItem('subtitles-control-text-checked')
      controlSubtitlesTextChecked.split('+').forEach(language => {
        toggleSubtitle({videoPlayer, language, toggle: true})
      });
      isFirstLoad = false;
    }
  });
}

// Season initialize 
const seasonInitialize = ({title, seasonPrev , seasonNext, seriesData}) => {
  seasonComponent({videoPlayer, videojs, seriesData, title, seasonPrev , seasonNext})
}

// Subtitles button 
subtitlesComponent({videoPlayer})

// Next button
const nextButton = (callback) => {
  nextButtonComponent(videoPlayer, callback)
}

// test
const tracks =[
  {
    src: 'http://localhost:3001/Black.Mirror.S01E01.WEB.DL.x264-ITSat_1503952150_720p.vtt',
    srclang: 'en',
    label: 'English',
    default: true
  },
  {
    src: 'http://localhost:3001/Black.Mirror.S01E01.WEB.DL.x264-ITSat_1503952150_720p-2.vtt',
    srclang: 'ru',
    label: 'Russian',
  }
]
subtitleInitialize(tracks)

const seriesData = [{name: 'Pilot', href: ''}]
const seasonPrev = {
  title: 'Season 1',
  onClick: () => false
}

const seasonNext = {
  title: 'Season 3',
  onClick: () => false
}
seasonInitialize({title: 'Season 2', seriesData, seasonPrev, seasonNext})
nextButton(() => alert('Next'))

module.exports = {
  nextButton,
  subtitleInitialize,
  seasonInitialize
}