$(()=>{

    
  $("#s").on("click",()=>{
      $(".box").show();
      $(".card").hide();
      $(".swiper-container").hide();
      $(".wrap").hide();
  });

  $("#r").on("click", ()=>{
      $(".wrap").show();
      $(".card").hide();
      $(".swiper-container").hide();
      $(".box").hide();
      
  });

  $("#game").on("click", ()=>{
      alert("geex");
  });
});


// var searchStrings = [];
// var favorites = [];
// const KEY = "favorites";

// (initializeLocalStorage)=>{
//     favorites = JSON.parse(localStorage.getItem(KEY));
//     if(favorites == null){
//         localStorage.setItem(KEY, JSON.stringify(favorites));
//         favorites = [];
//     };
// };


// (displayMeal)=>{
//     var meal = $(this).attr("data-name");
//     var queryURL = "API";

//     $.ajax({
//         url: queryURL,
//         method: "GET"
//     }).then((response)=>{

//     })
// }
