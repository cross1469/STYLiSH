const classification = 'campaigns';
const hostName = 'api.appworks-school.tw';
const apiVersion = '1.0';

let nextPage = 0;
// eslint-disable-next-line prefer-const
let catalog = 'all';
// eslint-disable-next-line prefer-const
let symbol = '?';

// eslint-disable-next-line no-unused-vars
async function getMarketingData() {
  const jsonData = await fetch(
    // eslint-disable-next-line no-undef
    `https://${hostName}/api/${apiVersion}/marketing/${classification}`
  ).then(res => res.json());
  const {data} = jsonData;
  return data;
}

// eslint-disable-next-line no-unused-vars
async function getProductsData() {
  const jsonData = await fetch(
    `https://${hostName}/api/${apiVersion}/products/${catalog}${symbol}paging=${nextPage}`
  ).then(res => res.json());
  const {data} = jsonData;
  nextPage = jsonData.next_paging;
  return {data, nextPage};
}

// eslint-disable-next-line no-unused-vars
async function getProductData() {
  const id = new URLSearchParams(window.location.search).get('id');
  const jsonData = await fetch(
    `https://${hostName}/api/${apiVersion}/products/details?id=${id}`
  ).then(res => res.json());
  const detailData = jsonData.data;
  return detailData;
}
