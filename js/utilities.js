const cartImg = document.querySelector('.cartImg');
const cartList = JSON.parse(localStorage.getItem('cart')) || [];

// eslint-disable-next-line no-unused-vars
function cartHover() {
  cartImg.addEventListener('mouseover', () => {
    this.setAttribute('src', './images/cart-hover.png');
  });

  cartImg.addEventListener('mouseout', () => {
    this.setAttribute('src', './images/cart.png');
  });
}

// eslint-disable-next-line no-unused-vars
function handleCartNum() {
  document.querySelectorAll('.qty').forEach(qty => {
    const num = cartList.length;
    if (num) {
      // eslint-disable-next-line no-param-reassign
      qty.innerHTML = num;
    }
  });
}
