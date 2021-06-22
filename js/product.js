let productColor = '';
let productSize = '';
let data;
let variants;
let variant;

function getProductStock(colorCode, size) {
  return variants.find(item => item.color_code === colorCode && item.size === size).stock;
}

function renderSelectedVariants() {
  document.querySelectorAll('.product__color').forEach(color => {
    if (color.getAttribute('id') === variant.colorCode) {
      color.classList.add('product__color--selected');
    } else {
      color.classList.remove('product__color--selected');
    }
  });
  document.querySelectorAll('.product__size').forEach(size => {
    size.classList.remove('product__size--selected');
    size.classList.remove('product__size--disabled');
    if (size.textContent === variant.size) {
      size.classList.add('product__size--selected');
    } else if (getProductStock(variant.colorCode, size.textContent) === 0) {
      size.classList.add('product__size--disabled');
    }
  });
  document.querySelector('.quantity').textContent = variant.qty;
}

function preSelectVariant() {
  for (let i = 0; i < variants.length; i += 1) {
    if (variants[i].stock > 0) {
      variant = {
        colorCode: variants[i].color_code,
        size: variants[i].size,
        qty: 1,
      };
      break;
    }
  }
  renderSelectedVariants();
}

function addProductToCart() {
  const addToCart = document.querySelector('.add-to-cart');
  addToCart.addEventListener('click', event => {
    event.preventDefault();

    const selectedColor = document.querySelector('.product__color--selected');
    const selectedId = document.querySelector('.product__id');
    const selectedMainImage = document.querySelector('.product__main-image');
    const selectedTitle = document.querySelector('.product__title');
    const selectedPrice = document.querySelector('.product__price');
    const selectedQTY = document.querySelector('.quantity');
    const selectedSize = document.querySelector('.product__size--selected');
    const maxStock = getProductStock(selectedColor.getAttribute('id'), selectedSize.textContent);
    const item = {
      color: {
        code: selectedColor.getAttribute('id'),
        name: selectedColor.dataset.name,
      },
      id: parseInt(selectedId.textContent, 10),
      main_image: selectedMainImage.getAttribute('src'),
      title: selectedTitle.textContent,

      price: parseInt(selectedPrice.textContent.slice(4), 10),
      qty: parseInt(selectedQTY.textContent, 10),
      size: selectedSize.textContent,
      stock: maxStock,
    };

    let index;
    // eslint-disable-next-line no-undef
    if (cartList.length > 0) {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < cartList.length; i += 1) {
        if (
          // eslint-disable-next-line no-undef
          cartList[i].color.code === item.color.code &&
          // eslint-disable-next-line no-undef
          cartList[i].size === item.size &&
          // eslint-disable-next-line no-undef
          cartList[i].id === item.id
        ) {
          index = i;
        }
      }
      if (index >= 0) {
        // eslint-disable-next-line no-undef
        cartList[index].qty = item.qty;
      } else {
        // eslint-disable-next-line no-undef
        cartList.push(item);
      }
    } else {
      // eslint-disable-next-line no-undef
      cartList.push(item);
    }

    // eslint-disable-next-line no-undef
    localStorage.setItem('cart', JSON.stringify(cartList));
    alert('已加入購物車');
    // eslint-disable-next-line no-undef
    handleCartNum();
  });
}

function handleColorChange(event) {
  const color = event.currentTarget.getAttribute('id');
  variant.colorCode = color;
  if (getProductStock(color, variant.size) === 0) {
    variant.size = variants.find(item => item.color_code === color && item.stock > 0).size;
  }
  variant.qty = 1;
  renderSelectedVariants();
}

function handleSizeChange(event) {
  const size = event.currentTarget.textContent;

  if (getProductStock(variant.colorCode, size) === 0) {
    return;
  }
  variant.size = size;

  variant.qty = 1;
  renderSelectedVariants();
}

function handleQTYChange(event) {
  const {value} = event.currentTarget.dataset;
  const stock = getProductStock(variant.colorCode, variant.size);
  variant.qty += parseInt(value, 10);
  variant.qty = Math.max(1, variant.qty);
  variant.qty = Math.min(stock, variant.qty);
  renderSelectedVariants();
}

async function showProductData() {
  const productContent = document.querySelector('.product__content');
  // eslint-disable-next-line no-undef
  data = await getProductData();
  variants = data.variants;

  const productMainImage = document.createElement('img');
  productMainImage.className = 'product__main-image';
  productMainImage.src = `${data.main_image}`;
  productContent.appendChild(productMainImage);

  data.colors.forEach(item => {
    productColor += `<div class="product__color" id="${item.code}" style="background-color: #${item.code}" data-name="${item.name}"></div>`;
  });

  data.sizes.forEach(item => {
    productSize += `<div class="product__size">${item}</div>`;
  });

  const productDetail = document.createElement('div');
  productDetail.className = 'product__detail';
  productDetail.innerHTML = `
        <div class="product__title">${data.title}</div>
        <div class="product__id">${data.id}</div>
        <div class="product__price">TWD.${data.price}</div>
        <div class="product__variants">
            <div class="product__variant">
                <div class="product__variant-name">顏色 |</div>
                <div class="product__colors">
                    ${productColor}
                </div>
            </div>
            <div class="product__variant">
                <div class="product__variant-name">尺寸 |</div>
                <div class="product__sizes">
                    ${productSize}
                </div>
            </div>
            <div class="product__variant">
                <div class="product__variant-name">數量 |</div>
                <div class="product__quantity">
                    <button class="decrement crement" data-value="-1">-</button>
                    <div class="quantity">1</div>
                    <button class="increment crement" data-value="1">+</button>
                </div>
            </div>
        </div>
        <button class="add-to-cart">加入購物車</button>
        <div class="product__note">${data.note}</div>
        <div class="product__texture">${data.texture}</div>
        <div class="product__description">${data.description}</div>
        <div class="product__wash">${data.wash}</div>
        <div class="product__place">${data.place}</div>
`;
  productContent.appendChild(productDetail);

  const productSeperator = document.createElement('div');
  productSeperator.className = 'seperator';
  productSeperator.textContent = '更多產品資訊';
  productContent.appendChild(productSeperator);

  const productStory = document.createElement('div');
  productStory.className = 'product__story';
  productStory.textContent = `${data.story}`;
  productContent.appendChild(productStory);

  data.images.forEach(item => {
    const productImages = document.createElement('img');
    productImages.className = 'product__image';
    productImages.src = `${item}`;
    productContent.appendChild(productImages);
  });

  preSelectVariant(data);

  document
    .querySelectorAll('.product__color')
    .forEach(color => color.addEventListener('click', handleColorChange));
  document
    .querySelectorAll('.product__size')
    .forEach(size => size.addEventListener('click', handleSizeChange));
  document
    .querySelectorAll('.crement')
    .forEach(crement => crement.addEventListener('click', handleQTYChange));

  addProductToCart();
}

// eslint-disable-next-line no-undef
window.addEventListener('DOMContentLoaded', handleCartNum);
showProductData();
// eslint-disable-next-line no-undef
cartHover();
