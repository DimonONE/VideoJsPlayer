const { setCORS } = require('google-translate-api-browser');
const translate = setCORS("http://cors-anywhere.herokuapp.com/");

const getTranslateWorld = async ({word}) => {
  const textVersion = []
  const res = await translate(word, { to: "ru" })
  console.log('res', res);
  return {textVersion, wordTranslate: res.text}
}

module.exports = {
  getTranslateWorld
}