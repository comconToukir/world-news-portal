// will be used to later store news array and do sorting
let newsStore;

// shows different categories in the ui
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

// number of news for selected category is shown in the ui
const displayNewsCount = (length, category = "Breaking News") => {
  const newsCount = document.getElementById('news-count');
  showSpinner('news-count', false);
  if (!length) {
    newsCount.innerText = `No news found for ${category} category`;
  } else {
    newsCount.innerText = `${length} news found for ${category} category`;
  }
};

// shows a spinner in the ui before data loads
const showSpinner = isLoading => {
  const spinner = document.getElementById('spinner');
  if (isLoading) {
    spinner.classList.remove('hidden');
  } else {
    spinner.classList.add('hidden');
  }
}

// checks if data exits
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


// opens up modal with full news details
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


// updates ui when category is selected
const displayNewsList = newsArr => {
  const newsList = document.getElementById('news-list');
  const newsDiv = document.createElement('div');
  newsList.innerHTML = ``;

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

// when website opens fetches categories and first news category data and shows in the ui
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
      loadCategories(data.data.news_category);
      const news = await fetchNews();
      displayNewsCount(news.length);
      displayNewsList(news);
      newsStore = news;
    })
    .catch((error) => console.log(error))
  } catch (error) {
    console.error(`error caught from catch block`, error);
  }
}

const fetchNews = async id => {
  const category_id = await id || "01";
  const url = `https://openapi.programming-hero.com/api/news/category/${category_id}`

  const res = await fetch(url);
  const data = await res.json();

  return data.data;
}

// loads news data selected from category and shows in ui
document.getElementById('all-categories').addEventListener('click', async e => {
  if (e.target.id.includes('category')) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = ``;
    showSpinner(true);
    const category_id = e.target.id.split("-").pop();
    const category = e.target.innerText;

    try {
      const data = await fetchNews(category_id);
      newsStore = data;
      const sortedData = sort(newsStore);

      displayNewsCount(sortedData.length, category);
      displayNewsList(sortedData);
    } catch (error) {
      console.error(`error caught from catch block`, error);
    }
  }
})

// closes modal when clicked outside modal
window.onclick = function (e) {
  const modal = document.getElementById('modal-overlay');
  if (e.target.id === "modal-overlay") {
    modal.style.display = 'none';
    modal.innerHTML = ``;
  }
}

// sorts news by selecting from options
const select = document.getElementById('sort-by');
const sort = (data = newsStore) => {
  if (data) {
    const sortMethod = select.value;
    if (sortMethod === "view-count") {
      const newArr = data.sort((a, b) => b.total_view - a.total_view);
      return newArr;
    } else if (sortMethod === "rating") {
      const newArr = data.sort((a, b) => b.rating?.number - a.rating?.number);
      return newArr;
    } else if (sortMethod === "published-date") {
      const newArr = data.sort((a, b) => new Date(b.author?.published_date) - new Date(a.author?.published_date));
      return newArr;
    }
  }
}

// changing option will change news list
select.addEventListener('change', () => {
  const newArr = sort();
  displayNewsList(newArr);
})