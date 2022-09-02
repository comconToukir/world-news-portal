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
    .then(data => console.log(data.data.news_category))
    .catch((error) => console.log(error))
  } catch (error) {
    console.error(`error caught from catch block`, error);
  }
}

// const loadCategories