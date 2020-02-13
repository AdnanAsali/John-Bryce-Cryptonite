var cards = document.querySelector('.cards');
var xhrObject = new XMLHttpRequest();
var searchInput = document.querySelector('.search-field input');
var searchBtn = document.querySelector('.search-btn');
var displayAll = document.querySelector('.all-btn');
var coin_data = [];

xhrObject.onreadystatechange = function () 
{
  if (xhrObject.readyState === 4) 
  {
    if (xhrObject.status === 200 || xhrObject.status === 304) 
    {
      console.log(JSON.parse(xhrObject.responseText));
      coin_data = JSON.parse(xhrObject.responseText);
      display_coins(coin_data);
    }
  }
};

xhrObject.open(
  "GET",
  "https://api.coingecko.com/api/v3/coins/list",
  true
);

xhrObject.send();

window.addEventListener('load', function () 
{
  moreEvent();

  searchBtn.addEventListener('click', () => {
    var wanted  = searchInput.value.toLowerCase();
    searchCoin(wanted, coin_data);
  });

  displayAll.addEventListener('click', () => {
    display_coins(coin_data);
  });

});

var searchCoin = (wantedCoin, coinArr) => 
{
  var searched = [];
  coinArr.forEach(element => 
  {
    if(element.id.includes(wantedCoin,0))
    {
      searched.push(element);
    } 
  });
  console.log(searched);
  display_coins(searched);
  moreEvent();
}

var display_coins = (coin_data) => 
{
  cards.innerHTML = "";

  for (let i = 0; i < coin_data.length; i++) 
  {

    if(i > 50)
    {
      break;
    }

    cards.innerHTML += ` 
      <div class="card">
      <div class="coin-data">
      <div class="coin-sym">${coin_data[i].symbol}</div>
      <div class="coin-name">${coin_data[i].id}</div>
      </div>
      <div class="more-info">More Info</div>
      
      <label class="switch">
      <input type="checkbox">
      <span class="slider round"></span>
      </label>
      </div>`;
  }
}

var more_info_card = (data) => 
{
  console.log('into the more');
  let layout = document.querySelector('.info-layout-container');
  layout.innerHTML = ""; 
  layout.innerHTML += 
  `
  <div class="info-layout">
    <div class="close">X</div>
    <div class="fetched-img">
        <img src="${data.image.large}" alt="coin-image">
    </div>
    <div class="fetched-name">Name : ${data.name}</div>
    <div class="fetched-sym">Symbol : ${data.symbol}</div>
      ${data.description.en != "" ? `<div class="fetched-desc">${data.description.en}</div>` : "" }
    <div class="fetched-links">
      <div class="fetched-homepage">
        ${data.links.homepage[0] != null ? `<a href="${data.links.homepage[0]}" target="_blank">Homepage</a>` : "" }          
      </div>
      <div class="fetched-blockchain">
        ${data.links.blockchain_site[0] != null ? `<a href="${data.links.blockchain_site[0]}" target="_blank">Blockchain Site</a>` : "" }
      </div>
    </div>
    <div class="fetched-social">
      ${data.links.repos_url.github[0] != null ? `<a href="${data.links.repos_url.github[0]}" target="_blank"><img src="../imgs/github-image.svg" alt=""></a>` : "" }
      ${data.links.subreddit_url != null ? `<a href="${data.links.subreddit_url}" target="_blank"><img src="../imgs/reddit.svg" alt=""></a>` : "" }
    </div>
</div>
  `;
}

var close_more = () => 
{
  let layout = document.querySelector('.info-layout-container');
  layout.innerHTML = ""; 
}

var moreEvent = () => 
{
  var moreInfo = document.querySelectorAll('.card .more-info');
  moreInfo.forEach(btn => 
  {
    btn.addEventListener('click', () => 
    {
      console.log(btn.parentElement.querySelector('.coin-data .coin-name').innerHTML);
      let clickedCoin = btn.parentElement.querySelector('.coin-data .coin-name').innerHTML;

      xhrObject.onreadystatechange = function () 
      {
        if (xhrObject.readyState === 4) 
        {
          if (xhrObject.status === 200 || xhrObject.status === 304) 
          {
            console.log(JSON.parse(xhrObject.responseText));
            var coin_moreInfo = JSON.parse(xhrObject.responseText);
            more_info_card(coin_moreInfo);

            var close_layout = document.querySelector('.close');
            close_layout.addEventListener('click', () => {
              close_more();
            });
          }
        }
      };

      xhrObject.open(
        "GET",
        `https://api.coingecko.com/api/v3/coins/${clickedCoin}`,
        true
      );

      xhrObject.send();
    });
  });
}

