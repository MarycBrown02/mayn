var state = {
    favorites: [],
    meals: {},
    currentMeal: null
};

$(() => {


    $("#s").on("click", () => {
        $(".box").show();
        $(".card").hide();
        $(".swiper-container").hide();
        $(".wrap").hide();
    });

    $("#r").on("click", () => {
        $(".wrap").show();
        $(".card").hide();
        $(".swiper-container").hide();
        $(".box").hide();

    });

    $("#game").on("click", () => {
        alert("geex");
    });
});


$("#bone").on("click", () => {

    $(".addRecipe").show();
    $(".card").hide();
    $("#meal").hide();
});

$("#submitMeal").on("click", () => {

    $(".addRecipe").hide();
    $(".card").show();
    $("#meal").show();
});

$("#viewProfile").on("click", () => {
    $("#mealpic").hide();
    $("#profile").show();

});


function logout() {
    $.ajax("/api/logout", {
        type: "GET"
    }).then(
        function () {
            location.href = "/";
        }
    );
};

$("#search").on("click", () => {
    $("#nene").hide();
    var term = $("#searchTerm").val().trim();
    var queryURL = "http://api.yummly.com/v1/api/recipes?_app_id=bf960ba7&_app_key=ceae6e226000faadd006d0088b7aff71&q=" + term;

    $.ajax({
        url: queryURL,
        method: "GET",
        async: false,
        success: (response) => {
            $("#recipeSearch").empty();
            $("#ingredient").empty();
            for (i = 0; i < response.matches.length; i++) {

                var img = $("<img>");
                img.attr("src", response.matches[i].smallImageUrls[0]);
                $("#recipeSearch").append(img);
                img.css("height", "150px");
                img.css("width", "150px");

                var p = $("<p>");
                p.addClass("dishName");
                p.attr("data-id", response.matches[i].id);

                p.text(response.matches[i].recipeName);

                $("#recipeSearch").append(p);

                // $("#recipeSearch").append(response.matches[i].ingredients + "<br>");

            }
        }
    })
});

$(document).on("click", ".dishName", itemClick);
function itemClick() {
    var id = ($(this).attr("data-id"));
    var queryURL = "http://api.yummly.com/v1/api/recipe/" + id + "?_app_id=bf960ba7&_app_key=ceae6e226000faadd006d0088b7aff71";

    $.ajax({
        url: queryURL,
        method: "GET",
        async: false,
        success: (response) => {
            // $("#ingredient").empty();
            var p = $("<p>");
            p.addClass("ingName");
            p.text(response.name);
            p.css("color", "red");
            p.css("font-family", "fantasy");
            $("#ingredient").append(p);

            for (i = 0; i < response.ingredientLines.length; i++) {

                $("#ingredient").append(response.ingredientLines[i] + "<br>");
                $("#moreRecipe").append(response.ingredientLines[i] + "<br>");
                $("#moreRecipe").append(response.ingredientLines[i] + "<br>");

            }

            var viewButton = $("<button>");
            viewButton.addClass("viewbutton");
            viewButton.text("View Recipe");
            viewButton.attr("onClick", "window.open('" + response.source.sourceRecipeUrl + "', 'recipe');");
            $("#ingredient").append(viewButton);

            var favButton = $("<button>");
            favButton.addClass("favRecipe");
            favButton.attr("data-name", response.name);
            favButton.attr("data-id", response.id);
            favButton.attr("data-link", response.source.sourceRecipeUrl);
            favButton.attr("data-img", response.images[0].imageUrlsBySize["90"]);
            favButton.text("Favorite Recipe");
            $("#ingredient").append(favButton);
            $("#ingredient").append("<hr>");


            $("#grocery").on("click", function () {

            })

        }
    })

}

function showFavorites() {
    $("#favRecipe").empty();

    $.ajax("/api/getFavorites", {
        type: "GET"
    }).then(
        function (result) {
            state.favorites = result;

            for (i = 0; i < result.length; i++) {
                // var img = $("<img>");
                // img.attr("src", result[i].img);
                // $("#favRecipe").append(img);

                // var name = $("<p>");
                // name.addClass("favName");
                // name.text(result[i].name)
                // $("#favRecipe").append(name);


                // var viewButton = $("<button>");
                // viewButton.addClass("viewbutton");
                // viewButton.text("View Recipe");
                // viewButton.attr("onClick", "window.open('" + result[1].recipelink + "', 'recipe');");
                // $("#favRecipe").append(viewButton);
                // // $("#favRecipe").append("<br>");

                var div = $("<div>");
                
                var img= $("<img>");
                var viewButton = $("<button>");
                var addMeal = $("<button>");
                div.addClass("divide");
                addMeal.addClass("addMeal");
                addMeal.text("Add To Meal Plan");
                addMeal.attr("data-recipeId", result[i].recipeId);
               
                img.attr("src", result[i].img);
                
                viewButton.addClass("viewbutton");
                viewButton.text("View Recipe");
                viewButton.attr("onClick", "window.open('" + result[1].recipelink + "', 'recipe');");
              
                div.append(img);
                div.append($("<p>").text(result[i].name));
                div.append(img, viewButton, addMeal);
                $("#favRecipe").append(div);




                //debugger;
                // var total = $("<p>");
                // total.addClass("totalTime");
                // var test = result[i].totalTime;
                // total.text(result[i].totalTime);
                // $("#favRecipe").append(total);


                // var addMeal = $("<button>");
                // addMeal.addClass("addMeal");
                // addMeal.text("Add To Meal Plan");
                // addMeal.attr("data-recipeId", result[i].recipeId);
                // $("#favRecipe").append(addMeal);
                // $("#favRecipe").append("<br>");
                // $("#favRecipe").append("<br>", "<hr>");
        
            }
        }
    );
}


$("#fav").on("click", showFavorites)



$(document).on("click", ".favRecipe", favClick);

function favClick() {

    var newFav = {
        recipeId: $(this).attr("data-id"),
        name: $(this).attr("data-name"),
        recipelink: $(this).attr("data-link"),
        img: $(this).attr("data-img")
    };

    // add to the state variable the meal plan is using
    state.favorites.push(newFav);


    $.ajax("/api/addFavorite", {
        type: "POST",
        data: newFav
    }).then(
        function () {
            console.log("created new favorite");
        }
    );

}

// handler for view meal plan
$("#mealPlan").on("click", showMealPlan);

function showMealPlan() {
    console.log("showing meal plan")
    $.ajax("/api/getMeals", {
        type: "GET"
    }).then(
        function (result) {
            console.log(result);
            state.meals = result[0];
            showMeals();
        });
}

function showMeals() {
    for (j = 1; j <= 7; j++) {
        var propBreak = "day" + j + "_b";
        var propLunch = "day" + j + "_l";
        var propDinner = "day" + j + "_d";

        addMealToUi("#" + propBreak + "_p", state.meals[propBreak]);
        addMealToUi("#" + propLunch + "_p", state.meals[propLunch]);
        addMealToUi("#" + propDinner + "_p", state.meals[propDinner]);
    }
}

function addMealToUi(mealId, recipeId) {
    console.log("adding meal: " + mealId + ", " + recipeId);
    if(recipeId == null || recipeId.length < 1) {
        return;
    }

    $(mealId).attr("data-recipeId", recipeId);
    var fav = getFavorite(recipeId);
    $(mealId).text(fav.name);
}

// handler for adding to the meal plan when button clicked in fav list
$(document).on("click", ".addMeal", function () {
    console.log("adding meal to plan");
    if (!state.currentMeal) {
        alert("select a meal from the meal plan to add to first");
    } else {
        var recipeId = $(this).attr("data-recipeId");
        var mealId = state.currentMeal;

        addMealToUi(mealId, recipeId);

        var meals = getMealsFromUi();

        $.ajax("/api/updateMeals", {
            type: "POST",
            data: meals
        }).then(
            function () {
                console.log("csaved meals");
            }
        );
    }
});

function getFavorite(recipeId) {
    var fav = null;

    for (i = 0; i < state.favorites.length; i++) {
        if (state.favorites[i].recipeId === recipeId) {
            fav = state.favorites[i];
            break;
        }
    }

    return fav;
}

// handler for clicking a button in the meal plan
$(document).on("click", ".btn-danger", function () {
    var id = $(this).attr("id");
    var tag = "#" + id + "_p";
    state.currentMeal = tag;
    console.log("currentMeal=" + tag);
});

// handler for viewing a recipe when the name is clicked in the meal plan.
$(document).on("click", ".meal", function () {
    var fav = getFavorite($(this).attr("data-recipeId"));
    window.open(fav.recipelink, "recipe");
});



function getMealsFromUi() {
    var meals = {};

    for (i = 1; i <= 7; i++) {
        var tagBreak = "#day" + i + "_b_p";
        var tagLunch = "#day" + i + "_l_p";
        var tagDinner = "#day" + i + "_d_p";

        var propBreak = "day" + i + "_b";
        var propLunch = "day" + i + "_l";
        var propDinner = "day" + i + "_d";

        meals[propBreak] = $(tagBreak).attr("data-recipeId");
        meals[propLunch] = $(tagLunch).attr("data-recipeId");
        meals[propDinner] = $(tagDinner).attr("data-recipeId");
    }

    return meals;
}

