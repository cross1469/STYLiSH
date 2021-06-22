let cartList = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

function handleCartNumForCartPage() {
  const headerCartNum = document.querySelector('.cart__header .title span');
  document.querySelectorAll('.qty').forEach(qty => {
    const num = cartList.length;
    if (num) {
      headerCartNum.textContent = `(${num})`;
      qty.innerHTML = num;
    } else {
      headerCartNum.textContent = `(0)`;
      qty.innerHTML = 0;
    }
  });
}

function getCartProducts() {
  cartList.forEach(item => {
    products.push({
      name: `${item.title}`,
      id: `${item.id}`,
      color: `顏色：${item.color.name}`,
      size: `尺寸：${item.size}`,
      imgURL: `${item.main_image}`,
      qty: `${item.qty}`,
      price: `${item.price}`,
      stock: `${item.stock}`,
    });
  });
}

function calculateCartTotal() {
  const total = document.querySelector('.subtotal .value span');
  const totalfee = document.querySelector('.total .value span');
  let amount = 0;
  if (cartList.length > 0) {
    cartList.forEach(product => {
      amount += parseInt(product.price, 10) * parseInt(product.qty, 10);
    });
    total.innerHTML = amount;
    totalfee.innerHTML = parseInt(total.innerHTML, 10) + 60;
  } else {
    total.innerHTML = '0';
    totalfee.innerHTML = '0';
    document.querySelector('.freight .value span').textContent = '0';
  }
}

function registerModifyQTY() {
  const selects = document.querySelectorAll('.item__quantity select');
  for (let i = 0; i < selects.length; i += 1) {
    // eslint-disable-next-line no-loop-func
    selects[i].addEventListener('change', e => {
      const sub = document.querySelectorAll('.item__subtotal')[i + 1];
      cartList[i].qty = e.currentTarget.selectedIndex + 1;
      localStorage.setItem('cart', JSON.stringify(cartList));
      sub.lastChild.textContent = `NT. ${parseInt(cartList[i].qty, 10) *
        parseInt(cartList[i].price, 10)}`;
      calculateCartTotal();
    });
  }
}

function registerDeleteProduct() {
  const removes = document.querySelectorAll('.item__remove');
  for (let i = 1; i < removes.length; i += 1) {
    // eslint-disable-next-line no-loop-func
    removes[i].addEventListener('click', () => {
      alert('已從購物車中移除');
      cartList.splice(i - 1, 1);
      localStorage.setItem('cart', JSON.stringify(cartList));
      cartList = JSON.parse(localStorage.getItem('cart'));
      document.querySelector('.items').innerHTML = '';
      products = [];
      // eslint-disable-next-line no-use-before-define
      handleCartList();
    });
  }
}

function renderCartListData() {
  getCartProducts();
  const items = document.querySelector('.items');
  products.forEach(product => {
    const item = document.createElement('div');
    let opt;
    item.setAttribute('class', 'item');

    for (let i = 1; i <= product.stock; i += 1) {
      if (parseInt(product.qty, 10) === i) {
        opt += `<option value="${i}" selected>${i}</option>`;
      } else {
        opt += `<option value="${i}">${i}</option>`;
      }
    }

    item.innerHTML += `
        <img
            src="${product.imgURL}"
            class="item__image"
        />
        <div class="item__detail">
            <div class="item__name">${product.name}</div>
            <div class="item__id">${product.id}</div>
            <div class="item__color">${product.color}</div>
            <div class="item__size">${product.size}</div>
        </div>
        <div class="item__quantity">
            <div class="mobile-text">數量</div>
            <select>${opt}</select>
        </div>
            <div class="item__price">
            <div class="mobile-text">單價</div>
            NT.${product.price}
        </div>
        <div class="item__subtotal">
            <div class="mobile-text">小計</div>
            NT.${product.price * product.qty}
        </div>
        <div class="item__remove">
            <img src="./images/cart-remove.png"/>
        </div>
    `;

    items.appendChild(item);
  });
  registerModifyQTY();
  registerDeleteProduct();
}

function handleCartList() {
  if (cartList.length > 0) {
    handleCartNumForCartPage();
    renderCartListData();
    calculateCartTotal();
  } else {
    document.querySelector('.items').innerHTML = '<h3>購物車空空的耶</h3>';
    document.querySelector('.checkout').setAttribute('disabled', 'true');
    handleCartNumForCartPage();
    calculateCartTotal();
  }
}

handleCartList();
