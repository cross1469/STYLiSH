async function showProductsData() {
  const card = document.querySelector('.content .container');
  const productList = document.querySelector('.content');
  // eslint-disable-next-line no-undef
  const allData = await getProductsData();
  const {data} = allData;
  // eslint-disable-next-line no-undef
  nextPage = allData.nextPage;

  if (data.length > 0) {
    data.forEach(item => {
      let cardColors = '';
      item.colors.forEach(itemColor => {
        cardColors += `<div class="rectangle" style="background-color: #${itemColor.code}"></div>`;
      });
      card.innerHTML += `
            <a href="./product.html?id=${item.id}" class="card d-flex flex-column">
                <div class="card-img mb-1">
                    <img
                        src="${item.main_image}"
                        alt="${item.description}"
                    />
                </div>
                <div class="card-color mb-1">
                    ${cardColors}
                </div>
                <div class="card-title mb-1">${item.title}</div>
                <div class="card-price mb-1">TWD.${item.price}</div>
            </a>
        `;
    });
  } else {
    productList.innerHTML = `<h1> 沒有搜尋到任何產品哦 </h1>`;
  }
}

async function renderProductsData() {
  setTimeout(() => {
    // eslint-disable-next-line no-undef
    if (nextPage) {
      showProductsData();
    }
  }, 300);
}

function getTag() {
  const getUrlString = window.location.href;
  const url = new URL(getUrlString);
  const tag = url.searchParams.get('tag');
  return tag;
}

function menuSelect() {
  const mapCatalogToElement = {
    men: document.querySelector('.menuMan a'),
    women: document.querySelector('.menuWoman a'),
    accessories: document.querySelector('.menuAcc a'),
  };
  // eslint-disable-next-line no-undef
  mapCatalogToElement[catalog].classList.toggle('menu__selected');
}

window.addEventListener('scroll', () => {
  const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    renderProductsData();
  }
});

window.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-undef
  catalog = getTag();
  // eslint-disable-next-line no-undef
  if (catalog === null) {
    // eslint-disable-next-line no-undef
    catalog = 'all';
    showProductsData();
    // eslint-disable-next-line no-undef
  } else if (catalog === 'women' || catalog === 'men' || catalog === 'accessories') {
    menuSelect();
    showProductsData();
  } else {
    // eslint-disable-next-line no-undef
    catalog = `search?keyword=${catalog}`;
    // eslint-disable-next-line no-undef
    symbol = '&';
    showProductsData();
  }
});

window.addEventListener('DOMContentLoaded', function handleCartNum() {
  document.querySelectorAll('.qty').forEach(qty => {
    let num = 0;
    if (JSON.parse(localStorage.getItem('cart')) === null) {
      num = 0;
    } else {
      num = JSON.parse(localStorage.getItem('cart')).length;
    }
    if (num) {
      // eslint-disable-next-line no-param-reassign
      qty.innerHTML = num;
    }
  });
});

// eslint-disable-next-line no-undef
cartHover();
