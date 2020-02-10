var coinName;
var coinSymbol;
var xhrObject = new XMLHttpRequest();

xhrObject.onreadystatechange = function() 
{
  if (xhrObject.readyState === 4) 
  {
    if (xhrObject.status === 200 || xhrObject.status === 304) 
    {
      console.log(xhrObject.responseText);   
    }
  }
};

xhrObject.open(
  "GET", 
  "https://api.coingecko.com/api/v3/coins/list", 
  true
);

xhrObject.send();