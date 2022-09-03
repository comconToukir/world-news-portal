const loadCategories = data => {
  const categorySection = document.getElementById('all-categories');
  const nav = document.createElement('nav');
  nav.classList.add("flex", "justify-between");
  data.forEach(category => {
    nav.innerHTML += `
      <button id="category-${category.category_id}" >${category.category_name}</button>
    `
  });
  categorySection.appendChild(nav);
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

const getRatings = data => {
  if (typeof data !== "number") {
    return data;
  } else {
    const rating = Math.floor(((data % 1) * 2) + (parseInt(data) * 2));
    const ratingsDiv = document.createElement('div');
    for (let i = 0; i < 10; i++) {
      ratingsDiv.innerHTML += `<input type="radio" name="rating-10" class="bg-green-500 mask mask-star-2 mask-half-1" disabled />`;
    }
    ratingsDiv.childNodes[rating].classList.add("checked");
    console.log(rating);
    console.log(ratingsDiv);
    return ratingsDiv;
  }

}

const displayNewsList = newsArr => {
  const newsList = document.getElementById('news-list');
  const newsDiv = document.createElement('div');

  newsArr.forEach(news => {
    console.log(news)
    newsDiv.innerHTML += `
    <div class="card md:card-side bg-base-200 shadow-lg mb-7 p-2">
      <figure><img class="hidden md:block" src=${news.thumbnail_url} alt="News Thumbnail"></figure>
      <figure><img class="block md:hidden rounded-xl" src=${news.image_url} alt="News Thumbnail"></figure>
      <div class="card-body py-4 px-6">
        <h2 class="card-title mb-3 text-xl md:text-2xl xl:text-4xl">${news.title}</h2>
        <p class="font-light hidden lg:block">${news.details.split(" ").slice(0, 40).join(" ")}...</p>
        <div class="card-actions flex justify-between items-center">
          <div class="flex">
            <img class="author-img rounded-full mr-2" src='${dataCheck(news.author.img)}' alt="" />
            <div>
              <p class="text-sm">${dataCheck(news.author.name)}</p>
              <p class="text-sm">${dataCheck(news.author.published_date?.split(' ')[0])}</p>
            </div>
          </div>
          <div>
            <p class=""><i class="fa-regular fa-eye mr-2"></i>${dataCheck(news.total_view)}</p>
          </div>
          <div>
            ${getRatings(dataCheck(news.rating?.number))}
          </div>
          <button class="bg-sky-900 py-1 px-4">Details</button>
        </div>
      </div>
    </div>
    `
  })
  showSpinner(false);
  newsList.appendChild(newsDiv);
};

window.onload = async () => {
  try {
    const url = `https://openapi.programming-hero.com/api/news/categories`;
    await fetch(url)
    .then(res => {
      if(!res.ok) {
        throw new Error(`Network response was not ok`);
      }
      return res.json();
    })
    .then(data => {
      loadCategories(data.data.news_category)
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