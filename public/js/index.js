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

                $("#recipeSearch").append(response.matches[i].ingredients + "<br>");

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
            $("#ingredient").empty();
            var p = $("<p>");
            p.addClass("ingName");
            p.text(response.name);
            p.css("color", "red");
            p.css("font-family", "fantasy");
            $("#ingredient").append(p);

            for (i = 0; i < response.ingredientLines.length; i++) {

                $("#ingredient").append(response.ingredientLines[i] + "<br>");

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

        }
    })

}


$("#fav").on("click", () => {
    $("#favRecipe").empty();

    $.ajax("/api/getFavorites", {
        type: "GET"
    }).then(
        function (result) {
            for (i = 0; i < result.length; i++) {
                var img = $("<img>");
                img.attr("src", result[i].img);
                $("#favRecipe").append(img);

                var name = $("<p>");
                name.addClass("favName");
                name.text(result[i].name)
                $("#favRecipe").append(name);

                var viewButton = $("<button>");
                viewButton.addClass("viewbutton");
                viewButton.text("View Recipe");
                viewButton.attr("onClick", "window.open('" + result[1].recipelink + "', 'recipe');");
                $("#favRecipe").append(viewButton);
                $("#favRecipe").append("<br>");

            

                var addMeal = $("<button>");
                addMeal.addClass("addmeal");
                addMeal.text("Add To Meal Plan");
                $("#favRecipe").append(addMeal);
                $("#favRecipe").append("<br>");
                $("#favRecipe").append("<br>", "<hr>");
            }
        }
    );
})



$(document).on("click", ".favRecipe", favClick);

function favClick() {

    var newFav = {
        recipeId: $(this).attr("data-id"),
        name: $(this).attr("data-name"),
        recipelink: $(this).attr("data-link"),
        img: $(this).attr("data-img")
    };


    $.ajax("/api/addFavorite", {
        type: "POST",
        data: newFav
    }).then(
        function () {
            console.log("created new favorite");

            //   location.reload();
        }
    );

}

$(document).on("click", ".btn", function(){
    var id = $(this).text;
    alert(id);
    var spn = "#" + id + "_span";
    alert(spn);
    $(spn).text("hey");
});
