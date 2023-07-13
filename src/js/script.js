const { default: videojs } = require("video.js");
const { wordContainer, qualityButtonComponent, nextButtonComponent } = require("./components");
const { translateWorld } = require("./functions");
const { resizeEventListener } = require("./helpers");

const videoPlayer = videojs('video-player', {
    playbackRates: [0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.25, 1.50, 2.00]
});

const closeButton = document.getElementById('video-close-button');
videoPlayer.on("userinactive", function() {
  closeButton.style.opacity = '0'
});

videoPlayer.on("useractive", function() {
  closeButton.style.opacity = '1'
});

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

// on blur speed and quality button
document.addEventListener('click', function(event) {
  const target = event.target;
  const isPlaybackRateButton = target.closest('.vjs-playback-rate');
  const isPlaybackResolutionButton = target.closest('.vjs-resolution-button-wrapper');
  if (!isPlaybackRateButton) {
    following = false
  }
  if (!isPlaybackResolutionButton) {
    const tooltip = qualityButtonWrapper.querySelector('.vjs-resolution-button-wrapper .vjs-menu');

    tooltip.classList.add('vjs-hidden');
    tooltip.classList.remove('vjs-lock-showing');
  }
});

// Create a custom component for the quality switch button
const qualityButtonWrapper = document.createElement('div');
qualityButtonComponent({videoPlayer, qualityButtonWrapper})


// Custom translate visuals
videoPlayer.on('timeupdate', function() {
  const textTrackElement = document.getElementsByClassName('vjs-text-track-display');
  if (textTrackElement.length) {
    const textTrackCues = textTrackElement[0].getElementsByClassName('vjs-text-track-cue');

    if (textTrackCues.length) {
      const punctuationRegex = /([.,!?])|\s+/g;
      const textTrack = textTrackCues[0].getElementsByTagName('div')[0];
      const text = textTrack.innerHTML;
      const words = text.split(punctuationRegex).filter((word) => word !== undefined);
      const isDuplicate = text.includes('class="word"');

      if (!isDuplicate) {
        const wordContainers = words.map((word, index) => {
          const trimmedWord = word.trim();
          const hasPunctuation = /[.,!?]/.test(trimmedWord.slice(-1));

          if (hasPunctuation) {
            return `${trimmedWord} `;
          } else {

            return wordContainer({trimmedWord});
          }
        });

        textTrack.innerHTML = wordContainers.join('');
      }
    }
  }
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


// Subtitles button 
const selectSubtitlesButton = videoPlayer.controlBar.addChild('button', {
  className: 'vjs-subtitles-button vjs-menu-button vjs-menu-button-popup vjs-control vjs-button'
});

const selectSubtitlesTooltip = document.createElement('div');
selectSubtitlesTooltip.className ='vjs-menu vjs-hidden'

const subtitlesMenu = document.createElement('div');
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

selectSubtitlesButton.on('click', function() {
  console.log('click');

  const isTooltipHidden = selectSubtitlesTooltip.classList.contains('vjs-hidden');

  selectSubtitlesTooltip.classList.add(isTooltipHidden ? 'vjs-lock-showing' : 'vjs-hidden');
  selectSubtitlesTooltip.classList.remove(isTooltipHidden ?'vjs-hidden' : 'vjs-lock-showing');
});


// Help button 
const helpButton = videoPlayer.controlBar.addChild('button', {
  className: 'vjs-help-button'
});


function nextButton() {
  nextButtonComponent({videoPlayer})
}

nextButton()

module.exports = {
  nextButton
}