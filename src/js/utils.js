const { setCORS } = require('google-translate-api-browser');
const translate = setCORS("http://localhost:8000/");

async function getSynonyms(word) {
  try {
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}`)
    const data = await response.json();
    const synonyms = data.map(entry => entry.word);
    return synonyms;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

const getTranslateWorld = async ({ word, targetLanguage = 'ru' }) => {
  const textVersion = [];
  let wordTranslate = '';

  try {
    const translation = await translate(word, { to: targetLanguage });
    const synonyms = await getSynonyms(word)
    
    wordTranslate = translation.text;
    const trimmedSynonyms = synonyms.slice(0, 4);

    const synonymTranslations = await Promise.all(
      trimmedSynonyms.map(async (synonym) => {
        const synonymTranslation = await translate(synonym, { to: targetLanguage });
        return { synonym, text: synonymTranslation.text };
      })
    );

    for (const synonymTranslation of synonymTranslations) {
      if (!textVersion.some((item) => item.text === synonymTranslation.text)) {
        textVersion.push(synonymTranslation);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }

  return { textVersion, wordTranslate };
};

module.exports = {
  getTranslateWorld
}