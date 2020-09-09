let findBuySellStockPrices = function(array){

    if (!array||array.length<2){
        return
    }

    let currentBuy = array[0]
    let globalSell = array[1]
    let globalProfit = globalSell - currentBuy 

    let currentProfit = 0

    for(let i=1;i<array.length;i++){
        currentProfit = array[i] - currentBuy

        if(currentProfit>globalProfit){
            globalProfit = currentProfit
            globalSell = array[i]
        }

        if(currentBuy>array[i]){
            currentBuy=array[i]
        }
    }
    return [globalSell-globalProfit, globalSell]
}


let findBuySellStockPrices = function(array) {
    if (!array || array.length < 2) {
      return;
    }
  
    let currentBuy = array[0];
    let globalSell = array[1];
    let globalProfit = globalSell - currentBuy;
  
    let currentProfit = 0;
  
    for (let i = 1; i < array.length; i++) {
      currentProfit = array[i] - currentBuy;
  
      if (currentProfit > globalProfit) {
        globalProfit = currentProfit;
        globalSell = array[i];
      }
  
      if (currentBuy > array[i]) {
        currentBuy = array[i];
      } 
    }
    return [globalSell - globalProfit, globalSell];
  };