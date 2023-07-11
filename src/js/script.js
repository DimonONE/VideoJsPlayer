const { default: videojs } = require("video.js");
const { wordContainer } = require("./components");
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
const controlBar = videoPlayer.controlBar;
const settingsQuality = [ '720', '420', 'auto']

const qualityButtonWrapper = document.createElement('div');
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
        wordContainerElements[i].classList.add('active')


        if (!isDuplicate) {
          translateWorld({wordContainerElements: wordContainerElements[i], word})
          wordIdHash = `${word}-${i}`
          
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







// Help button 
const helpButton = videoPlayer.controlBar.addChild('button', {
  className: 'vjs-help-button'
});
