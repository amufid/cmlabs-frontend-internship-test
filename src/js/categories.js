$(document).ready(function () {
  const categoriesList = $("#categories");
  const isLoading = document.getElementById("loading");
  const failed = $("#failed");

  // fetch categories using ajax
  function fetchCategories() {
    $.ajax({
      url: "https://www.themealdb.com/api/json/v1/1/categories.php",
      method: "GET",
      beforeSend: function () {
        isLoading.style.display = "block";
      },
      success: function (response) {
        renderCategories(response.categories);
      },
      error: function (error) {
        console.error("Error fetching categories:", error);
        failed.append(`<p class="text-center">Error fetching categories.</p>`);
      },
      complete: function () {
        isLoading.style.display = "none";
      },
    });
  }

  function renderCategories(categories) {
    categoriesList.empty();
    if (categories.length === 0) {
      categoriesList.append("<p>No categories found.</p>");
    } else {
      categories.forEach(function (category) {
        const categoryItem = `
        <a href="./pages/category-detail.html?category=${category.strCategory}">
            <div 
              class="w-52 h-24 items-center rounded-lg bg-slate-400 hover:bg-slate-200 cursor-pointer overflow-hidden shadow-lg"
            >
               <h3 class="relative top-9 text-white font-bold text-center z-10 hover:text-green-400">
                  ${category.strCategory}
               </h3>
               <img 
                  src='${category.strCategoryThumb}' 
                  class="w-64 h-28 relative rounded-lg -top-8 brightness-50 hover:brightness-100 object-cover 
                  transform transition-transform duration-500 hover:scale-110"
               />
            </div>
        </a>
        `;
        categoriesList.append(categoryItem);
      });
    }
  }

  fetchCategories();
});

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    slides[i].classList.remove("roll-in", "roll-out");
  }

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  slides[slideIndex - 1].classList.add("roll-in");
  dots[slideIndex - 1].className += " active";

  setTimeout(function () {
    for (i = 0; i < slides.length; i++) {
      if (i !== slideIndex - 1) {
        slides[i].classList.add("roll-out");
      }
    }
  }, 3000);

  setTimeout(showSlides, 4000);
}
