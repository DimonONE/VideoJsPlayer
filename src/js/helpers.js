function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function resizeEventListener({divElement}) {
  const rectLeft = divElement.getBoundingClientRect().x; 
  const rectWidth = divElement.getBoundingClientRect().width; 

  if (rectLeft < 0) {
    divElement.style.left = '0'; 
  } else if((rectLeft + rectWidth) > window.innerWidth) {
    divElement.style.right = '20px'; 
    divElement.style.left = 'auto'; 
  }
}

module.exports = {
  resizeEventListener,
  debounce
}