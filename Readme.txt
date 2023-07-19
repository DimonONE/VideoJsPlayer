Readme File
Introduction
This repository contains a set of functions designed to enhance the functionality of a video player. These functions provide convenient features for navigating through seasons, episodes, and subtitles. Read on to learn more about each function and how to use them.

const tracks =[
  {
    src: 'http://localhost:3000/Black.Mirror.S01E01.WEB.DL.x264-ITSat_1503952150_720p.vtt',
    srclang: 'en',
    label: 'English',
    default: true
  },
  {
    src: 'http://localhost:3000/Black.Mirror.S01E01.WEB.DL.x264-ITSat_1503952150_720p-2.vtt',
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