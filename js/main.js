var cards = document.querySelector('.cards');
var xhrObject = new XMLHttpRequest();

xhrObject.onreadystatechange = function() 
{
  if (xhrObject.readyState === 4) 
  {
    if (xhrObject.status === 200 || xhrObject.status === 304) 
    {
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

var display_coins = (coin_data) => {

  for (let i = 0; i < 100; i++) {
    cards.innerHTML += ` 
    <div class="card">
      <div class="coin-data">
          <div class="coin-sym">${coin_data[i].symbol}</div>
          <div class="coin-name">${coin_data[i].name}</div>
      </div>
      <div class="more-info">More Info</div>
    
      <label class="switch">
          <input type="checkbox">
          <span class="slider round"></span>
      </label>
  </div>`;
    
  }
}