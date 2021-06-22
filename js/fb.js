const loginPage = document.querySelector('.member-card');
const logoutPage = document.querySelector('.fb-login');
const upic = document.querySelector('.user-pic');
const uname = document.querySelector('.user-name');
const uemail = document.querySelector('.user-email');
const fbLogout = document.querySelector('.fb-logout');

let userName;
let userEmail;
let userPicURL;
let userToken;
let transferToken;

function renderProfilePage() {
  upic.style.backgroundImage = `url(${userPicURL})`;
  uname.innerHTML = `${userName}`;
  uemail.innerHTML = `${userEmail}`;
}

async function postSigninAPI(token) {
  const res = await fetch(`https://api.appworks-school.tw/api/1.0/user/signin`, {
    method: 'POST',
    body: JSON.stringify({
      provider: 'facebook',
      access_token: `${token}`,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await res.json();
  userName = response.data.user.name;
  userEmail = response.data.user.email;
  userPicURL = response.data.user.picture;
  userToken = response.data.access_token;
  if (upic) {
    renderProfilePage();
  }
  return userToken;
}

function getFBToken() {
  return new Promise(resolve => {
    window.FB.getLoginStatus(async response => {
      if (response.status === 'connected') {
        const token = await postSigninAPI(response.authResponse.accessToken);
        resolve(token);
      }
    });
  });
}

function loginFB() {
  return new Promise(() => {
    window.FB.login(
      response => {
        if (window.location.pathname.includes('/profile.html')) {
          if (response.status === 'connected') {
            logoutPage.style.display = 'none';
            loginPage.style.display = 'block';
            postSigninAPI(response.authResponse.accessToken);
          }
        }
      },
      {
        scope: 'email',
        auth_type: 'rerequest',
      }
    );
  });
}

// Check login status
function checkLoginState() {
  return new Promise(() => {
    window.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        if (window.location.pathname.includes('/profile.html')) {
          logoutPage.style.display = 'none';
          loginPage.style.display = 'block';
          postSigninAPI(response.authResponse.accessToken);
        } else {
          window.location.href = 'profile.html';
        }
      } else {
        // eslint-disable-next-line no-lonely-if
        if (window.location.pathname.includes('/profile.html')) {
          window.location.href = 'index.html';
        } else {
          loginFB();
        }
      }
    });
  });
}

// Initiate FB api
function initFB() {
  window.fbAsyncInit = () => {
    window.FB.init({
      appId: '2843637799226102',
      cookie: true,
      xfbml: true,
      version: 'v10.0',
    });
    window.FB.AppEvents.logPageView();
    getFBToken().then(token => {
      // eslint-disable-next-line no-unused-vars
      transferToken = token;
    });
    if (window.location.pathname.includes('/profile.html')) {
      checkLoginState();
    }
  };
  // eslint-disable-next-line func-names
  (function(d, s, id) {
    // eslint-disable-next-line one-var
    let js,
      // eslint-disable-next-line prefer-const
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    // eslint-disable-next-line prefer-const
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/zh_TW/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
}

if (fbLogout) {
  fbLogout.addEventListener('click', () => {
    window.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        window.FB.logout(() => {
          loginPage.style.display = 'none';
          logoutPage.style.display = 'block';
        });
      }
    });
  });
}

initFB();
