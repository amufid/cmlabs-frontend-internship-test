$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const mealId = urlParams.get("category");
  const mealsList = $("#meals");
  const isLoading = document.getElementById("loading");
  const breadcrumbsCategory = $("#breadcrumbs-category");
  const breadcrumbsMeal = $("#breadcrumbs-meal");

  function fetchCategoryDetail() {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      method: "GET",
      beforeSend: function () {
        isLoading.style.display = "block";
      },
      success: function (response) {
        renderMeals(response);
      },
      error: function (error) {
        console.log("Error fetching meals:", error);
        failed.append(`<p class="text-center">Error fetching categories.</p>`);
      },
      complete: function () {
        isLoading.style.display = "none";
      },
    });
  }

  function renderMeals(response) {
    mealsList.empty();
    if (response.meals.length === 0) {
      mealsList.html("<p>No meal found.<p/>");
    } else {
      const meal = response.meals[0];
      // filter strIngredient yang memiliki value
      const recipes = Object.entries(meal).filter(
        ([key, value]) => key.startsWith("strIngredient") && value
      );

      // menambahkan embed pada link Youtube
      function embedUrl(url) {
        const videoId = url.split("v=")[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      response.meals.forEach(function (meal) {
        const mealItems = `
         <h3 class="text-4xl my-5">
            ${meal.strMeal}
         </h3>
         <h5 class="text-lg my-3 text-red-500 font-semibold">${
           meal.strArea
         }</h5>
         <div class="flex min-[400px]:flex-col md:flex-col xl:flex-row gap-x-4 justify-center">
            <img
               src="${meal.strMealThumb}"
               class="w-[400px] h-96 rounded-lg overflow-hidden shadow-lg"
            />
            <div class="w-full sm:w-[455px]">
              <h4 class="text-3xl mb-5">Instructions</h4>
              <p>${meal.strInstructions}</p>
              <h4 class="text-3xl mt-7 mb-5">Recipes</h4>
              <ul class="list-disc ml-5">
                ${Array.from(
                  { length: recipes.length },
                  (_, index) => `
                  <li>${meal["strMeasure" + (index + 1)]} ${
                    meal["strIngredient" + (index + 1)]
                  }
                  </li>
                `
                ).join("")}
              </ul>
            </div>
         </div>
         <div class="mx-auto mb-5">
          <h4 class="text-3xl mt-7 text-center mb-5">Tutorials</h4>
          <iFrame 
            src="${embedUrl(meal.strYoutube)}" 
            class="sm:w-[400px] md:w-[500px] lg:w-[700px] xl:w-[870px] sm:h-auto md:h-[200px] lg:h-[400px] xl:h-[550px]"
            frameborder="0" 
            allowfullscreen
          ></iFrame>
         </div>
         `;
        mealsList.append(mealItems);
        breadcrumbsCategory.append(`<p>${meal.strCategory}</p>`);
        breadcrumbsMeal.append(`<p>${meal.strMeal}</p>`);
      });
    }
  }

  fetchCategoryDetail();
});
