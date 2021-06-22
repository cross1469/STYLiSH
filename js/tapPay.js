const recipientName = document.querySelector('#name');
const recipientEmail = document.querySelector('#email');
const recipientPhone = document.querySelector('#phone');
const recipientAddr = document.querySelector('#address');
const checkOut = document.querySelector('.checkout');

let cart;
let primeKey;

window.TPDirect.setupSDK(
  12348,
  'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
  'sandbox'
);

const fields = {
  number: {
    element: '#card-number',
    placeholder: '**** **** **** ****',
  },
  expirationDate: {
    element: '#card-expiration-date',
    placeholder: 'MM / YY',
  },
  ccv: {
    element: '#card-ccv',
    placeholder: 'CCV',
  },
};

window.TPDirect.card.setup({
  fields,
  styles: {
    input: {
      color: 'gray',
    },
    'input.cvc': {
      'font-size': '16px',
    },
    'input.expiration-date': {
      'font-size': '16px',
    },
    'input.card-number': {
      'font-size': '16px',
    },
    ':focus': {
      color: 'black',
    },
    '.valid': {
      color: 'green',
    },
    '.invalid': {
      color: 'red',
    },
    '@media screen and (max-width: 400px)': {
      input: {
        color: 'orange',
      },
    },
  },
});

const submitButton = document.querySelector('.checkout');
window.TPDirect.card.onUpdate(update => {
  if (update.canGetPrime) {
    submitButton.removeAttribute('disabled');
  } else {
    submitButton.setAttribute('disabled', true);
  }
});

function checkData() {
  const nameRegex = /^([a-zA-Z\u4e00-\u9fa5]{1,10})$/;
  const emailRegex = /^([a-z0-9_-]+)@([\da-z-]+)\.([a-z]{2,6})$/;
  const phoneRegex = /^0[0-9]{8,9}$/;
  const addrRegex = /^([a-zA-Z0-9\u4e00-\u9fa5]+)$/;
  if (!nameRegex.test(recipientName.value)) {
    alert('請填入正確的收件人姓名');
  } else if (!emailRegex.test(recipientEmail.value)) {
    alert('請填入正確的 Email');
  } else if (!phoneRegex.test(recipientPhone.value)) {
    alert('請填入正確的聯絡電話');
  } else if (!addrRegex.test(recipientAddr.value)) {
    alert('請填入正確的收件地址');
  }
}

function setData() {
  const radioBtns = document.getElementsByName('time');
  let time;
  for (let i = 0; i < radioBtns.length; i += 1) {
    if (radioBtns[i].checked === true) {
      time = radioBtns[i].id;
    }
  }
  const productList = [];
  // eslint-disable-next-line no-undef
  cartList.forEach(item => {
    const product = {
      id: item.id,
      name: item.name,
      price: item.price,
      color: {
        name: item.color.name,
        code: item.color.code,
      },
      size: item.size,
      qty: item.qty,
    };
    productList.push(product);
  });
  cart = {
    prime: primeKey,
    order: {
      shipping: 'delivery',
      payment: 'credit_card',
      subtotal: parseInt(document.querySelector('.subtotal .value span').textContent, 10),
      freight: 60,
      total: parseInt(document.querySelector('.total .value span').textContent, 10),
      recipient: {
        name: recipientName.value,
        phone: recipientPhone.value,
        email: recipientEmail.value,
        address: recipientAddr.value,
        time,
      },
      list: productList,
    },
  };
}

function showLoading() {
  document.querySelector('.loading').style.display = 'block';
}

function sendToCheckoutAPI() {
  showLoading();
  fetch(`https://api.appworks-school.tw/api/1.0/order/checkout`, {
    method: 'POST',
    body: JSON.stringify(cart),
    headers: {
      'Content-Type': 'application/json',
      // eslint-disable-next-line no-undef
      Authorization: `Bearer ${transferToken}`,
    },
  })
    .then(res => res.json())
    .then(response => {
      window.localStorage.clear();
      window.location.href = `thankyou.html?number=${response.data.number}`;
    });
}

checkOut.addEventListener('click', event => {
  event.preventDefault();

  window.FB.getLoginStatus(response => {
    if (response.status === 'connected') {
      checkData();

      const tapPayStatus = window.TPDirect.card.getTappayFieldsStatus();

      // 確認是否可以 getPrime
      if (tapPayStatus.canGetPrime === false) {
        alert('信用卡資訊填寫錯誤');
        return;
      }

      window.TPDirect.card.getPrime(result => {
        if (result.status !== 0) {
          alert('資料傳送失敗，請重新傳送');
          return;
        }
        primeKey = result.card.prime;
        setData();
        sendToCheckoutAPI();
      });
    } else {
      alert('請先登入會員');
    }
  });
});
