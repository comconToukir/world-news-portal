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
  if (!length) {
    newsCount.innerText = `No news found for ${category} category`;
  } else {
    newsCount.innerText = `${length} news found for ${category} category`;
  }
};

const displayNewsList = newsArr => {
  const newsList = document.getElementById('news-list');
  newsList.innerHTML =``;
  newsArr.forEach(news => {
    newsList.innerHTML += `
    <div class="card md:card-side bg-base-200 shadow-lg mb-7 p-2">
      <figure><img class="hidden md:block" src=${news.thumbnail_url} alt="News Thumbnail"></figure>
      <figure><img class="block md:hidden rounded-xl" src=${news.image_url} alt="News Thumbnail"></figure>
      <div class="card-body p-6">
        <h2 class="card-title text-xl md:text-2xl xl:text-3xl">${news.title}</h2>
        <p class="font-light hidden lg:block">${news.details.split(" ").slice(0, 40).join(" ")}...</p>
        <div class="card-actions justify-between">
          <button class="bg-sky-900 py-1 px-4">Details</button>
        </div>
      </div>
    </div>
    `
  })
};

document.getElementById('all-categories').addEventListener('click', async e => {
  if (e.target.id.includes('category')) {
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