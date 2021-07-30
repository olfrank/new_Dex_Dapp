// // animation for the title of both pages 
// var textWrapper = document.querySelector('.textAnim .letters');
// textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

// anime.timeline({loop: true})
//   .add({
//     targets: '.textAnim .letter',
//     translateY: ["1.1em", 0],
//     translateZ: 0,
//     duration: 750,
//     delay: (el, i) => 50 * i
//   }).add({
//     targets: '.textAnim',
//     opacity: 0,
//     duration: 9000,
//     easing: "easeOutExpo",
//     delay: 3000
//   });