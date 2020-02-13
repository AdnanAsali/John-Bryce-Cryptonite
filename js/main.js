var cards = document.querySelector('.cards');
var xhrObject = new XMLHttpRequest();

xhrObject.onreadystatechange = function () {
  if (xhrObject.readyState === 4) {
    if (xhrObject.status === 200 || xhrObject.status === 304) {
      console.log(JSON.parse(xhrObject.responseText));
      var coin_data = JSON.parse(xhrObject.responseText);
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
})

var display_coins = (coin_data) => {
  for (let i = 0; i < 100; i++) {
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
  let layout = document.querySelector('.info-layout-container');
  layout.innerHTML = ""; 
  layout.innerHTML += 
  `
  <div class="info-layout">
    <div class="fetched-img">
        <img src="${data.image.large}" alt="coin-image">
    </div>
    <div class="fetched-name">${data.name}</div>
    <div class="fetched-sym">${data.symbol}</div>
    <div class="fetched-desc">${data.description.en}</div>
    <div class="fetched-homepage">
        <a href="${data.links.homepage[0]}">${data.name}'s Homepage</a>
    </div>
    <div class="fetched-blockchain">
        <a href="${data.links.blockchain_site[0]}">${data}'s Blockchain Site</a>
    </div>
    <div class="fetched-social">
        <a href="${data.links.repos_url.github[0]}">Github</a>
        <a href="${data.links.subreddit_url}">Reddit</a>
    </div>
</div>
  `;
  console.log('done');
}

