let getFavorites = function() {
    let list = [];
    let favorites = JSON.parse(localStorage.getItem("favorites"));
    if(favorites) {
        list.push(favorites);
    } else {
        list = "";
    }
    return list;
};

let savePairing = function() {
    let saveData = getFavorites();
    let meal = document.querySelector(".meal-name").textContent;
    let drink = document.querySelector(".cocktail-name").textContent;
    let pairing = meal + " & " + drink;

    if(saveData) {
        saveData.push(pairing);
    } else {
        saveData = pairing;
    }

    localStorage.setItem("favorites", JSON.stringify(saveData));
    document.querySelector(".save-button").removeEventListener("click", savePairing);
};

let addFavoriteSection = function() {
    let mainBody = document.querySelector(".main-body");
    let newSection = document.createElement("section");
    newSection.className = "userselect-container";
    mainBody.appendChild(newSection);

    let newDiv = document.createElement("div");
    newDiv.classList = "user-select m-5 p-6 is-half-tablet is-third-desktop";
    newSection.appendChild(newDiv);

    let newHeader = document.createElement("h3");
    newHeader.textContent = "Would you like to save this pairing as a favorite?";
    newHeader.classList = "title has-text-white";
    newDiv.appendChild(newHeader);

    for(let i = 0; i < 2; i++) {
        let button = document.createElement("button");
        button.classList = "button save-button is-medium";
        if(i < 1) {
            button.textContent = "Save As Favorite";
            button.addEventListener("click", function(event) {
                event.target.textContent = "Saved!"
                savePairing();
            })
        } else {
            button.textContent = "Find A New Pairing";
            button.addEventListener("click", function() {
                location.reload();
            })
        }
        newDiv.appendChild(button);
    }
};

let displayCocktailIngredients = function(data) {
    let mainSection  = document.querySelector(".cocktail-container");
    mainSection.style.flexDirection = "column";
    let newDiv = document.createElement("div");
    newDiv.classList = "ingredient-box cocktail-box m-5 is-half-tablet is-one-third-desktop";
    mainSection.appendChild(newDiv);

    let ingredientsTitle = document.createElement("h3");
    ingredientsTitle.textContent = "Ingredients:";
    ingredientsTitle.classList = "title is-4 has-text-white pb-1 pt-4";
    newDiv.appendChild(ingredientsTitle);

    let newList = document.createElement("ul");
    newDiv.appendChild(newList);

    for(let i = 1; i < 16; i++) {
        let ingredient = "strIngredient" + i;
        let listItem = document.createElement("li");
        listItem.classList = "is-size-5 has-text-white mb-2";

        if(data.drinks[0][ingredient]) {
            listItem.textContent = data.drinks[0][ingredient];
            newList.appendChild(listItem);
        }
    }

    let cocktailChoice = document.querySelectorAll(".cocktail");
    cocktailChoice.forEach(cocktail => {
        cocktail.removeEventListener("click", cocktailSelectEvent);
    })

    addFavoriteSection();
};

let clearOtherCocktails = function(event) {
    let mainSection = document.querySelector(".cocktail-container");
    let cocktailSelection = $(event.target).closest(".cocktail")[0];

    while(mainSection.firstChild) {
        mainSection.removeChild(mainSection.firstChild);
    }
    mainSection.appendChild(cocktailSelection);
};

let cocktailSelectEvent = function(event) {
    clearOtherCocktails(event);

    let cocktail = $(event.target).text().trim();
    let apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + cocktail;
    
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayCocktailIngredients(data);
            })
        }
    })
};

// Display the cocktail and it's ingredients on the page
let displayDrink = function(data) {
    let mainSection = document.querySelector(".cocktail-container");
    let newDiv = document.createElement("div");
    newDiv.classList = "cocktail cuisine-box level m-5";
    newDiv.id = "top-column"
    newDiv.style.backgroundImage = ("url('" + data.drinks[0].strDrinkThumb + "')");
    newDiv.style.backgroundSize = "contain";
    mainSection.appendChild(newDiv);

    let newCocktail = document.createElement("h3");
    newCocktail.textContent = data.drinks[0].strDrink;
    newCocktail.classList = "title cocktail-name is-4 mb-2 p-1";
    newDiv.appendChild(newCocktail);

    let cocktailChoice = document.querySelectorAll(".cocktail");
    cocktailChoice.forEach(cocktail => {
        cocktail.addEventListener("click", cocktailSelectEvent);
    })
    
};

let createCocktailSection = function() {
    let mainBody = document.querySelector(".main-body");
    let newSection = document.createElement("section");
    newSection.className = "cocktail-container";
    mainBody.appendChild(newSection);
};

// Replace this fetch with the correct url with the corresponding cocktail
// based on the selected dish
let getCocktail = function() {
    createCocktailSection()
    // Call API three times for three random drinks
    for(let i = 0; i < 3; i++) {
        fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    displayDrink(data);
                })
            }
        })
    }
};

let displayIngredients = function(data) {
    // Assign the ingredient array to the variable `ingredients`
    let ingredients = data.results[0].missedIngredients;
    let mainBody = document.querySelector(".main-body");
    mainBody.style.justifyContent = "start";
    let mainDiv = document.querySelector(".options-container");

    let newDiv = document.createElement("div");
    newDiv.classList = "ingredient-box m-5 is-half-tablet is-one-third-desktop";
    mainDiv.appendChild(newDiv);

    let ingredientsTitle = document.createElement("h3");
    ingredientsTitle.textContent = "Ingredients:";
    ingredientsTitle.classList = "title is-4 has-text-white pb-1 pt-4";
    newDiv.appendChild(ingredientsTitle);

    let newList = document.createElement("ul");
    newDiv.appendChild(newList);

    // Loop through the ingredients array and display ingredients
    for(let i = 0; i < ingredients.length; i++) {
        let newItem = document.createElement("li");
        newItem.textContent = ingredients[i].original;
        newItem.classList = "is-size-5 has-text-white mb-2";
        newList.appendChild(newItem);
    }
    
    getCocktail();

    // Replace current event listener - might have to be in another place?
    cuisines.forEach(cuisine => {
        cuisine.removeEventListener("click", getRecipe);
    });
};

let clearOtherMeals = function(event) {
    // Grab main section with meal options as child elements
    let mainBody = document.querySelector(".options-container");
    // Assign the div of the meal that the user chose
    let selectedDish = $(event.target).closest("#cuisines")[0];

    // Clear the main section
    while(mainBody.firstChild) {
        mainBody.removeChild(mainBody.firstChild);
    }

    // Add the div of the meal that the user chose
    mainBody.appendChild(selectedDish);
};

// When a meal is selected, display the ingredient data of that specified meal
let getRecipe = function(event) {
    // Call function to clear other meal options
    clearOtherMeals(event);
    // Find the correct element with dish name based on the event variable
    let dish = $(event.target).closest("#cuisines").find(".title").text();
    // Add a variable with your own API key and replace mine in the apiUrl
    let adairKey = "52217abe5a7b45b58b6466ee89a8d551";
    let bryanKey = "e7f051642373424f8d6926d5bbf50dcc";
    let adairKey2 = "11e8d764720140219f15bde44e6550be";
    let apiUrl = "https://api.spoonacular.com/recipes/complexSearch?query=" + dish + "&fillIngredients=true&apiKey=" + adairKey;


    // Grab ingredient data from the specified dish
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                // Call displayIngredients() with the dish data
                displayIngredients(data, event);
            })
        }
    })
};

// Add correct classname to correspond with the correct 
let renameDivs = function(cuisineClass) {
    let divs = document.querySelectorAll(".cuisine-box");
    divs.forEach(rename => {
        rename.classList.replace(rename.classList[0], cuisineClass);
    })
};

// Display the loaded meals
let displayDishes = function(data, cuisineClass) {
    renameDivs(cuisineClass)
    // Loop through the amount of meal results and display them on the page
    for(let i = 0; i < data.results.length; i++) {
        // Search for the correct div specified by its targe attribute
        let selectDiv = $("[target=dish" + i + "]");
        let parentDiv = selectDiv[0].parentNode;
        selectDiv[0].innerHTML = data.results[i].title;
        selectDiv[0].classList.remove("has-text-grey-dark");
        selectDiv[0].classList.add("meal-name", "has-text-white");

        // Remove and add class names to move text to bottom
        selectDiv[0].classList.remove("level-item");
        selectDiv[0].classList.add("mb-2");

        // Add background image to each div
        parentDiv.style.backgroundImage = ("url('" + data.results[i].image + "')");
        parentDiv.style.backgroundRepeat = "no-repeat";
        parentDiv.style.backgroundSize = "cover";
    }

    // Remove initial event listener and add another onClick event listener
    // to call getRecipe() when a meal is selected
    cuisines.forEach(cuisine => {
        cuisine.removeEventListener("click", cuisineSelectEvent);
        cuisine.addEventListener("click", getRecipe);
    });
};

// Search for a specified amount of meals based on the selected cuisine
let getMeals = function(cuisine, cuisineClass) {
    // Add your own apiKey and replace mine in the apiUrl
    let adairKey = "52217abe5a7b45b58b6466ee89a8d551";
    let adairKey2 = "11e8d764720140219f15bde44e6550be";
    let bryanKey = "e7f051642373424f8d6926d5bbf50dcc";
    let apiUrl = "https://api.spoonacular.com/recipes/complexSearch?cuisine=" + cuisine + "&number=6&apiKey=" + adairKey;

    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                // Get meal data from selected cuisine and call displayDishes()
                displayDishes(data, cuisineClass);
            })
        }
    })
};

//  When the user clicks on a cuisine options, this function saves
// that cuisine, trims the contents of any whitespace, then calls getMeals()
let cuisineSelectEvent = function(event) {
    let cuisineClass = $(event.target).closest(".cuisine-box")[0].classList[0];
    let choice = event.target.textContent;
    getMeals(choice.trim(), cuisineClass);
};

// Add an onClick event listener for the cuisine boxes
let cuisines = document.querySelectorAll("#cuisines");
cuisines.forEach(cuisine => {
    cuisine.addEventListener("click", cuisineSelectEvent)
});

let clearMainPage = function() {
    let mainBody = document.querySelector(".main-body");
    while(mainBody.firstChild) {
        mainBody.removeChild(mainBody.firstChild);
    }

    let heroSection = document.querySelector(".hero-body");
    while(heroSection.firstChild) {
        heroSection.removeChild(heroSection.firstChild);
    }
};

let loadUserFavorites = function() {
    let saveData = getFavorites().toString();
    let favorites = saveData.split(",");

    clearMainPage();

    let mainBody = document.querySelector(".main-body");
    mainBody.style.justifyContent = "center";
    let newSection = document.createElement("section");
    newSection.classList = "user-favorites";
    mainBody.appendChild(newSection);


    if (favorites == "" ) {
        let grabSection = document.querySelector(".user-favorites");
        let noFavorites = document.createElement("div");
        let noFavEl = document.createElement("h3");

        noFavorites.classList = "favorite-meal cuisine-box";
        noFavEl.classList = "title is-4 m-5";
        noFavEl.textContent = "You don't have any favorite pairings yet!";
        grabSection.appendChild(noFavorites);
        noFavorites.appendChild(noFavEl);

    } else {
        for(let i = 0; i < favorites.length; i++) {
            let dish = favorites[i].split(" &")[0];
            let drink = favorites[i].split("& ")[1];
    
            let pairingDiv = document.createElement("div");
            pairingDiv.classList = "pairing my-3";
            newSection.appendChild(pairingDiv);
    
            let mealDiv = document.createElement("div");
            mealDiv.classList = "favorite-meal cuisine-box";
            let drinkDiv = document.createElement("div");
            drinkDiv.classList = "favorite-drink cuisine-box";
            pairingDiv.appendChild(mealDiv);
            pairingDiv.appendChild(drinkDiv);
    
            let mealTitle = document.createElement("h3");
            mealTitle.classList = "title is-4 m-5";
            mealTitle.textContent = dish;
            mealDiv.appendChild(mealTitle);
    
            let drinkTitle = document.createElement("h3");
            drinkTitle.classList = "title is-4 m-5";
            drinkTitle.textContent = drink;
            drinkDiv.appendChild(drinkTitle);
        }
    }

};

document.querySelector("#favorites").addEventListener("click", loadUserFavorites);