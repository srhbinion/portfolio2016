$(function(){
  $(".element").typed({
    strings: ["client-side engineer. #ILookLikeAnEngineer", "movie nerd.", "commander of robots.", "ui developer.", "biker.", "designer.",  "gamer (pro-tip: cake is most-likely a lie)."],
    // typing speed
    typeSpeed: 100,
    // time before typing starts
    startDelay: 25,
    // backspacing speed
    backSpeed: 5,
    // shuffle the strings
    shuffle: false,
    // time before backspacing
    backDelay: 1500,
    // loop
    loop: true,
    // false = infinite
    loopCount: false,
    // show cursor
    showCursor: false,
  });
});