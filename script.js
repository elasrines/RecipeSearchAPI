const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');
const featuredMealsSection = document.querySelector('.meal-preview');
const mealResultSection = document.querySelector('.meal-result');
const suggestionsTitle = mealResultSection.querySelector('.title:last-of-type'); // "Your Recipe Suggestions" title

// Initially hide the "Your Recipe Suggestions" section
suggestionsTitle.style.display = 'none';
mealList.style.display = 'none';

// Event listeners
searchBtn.addEventListener('click', () => {
    getMealList();
    toggleSections();
});
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});

// Fetch and display the meal list that matches the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('search-input').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "meal-item" data-id = "${meal.idMeal}">
                        <div class = "meal-img">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}

// Toggle sections visibility based on search
function toggleSections() {
    featuredMealsSection.style.display = 'none'; // Hide featured recipes
    suggestionsTitle.style.display = 'block';    // Show "Your Recipe Suggestions" title
    mealList.style.display = 'grid';             // Show meal results
}

// Get the recipe of the meal
function getMealRecipe(e){
    e.preventDefault();
    if(e.target.classList.contains('recipe-btn')){
        let mealItem = e.target.closest('.meal-item');  // More robust element selection
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals));
    }
}

function mealRecipeModal(meal){
    meal = meal[0];
    let html = `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class="recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="">
        </div>
        <div class="recipe-link">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
}

// Fetch and display featured meals on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchFeaturedMeals();
});

function fetchFeaturedMeals() {
    fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then(response => response.json())
    .then(data => {
        let html = '';
        if (data.meals) {
            // This limits to showing only the first 3 meals as a preview
            data.meals.slice(0, 3).forEach(meal => {
                html += `
                    <div class="meal-item" data-id="${meal.idMeal}">
                        <div class="meal-img">
                            <img src="${meal.strMealThumb}" alt="food image">
                        </div>
                        <div class="meal-name">
                            <h3>${meal.strMeal}</h3>
                            <a href="#" class="recipe-btn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            document.getElementById('featured-meals').innerHTML = html;
        } else {
            document.getElementById('featured-meals').innerHTML = '<p>No featured recipes available.</p>';
        }
    })
    .catch(error => {
        console.log(error);
        document.getElementById('featured-meals').innerHTML = '<p>Error loading featured recipes.</p>';
    });
}
