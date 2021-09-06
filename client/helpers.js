var currentSelectedToken
var testObject;
var retrievedObject;
const ADA = document.getElementById("ADA")
const VET = document.getElementById("VET")
const LINK = document.getElementById("LINK")

ADA.onclick = function(){
  console.log("clicked ADA")
  testObject = { 'token': "ADA"};
  localStorage.setItem('testObject', JSON.stringify(testObject));
  retrievedObject = localStorage.getItem('testObject');
  currentSelectedToken = JSON.parse(retrievedObject).token
  loadLimitOrderTable("ADA", 0);
  loadLimitOrderTable("ADA", 1);
}
VET.onclick = function(){
    console.log("clicked VET")
    testObject = { 'token': "VET"};
    localStorage.setItem('testObject', JSON.stringify(testObject));
    retrievedObject = localStorage.getItem('testObject');
    currentSelectedToken = JSON.parse(retrievedObject).token
    loadLimitOrderTable("VET", 0);
    loadLimitOrderTable("VET", 1);
}
LINK.onclick = function(){
    console.log("clicked LINK")
    testObject = { 'token': "LINK"};
    localStorage.setItem('testObject', JSON.stringify(testObject));
    retrievedObject = localStorage.getItem('testObject');
    currentSelectedToken = JSON.parse(retrievedObject).token
    loadLimitOrderTable("LINK", 0);
    loadLimitOrderTable("LINK", 1);
  }


// function changeTicker(tickerID){

//     if(tickerID == "link-ticker"){
//         loadLimitOrderTable("LINK", 0)
//         loadLimitOrderTable("LINK", 1)
//     }else if(tickerID == "vet-ticker"){
//         loadLimitOrderTable("VET", 0)
//         loadLimitOrderTable("VET", 1)
//     }else{
//         loadLimitOrderTable("ADA", 0)
//         loadLimitOrderTable("ADA", 1)
//     }

// }