var button1 = document.getElementById("toggleDayNight")


button1.addEventListener("click", function(){
  document.body.classList.toggle("colorred");
  document.querySelector('h1').classList.toggle("darker");
  //document.getElementById('clouds').classList.toggle("darker2");
  $("#cloud1").toggleClass("darkClouds");
  $("#toggleDayNight").toggleClass("darkClouds")
  $("#cloud2").toggleClass("darkClouds");
  $("#cloud3").toggleClass("darkClouds");
  
})








// const ADA = document.getElementById("ADA")
// const VET = document.getElementById("VET")
// const LINK = document.getElementById("LINK")

// ADA.onclick = function(){
//   console.log("clicked ADA")
//   removeTokenOrderbook("VET", 0)
//   removeTokenOrderbook("VET", 1)
//   removeTokenOrderbook("LINK", 0)
//   removeTokenOrderbook("LINK", 1)
//   // testObject = { 'token': "ADA"};
//   // localStorage.setItem('testObject', JSON.stringify(testObject));
//   // retrievedObject = localStorage.getItem('testObject');
//   // currentSelectedToken = JSON.parse(retrievedObject).token
//   loadLimitOrderTable("ADA", 0);
//   loadLimitOrderTable("ADA", 1);
// }


// VET.onclick = function(){
//     console.log("clicked VET")
//     removeTokenOrderbook("ADA", 0)
//     removeTokenOrderbook("ADA", 1)
//     removeTokenOrderbook("LINK", 0)
//     removeTokenOrderbook("LINK", 1)
//     // testObject = { 'token': "VET"};
//     // localStorage.setItem('testObject', JSON.stringify(testObject));
//     // retrievedObject = localStorage.getItem('testObject');
//     // currentSelectedToken = JSON.parse(retrievedObject).token
//     loadLimitOrderTable("VET", 0);
//     loadLimitOrderTable("VET", 1);
// }


// LINK.onclick = function(){
//     console.log("clicked LINK")
//     removeTokenOrderbook("VET", 0)
//     removeTokenOrderbook("VET", 1)
//     removeTokenOrderbook("ADA", 0)
//     removeTokenOrderbook("ADA", 1)
//     // testObject = { 'token': "LINK"};
//     // localStorage.setItem('testObject', JSON.stringify(testObject));
//     // retrievedObject = localStorage.getItem('testObject');
//     // currentSelectedToken = JSON.parse(retrievedObject).token
//     loadLimitOrderTable("LINK", 0);
//     loadLimitOrderTable("LINK", 1);
//   }
//   const limitOrderBuyTable = document.getElementById("BuyOrders");
//   const limitOrderSellTable = document.getElementById("SellOrders");
//   const adaEntrySell = document.getElementById("entry-ADA-sell");
//   const adaEntryBuy = document.getElementById("entry-ADA-buy");

//   const vetEntryBuy = document.getElementById("entry-VET-buy");
//   const vetEntrySell = document.getElementById("entry-VET-sell");

//   const linkEntryBuy = document.getElementById("entry-LINK-buy");
//   const linkEntrySell = document.getElementById("entry-LINK-sell");

//   function removeTokenOrderbook(ticker, side){
//     var table;
//     if(side == 1){
//         table = limitOrderSellTable;
//     }else if(side == 0){
//         table = limitOrderBuyTable;
//     }

//     if(ticker == "ADA" && side == 0){
//         $("#entry-ADA-buy").addClass("hidden");
//     }if(ticker == "VET" && side == 0){
//       $("#entry-VET-buy").addClass("hidden");
//     }if(ticker == "LINK" && side == 0){
//       $("#entry-LINK-buy").addClass("hidden");
//     }

//     if(ticker == "ADA" && side == 1){
//       $("#entry-ADA-sell").addClass("hidden");
//     }if(ticker == "VET" && side == 1){
//       $("#entry-VET-sell").addClass("hidden");
//     }if(ticker == "LINK" && side == 1){
//       $("#entry-LINK-sell").addClass("hidden");
//     }


// }

// // function changeTicker(tickerID){

// //     if(tickerID == "link-ticker"){
// //         loadLimitOrderTable("LINK", 0)
// //         loadLimitOrderTable("LINK", 1)
// //     }else if(tickerID == "vet-ticker"){
// //         loadLimitOrderTable("VET", 0)
// //         loadLimitOrderTable("VET", 1)
// //     }else{
// //         loadLimitOrderTable("ADA", 0)
// //         loadLimitOrderTable("ADA", 1)
// //     }

// // }