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

    // $("#game").on("click", () => {
    //     alert("geex");
    // });
});

jQuery.ajaxPrefilter(function(options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});



$("#closeSearch").on("click", function () {
    $("#rise").hide();
});

$(".fas").on("click", function () {
    $("#rise").show();
})

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
    $("#mealPlanHide").hide();
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

                var div = $("<div>");
                div.addClass("swiper");
                var img = $("<img>");
                img.attr("src", response.matches[i].smallImageUrls[0]);
                $("#recipeSearch").append(img);
                img.css("height", "150px");
                img.css("width", "150px");

                var p = $("<p>");
                p.addClass("dishName");
                p.attr("data-id", response.matches[i].id);

                p.text(response.matches[i].recipeName);
                div.append(img, p);

                $("#recipeSearch").append(div);

                // $("#recipeSearch").append(response.matches[i].ingredients + "<br>");

            }
        }
    })
});

$(document).on("click", ".dishName", itemClick);
function itemClick() {
    var id = ($(this).attr("data-id"));
    console.log("showing item: " + id);
    var queryURL = "http://api.yummly.com/v1/api/recipe/" + id + "?_app_id=bf960ba7&_app_key=ceae6e226000faadd006d0088b7aff71";
    console.log("Getting: " + id);
    $.ajax({
        url: queryURL,
        method: "GET",
        async: false,
        error: function(data,status,err){
            $("#ingredient").empty();

            var pMessage = $("<p>");
            pMessage.text("Service Temporary Unavailable. Try Again Later");
            $("#ingredient").append(pMessage);

            var pError = $("<p>");
            pError.text(err);
            $("#ingredient").append(pError);
        },
        success: (response) => {
            console.log("rendering: " + id);
            $("#ingredient").empty();

            // display recipe name
            var p = $("<p>");
            p.addClass("ingName");
            p.text(response.name);
            p.css("color", "red");
            p.css("font-family", "fantasy");
            $("#ingredient").append(p);


            // display total time
            var p2 = $("<p>");
            p2.addClass("totalTime");
            p2.text("Total Time: " + response.totalTime);
            // p.css("color", "red");
            // p.css("font-family", "fantasy");
            $("#ingredient").append(p2);

            // show ingredients
            for (i = 0; i < response.ingredientLines.length; i++) {
                $("#ingredient").append(response.ingredientLines[i] + "<br>");
            }

            // add the view button
            var viewButton = $("<button>");
            viewButton.addClass("viewbutton");
            viewButton.text("View Recipe");
            viewButton.attr("onClick", "window.open('" + response.source.sourceRecipeUrl + "', 'recipe');");
            $("#ingredient").append(viewButton);

            var fav = getFavorite(response.id);
            if (fav == null) {
                // add the fav button
                var favButton = $("<button>");
                favButton.addClass("favRecipe");
                favButton.attr("data-name", response.name);
                favButton.attr("data-id", response.id);
                favButton.attr("data-link", response.source.sourceRecipeUrl);
                favButton.attr("data-img", response.images[0].imageUrlsBySize["90"]);
                favButton.attr("data-totalTime", response.totalTime);
                favButton.text("Favorite Recipe");
                $("#ingredient").append(favButton);
                $("#ingredient").append("<hr>");
            }
        }
    })

}

function loadFavorites() {
    $.ajax("/api/getFavorites", {
        type: "GET"
    }).then(
        function (result) {
            state.favorites = result;

            for (i = 0; i < result.length; i++) {
                var div = $("<div>");

                var img = $("<img>");
                var viewButton = $("<button>");
                var addMeal = $("<button>");
                div.addClass("divide");
                addMeal.addClass("addMeal");
                addMeal.text("Add To Meal Plan");
                addMeal.attr("data-recipeId", result[i].recipeId);

                img.attr("src", result[i].img);

                viewButton.addClass("viewbutton");
                viewButton.text("View Recipe");
                viewButton.attr("onClick", "window.open('" + result[i].recipelink + "', 'recipe');");

                div.append(img);
                div.append($("<p>").text(result[i].name));
                div.append(img, viewButton, addMeal);
                $("#favRecipeDiv").append(div);

            }
        }
    );
}

function showFavorites() {
    if ($("#favRecipeDiv").is(":visible")) {
        $("#favRecipeDiv").hide();
        $("#favBtn").text("Show Favorite Recipes");
    } else {
        $("#favRecipeDiv").empty();
        $("#favRecipeDiv").show();
        $("#favBtn").text("Hide Favorite Recipes");

        loadFavorites();
    }
}


$("#favBtn").on("click", showFavorites)



$(document).on("click", ".favRecipe", favClick);

function favClick() {

    var newFav = {
        recipeId: $(this).attr("data-id"),
        name: $(this).attr("data-name"),
        recipelink: $(this).attr("data-link"),
        img: $(this).attr("data-img"),
        totalTime: $(this).attr("data-totalTime")
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
$("#mealPlanBtn").on("click", showMealPlan);

function showMealPlan() {
    if ($("#mealPlanDiv").is(":visible")) {
        $("#mealPlanDiv").hide();
        $("#mealPlanBtn").text("Show Meal Plan");
    } else {
        console.log("showing meal plan");
        $.ajax("/api/getMeals", {
            type: "GET"
        }).then(
            function (result) {
                console.log(result);
                state.meals = result[0];
                showMeals();
                $("#mealPlanDiv").show();
                $("#mealPlanBtn").text("Hide Meal Plan");
            });
    }
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
    if (recipeId == null || recipeId.length < 1) {
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

        saveMealPlan();
    }
});

function saveMealPlan() {
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

$(document).on("click", ".btn-warning", function () {
    // get the id of the button clicked
    var day = $(this).attr("id");

    // use that id to build the id string of the p tags
    var b_p = "#" + day + "_b_p";
    $(b_p).text("");
    $(b_p).attr("data-recipeId", "");

    var l_p = "#" + day + "_l_p";
    $(l_p).text("");
    $(l_p).attr("data-recipeId", "");

    var d_p = "#" + day + "_d_p";
    $(d_p).text("");
    $(d_p).attr("data-recipeId", "");

    // save the meal plan
    saveMealPlan();
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

$(document).ready(function () {
    $("#mealPlanDiv").hide();
    $("#favRecipeDiv").hide();
    loadFavorites();
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

