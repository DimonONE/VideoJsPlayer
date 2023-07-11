require("./script");

function parseHTML() {
  console.log('testparse');
  // const dom = new JSDOM(html);
  // const document = dom.window.document;

  // // Виконайте вашу обробку HTML-коду тут

  // // Приклад: Отримати всі елементи <a> з документа
  // const links = Array.from(document.querySelectorAll('a'));
  // links.forEach((link) => {
  //   console.log(link.href);
  // });

  // // Повернути результати або виконати інші дії з вашими даними

  // // Приклад: Повернути вміст заголовка <title> документа
  // return document.querySelector('title').textContent;
}

module.exports = {
  parseHTML,
};