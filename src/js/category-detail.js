$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryName = urlParams.get("category");
  const mealsList = $("#meals");
  const title = $("#title-meals");
  const isLoading = document.getElementById("loading");
  const breadcrumbsCategory = $("#breadcrumbs-category");

  title.append(`${categoryName} Meals`);
  breadcrumbsCategory.append(`<p>${categoryName}</p>`);

  if (!categoryName) {
    alert("Category name is missing!");
    return;
  }

  function fetchCategoryDetail() {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`,
      method: "GET",
      beforeSend: function () {
        isLoading.style.display = "block";
      },
      success: function (response) {
        renderMeals(response.meals);
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

  function renderMeals(meals) {
    mealsList.empty();
    if (meals.length === 0) {
      mealsList.html("<p>No meal found.<p/>");
    } else {
      meals.forEach(function (meal) {
        const mealItems = `
         <a href="meal-detail.html?category=${meal.idMeal}">
            <div class="w-52 h-44 items-center rounded-xl cursor-pointer overflow-hidden shadow-lg bg-slate-500">
               <h3 class="relative text-white font-bold text-center z-10 hover:text-green-400 m-3 ${
                 meal.strMeal.length > 40 ? "top-9" : "top-[70px]"
               }"
               >
                  ${meal.strMeal}
               </h3>
               <img 
                  src='${meal.strMealThumb}' 
                  class="w-full h-auto relative rounded-lg brightness-50 hover:brightness-100 object-cover transform 
                  transition-transform duration-300 hover:scale-110 ${
                    meal.strMeal.length > 40
                      ? "-top-[120px]"
                      : meal.strMeal.length > 23
                      ? "-top-[73px]"
                      : "-top-12"
                  }"
               />
            </div>
         </a>
        `;
        mealsList.append(mealItems);
      });
    }
  }

  fetchCategoryDetail();
});
