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


async function getTranslateWorld({word, targetLanguage, apiKey}) {
  if (!apiKey) throw('Not found translation API key')

  const apiUrl = 'https://translation.googleapis.com/language/translate/v2';
  const url = `${apiUrl}?q=${encodeURIComponent(word)}&target=${encodeURIComponent(
      targetLanguage
  )}&key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url);
  const data = await response.json();
  const translatedText = data.data.translations[0].translatedText;;
  
  return translatedText;
}

async function getTranslateWorlds({ word, targetLanguage = 'ru', apiKey }) {
  const textVersion = [];
  let wordTranslate = '';

  try {
    const synonyms = await getSynonyms(word)
    const trimmedSynonyms = synonyms.slice(0, 4);
    wordTranslate = await getTranslateWorld({word, targetLanguage, apiKey});

    const synonymTranslations = await Promise.all(
      trimmedSynonyms.map(async (synonym) => {
        const synonymTranslation = await getTranslateWorld({word: synonym, targetLanguage, apiKey});
        return { synonym, text: synonymTranslation };
      })
    );

    textVersion = synonymTranslations.filter((synonymTranslation, index) => {
      return index === synonymTranslations.findIndex((t) => t.text === synonymTranslation.text);
    });
  } catch (error) {
    console.error('Error translate:', error.message);
  }
  
  return { textVersion, wordTranslate };
};

module.exports = {
  getTranslateWorlds
}