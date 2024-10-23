$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryName = urlParams.get("category");
  const mealsList = $("#meals");
  const title = $("#title-meals");
  const isLoading = document.getElementById("loading");
  const breadcrumbsCategory = $("#breadcrumbs-category");
  let mealsData = [];

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
        mealsData = response.meals;
        renderMeals(mealsData);
        renderPagination(mealsData);
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
    if (!Array.isArray(meals)) {
      mealsList.html("<p>No meal found.<p/>");
      return;
    }
    mealsList.empty();
    if (meals.length === 0) {
      mealsList.html("<p>No meal found.<p/>");
    } else {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const visibleData = meals.slice(startIndex, endIndex);
      visibleData.forEach(function (meal) {
        const mealItems = `
         <a href="meal-detail.html?category=${meal.idMeal}">
            <div class="w-72 sm:w-52 h-44 items-center rounded-xl cursor-pointer overflow-hidden shadow-lg bg-slate-500">
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

  const itemsPerPage = 8;
  let currentPage = 1;

  function renderPagination(meals) {
    if (!Array.isArray(meals)) {
      mealsList.html("<p>No meal found.<p/>");
      return;
    }
    const totalPages = Math.ceil(meals.length / itemsPerPage);

    $("#pagination-container").empty();

    $("#pagination-container").append(
      `<button class="px-4 py-2 bg-gray-300 rounded ${
        currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
      }" 
        id="prev-btn">Previous</button>`
    );

    const visiblePages = 2;
    let startPage = Math.max(1, currentPage - visiblePages);
    let endPage = Math.min(totalPages, currentPage + visiblePages);

    if (startPage > 2) {
      $("#pagination-container").append(
        `<button class="px-4 py-2 bg-gray-300 rounded page-btn" data-page="1">1</button>`
      );
      if (startPage > 3) {
        $("#pagination-container").append(`<span class="px-2">...</span>`);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      $("#pagination-container").append(
        `<button class="px-4 py-2 ${
          i === currentPage ? "bg-green-500 text-white" : "bg-gray-300"
        } rounded page-btn" 
          data-page="${i}"
         >
         ${i}
         </button>`
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        $("#pagination-container").append(`<span class="px-2">...</span>`);
      }
      $("#pagination-container").append(
        `<button 
          class="px-4 py-2 bg-gray-300 rounded page-btn" 
          data-page="${totalPages}"
        >
          ${totalPages}
        </button>`
      );
    }

    $("#pagination-container").append(
      `<button 
        class="px-4 py-2 bg-gray-300 rounded ${
          currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
        }" 
        id="next-btn">
        Next
      </button>`
    );
  }

  fetchCategoryDetail();

  // Pagination button
  $(document).on("click", ".page-btn", function () {
    currentPage = parseInt($(this).data("page"));
    renderMeals(mealsData);
    renderPagination(mealsData);
  });

  // Previous button
  $(document).on("click", "#prev-btn", function () {
    if (currentPage > 1) {
      currentPage--;
      renderMeals(mealsData);
      renderPagination(mealsData);
    }
  });

  // Next button
  $(document).on("click", "#next-btn", function () {
    const totalPages = Math.ceil(mealsData.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderMeals(mealsData);
      renderPagination(mealsData);
    }
  });
});
