var cards = document.querySelector('.cards');
var xhrObject = new XMLHttpRequest();
var searchInput = document.querySelector('.search-field input');
var searchBtn = document.querySelector('.search-btn');
var displayAll = document.querySelector('.all-btn');
var liveSection = document.querySelector('.live');
let liveCounter = 0;
var liveCoins = [];
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

  searchBtn.addEventListener('click', () => 
  {
    var wanted  = searchInput.value.toLowerCase();
    searchCoin(wanted, coin_data);
  });

  displayAll.addEventListener('click', () => 
  {
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

      let chosenCards = document.querySelectorAll('.card input');
      chosenCards.forEach(chosenCard => 
      {
        chosenCard.addEventListener('click', () =>
        {
            if(chosenCard.checked === true && liveCoins.length < 6)
            {
                if(liveCounter === 5)
                {
                    console.log(liveCoins)
                    confirmed_coins(liveCoins);
                }
              chosenCard_id = chosenCard.parentElement.parentElement.querySelector('.coin-data .coin-name').innerHTML;
              liveCoins.push(chosenCard_id);
              liveCounter++;
              console.log(liveCounter)
          }
          else
          {
            if(liveCounter === 5)
            {
                console.log(liveCoins)
                confirmed_coins(liveCoins);
            }
            liveCoins.pop(chosenCard_id);
            liveCounter--;
            chosenCard.checked = false;
            console.log(liveCoins);
          }
        });
      });
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

var confirmed_coins = (confirmedArr) =>
{
    let confirmationBox = document.querySelector('.confirmation');
    
    confirmedArr.forEach(element => {
        confirmationBox.innerHTML += 
        `
        <div class="coinName-list">
          <div class="coin-name">
            ${element}
          </div>
        </div>
        `
    });
    
    confirmationBox.innerHTML +=
    `
    <div class="confirm-btn">
    Save Chosen Coins
    </div>
    <div class="close-confirm">X</div>
    ` 
    
    confirmationBox.style.display = "flex";
    let confirmationBtn = document.querySelector('.confirm-btn');
    confirmationBtn.addEventListener('click', () => 
    {
        live_toLocalStorage(liveCoins);
    });
    
    // Close Btn
    let closeConfirm = document.querySelector('.close-confirm');
    closeConfirm.addEventListener('click', () =>
    {
        document.querySelector('.confirmation').innerHTML = "";
        confirmationBox.style.display = "none";
    })
    
}

var live_toLocalStorage = (liveCoins) =>
{
    localStorage.setItem("liveCoins", JSON.stringify(liveCoins));
}

var show_live_reports = (liveCoins) => 
{
  
}

liveSection.addEventListener('click', () => 
{
    var storedNames = JSON.parse(localStorage.getItem("liveCoins"));
    console.log(storedNames);
});




// TODO :-
// Display a screen with confirmation for the chosen coins DONE
// Once confirmed save the array inside of local storage DONE
// Pass the array inside of the local storage to the page which we were redirected to. DONE
// Understand how to navigate in SPA and apply it 
// Make The about page and navigate to it 
// TESTING