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
      console.log(data.data.news_category)
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