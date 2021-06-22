const campaigns = document.querySelector('.carousel');

let dotNumber = 0;

function swipeCampaigns() {
  const campaignsImgAmount = campaigns.children.length;

  if (dotNumber < campaignsImgAmount - 1) {
    const currentCampaignImg = document.querySelector('.currentCampaignImg');
    const nextCampaignImg = document.querySelectorAll('.campaignImg')[dotNumber];
    currentCampaignImg.classList.remove('currentCampaignImg');
    nextCampaignImg.classList.add('currentCampaignImg');

    const currentDot = document.querySelector('.currentDot');
    const nextDot = document.querySelectorAll('.dot')[dotNumber];
    currentDot.classList.remove('currentDot');
    nextDot.classList.add('currentDot');

    dotNumber += 1;
  } else {
    dotNumber = 0;

    const currentCampaignImg = document.querySelector('.currentCampaignImg');
    const nextCampaignImg = document.querySelectorAll('.campaignImg')[dotNumber];
    currentCampaignImg.classList.remove('currentCampaignImg');
    nextCampaignImg.classList.add('currentCampaignImg');

    const currentDot = document.querySelector('.currentDot');
    const nextDot = document.querySelectorAll('.dot')[dotNumber];
    currentDot.classList.remove('currentDot');
    nextDot.classList.add('currentDot');

    dotNumber += 1;
  }
}

let timer = window.setInterval(() => {
  swipeCampaigns();
}, 5000);

function clickCampaigns() {
  const clickElements = document.querySelectorAll('.dot');
  clickElements.forEach((clickElement, index) => {
    clickElement.addEventListener('click', () => {
      const currentCampaignImg = document.querySelector('.currentCampaignImg');
      currentCampaignImg.classList.remove('currentCampaignImg');

      const currentDot = document.querySelector('.currentDot');
      currentDot.classList.remove('currentDot');

      const nextCampaignImg = document.querySelectorAll('.campaignImg')[index];
      nextCampaignImg.classList.add('currentCampaignImg');

      const nextDot = document.querySelectorAll('.dot')[index];
      nextDot.classList.add('currentDot');

      dotNumber = index + 1;
    });
  });
}

function addFirstCampaignImg() {
  const firstCampaignImg = document.querySelectorAll('.campaignImg')[0];
  firstCampaignImg.classList.add('currentCampaignImg');
  const firstDot = document.querySelectorAll('.dot')[0];
  firstDot.classList.add('currentDot');
}

function campaignHover() {
  campaigns.addEventListener('mouseenter', () => {
    clearInterval(timer);
  });
  campaigns.addEventListener('mouseleave', () => {
    timer = window.setInterval(() => {
      swipeCampaigns();
    }, 5000);
  });
}

async function showCampaigns() {
  // eslint-disable-next-line no-undef
  const marketingData = await getMarketingData();

  if (marketingData.length > 0) {
    marketingData.forEach(item => {
      const campaignLink = document.createElement('a');
      campaignLink.id = item.product_id;
      campaignLink.className = 'campaignImg';
      campaignLink.href = `./product.html?id=${item.product_id}`;
      campaignLink.style.backgroundImage = `url(${item.picture})`;

      const campaignContent = document.createElement('pre');
      campaignContent.className = 'carouselContent';
      campaignContent.innerHTML = item.story;

      campaignLink.appendChild(campaignContent);
      campaigns.appendChild(campaignLink);
    });

    const dots = document.createElement('div');
    dots.className = 'dots';
    campaigns.appendChild(dots);
    for (let i = 0; i < marketingData.length; i += 1) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.onclick = () => clickCampaigns();
      dots.appendChild(dot);
    }
  }

  addFirstCampaignImg();

  campaignHover();
}

showCampaigns();
