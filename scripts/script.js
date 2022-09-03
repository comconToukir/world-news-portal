const loadCategories = data => {
  const categorySection = document.getElementById('all-categories');
  const nav = document.createElement('nav');
  nav.classList.add("grid", "grid-cols-2", "sm:grid-cols-3", "md:grid-cols-4", "xl:grid-cols-8", "gap-2");
  data.forEach(category => {
    nav.innerHTML += `
      <button id="category-${category.category_id}" class="category-btn text-left xl:text-center active:text-accent p-3">${category.category_name}</button>
    `
  });
  nav.children[0].classList.add("active");
  categorySection.appendChild(nav);
  const btns = document.getElementsByClassName('category-btn');
  for (const btn of btns) {
    btn.addEventListener('click', e => {
      const current = document.getElementsByClassName('active');
      current[0].classList.remove("active");
      e.target.classList.add("active");
    })
  }
}

const displayNewsCount = (length, category) => {
  const newsCount = document.getElementById('news-count');
  showSpinner('news-count', false);
  if (!length) {
    newsCount.innerText = `No news found for ${category} category`;
  } else {
    newsCount.innerText = `${length} news found for ${category} category`;
  }
};

const showSpinner = isLoading => {
  const spinner = document.getElementById('spinner');
  if (isLoading) {
    spinner.classList.remove('hidden');
  } else {
    spinner.classList.add('hidden');
  }
}

const dataCheck = data => {
  if(data) {
    return data;
  } else {
    return "No Data Found";
  }
}

// const getRatings = (data, id) => {
//   if (typeof data !== "number") {
//     return data;
//   } else {
//     const rating = Math.floor(((data % 1) * 2) + (parseInt(data) * 2));
//     const ratingsDiv = document.getElementById("ratings-"+id);
//     console.log(data, rating, ratingsDiv)
//     // ratingsDiv.childNodes[rating].classList.add('checked');
//   }
// }



const displayModal = async id => {
  try {
    const url = `https://openapi.programming-hero.com/api/news/${id}`;
    await fetch(url)
    .then(res => {
      if(!res.ok) {
        throw new Error(`Network response was not ok`);
      }
      return res.json();
    })
    .then(data => {
      const [news] = data.data;
      const modalContainer = document.getElementById('modal-section')
  
      modalContainer.innerHTML = `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-div text-center w-5/6 md:w-3/5 xl:w-1/2 flex flex-col items-center bg-base-200">
          <div class="relative w-full">
            <button class="badge-accent absolute right-3 top-3 py-4 px-6 rounded-xl font-bold" id="modal-close-btn">X</button>
            <img class="object-contain w-full mb-5" src=${news.image_url} alt=""/>
          </div>
          <div class="flex mb-4">
            ${news.others_info.is_todays_pick ? `<div class="badge badge-primary">Today's Pick</div>` : ""}
            ${news.others_info.is_trending ? `<div class="badge badge-accent">Trending</div>` : ""}
          </div>
          <h2 class="mb-5 text-xl md:text-2xl xl:text-4xl">${news.title}</h2>
          <p class="mb-7 font-light">Photo - ${news.details}</p>
          <div class="grid grid-cols-3 items-center mb-5">
            <div class="flex">
              <img class="author-img rounded-full mr-2" src='${dataCheck(news.author.img)}' alt="" />
              <div>
                <p class="text-sm">${dataCheck(news.author.name)}</p>
                <p class="text-sm">${dataCheck(news.author.published_date?.split(' ')[0])}</p>
              </div>
            </div>
            <div class="mx-2">
              <p><i class="text-accent fa-regular fa-eye mr-2"></i>${dataCheck(news.total_view)}</p>
            </div>
            <div class="rating rating-lg rating-half mx-2" id="ratings-${news._id}">
              <input type="radio" name="rating-${news._id}" class="rating-hidden" />
              <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" disabled />
              <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
              <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" disabled />
              <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
              <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" disabled />
              <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
              <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" disabled />
              <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
              <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" checked disabled />
              <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
            </div>
          </div>
        </div>
      </div>
      `
      document.getElementById('modal-close-btn').onclick = function () {
        const modalDiv = document.getElementById('modal-overlay')
        modalDiv.style.display ='none';
        modalDiv.innerHTML = ``;
      }
    })
    .catch((error) => console.log(error))
  } catch (error) {
    console.error(`error caught from catch block`, error);
  }
}

const displayNewsList = newsArr => {
  const newsList = document.getElementById('news-list');
  const newsDiv = document.createElement('div');

  newsArr.forEach(news => {
    newsDiv.innerHTML += `
    <div class="card md:card-side bg-base-200 shadow-lg mb-7 p-2">
      <figure><img class="hidden md:block" src=${news.thumbnail_url} alt="News Thumbnail"></figure>
      <figure><img class="block md:hidden rounded-xl" src=${news.image_url} alt="News Thumbnail"></figure>
      <div class="card-body py-4 px-6">
        <h2 class="card-title mb-3 text-xl md:text-2xl xl:text-4xl">${news.title}</h2>
        <p class="font-light hidden lg:block">${news.details.split(" ").slice(0, 40).join(" ")}...</p>
        <div class="card-actions grid grid-cols-2 lg:grid-cols-4 items-center">
          <div class="flex">
            <img class="author-img rounded-full mr-2" src='${dataCheck(news.author.img)}' alt="" />
            <div>
              <p class="text-sm">${dataCheck(news.author.name)}</p>
              <p class="text-sm">${dataCheck(news.author.published_date?.split(' ')[0])}</p>
            </div>
          </div>
          <div class="mx-2">
            <p><i class="text-accent fa-regular fa-eye mr-2"></i>${dataCheck(news.total_view)}</p>
          </div>
          <div class="rating rating-lg rating-half mx-2" id="ratings-${news._id}">
            <input type="radio" name="rating-${news._id}" class="rating-hidden" />
            <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" disabled />
            <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
            <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" disabled />
            <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
            <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" disabled />
            <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
            <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" disabled />
            <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
            <input type="radio" name="rating-${news._id}" class="bg-accent ml-1 mask mask-star-2 mask-half-1" checked disabled />
            <input type="radio" name="rating-${news._id}" class="bg-accent mr-1 mask mask-star-2 mask-half-2" disabled />
          </div>
          <button class="text-white bg-accent py-1 px-6 w-fit ml-auto rounded-md" onclick="displayModal('${news._id}')">Details</button>
        </div>
      </div>
    </div>
    `
  })
  showSpinner(false);
  newsList.appendChild(newsDiv);
};

window.onload = async () => {
  showSpinner(true);
  try {
    const url = `https://openapi.programming-hero.com/api/news/categories`;
    await fetch(url)
    .then(res => {
      if(!res.ok) {
        throw new Error(`Network response was not ok`);
      }
      return res.json();
    })
    .then(async data => {
      loadCategories(data.data.news_category)

      const url = `https://openapi.programming-hero.com/api/news/category/01`;
      await fetch(url)
      .then(res => res.json())
      .then(data => {
        displayNewsCount(data.data.length, "Breaking News");
        displayNewsList(data.data);
      })
    })
    .catch((error) => console.log(error))
  } catch (error) {
    console.error(`error caught from catch block`, error);
  }
}

document.getElementById('all-categories').addEventListener('click', async e => {
  if (e.target.id.includes('category')) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ``;
    showSpinner(true);
    const category_id = e.target.id.split("-").pop();
    const category = e.target.innerText;
    const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`;

    try {
      await fetch(url)
      .then(res => {
        if(!res.ok) {
          throw new Error(`Network response was not ok`);
        }
        return res.json();
      })
      .then(data => {
        displayNewsCount(data.data.length, category);
        displayNewsList(data.data);
      })
      .catch((error) => console.log(error))
    } catch (error) {
      console.error(`error caught from catch block`, error);
    }
  }
})

window.onclick = function (e) {
  const modal = document.getElementById('modal-overlay');
  if (e.target.id === "modal-overlay") {
    modal.style.display = 'none';
    modal.innerHTML = ``;
  }
}

