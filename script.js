const imagesContainer = document.querySelector(".images-container");
const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

let resultsArray = [];
let favorites = {};

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });

  if (page === "results") {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favoritesNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

async function fetchNASAPics() {
  loader.classList.remove("hidden");
  try {
    const res = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=5iLOwOTnHSCNJJa01DB6dsqygJmgWpXjO2dbgd4X&count=10"
    );
    resultsArray = await res.json();
    displayImages("results");
  } catch (err) {
    console.log(err);
  }
}

function createDOMNodes(page) {
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  currentArray.forEach((pic) => {
    let { copyright, title, explanation, hdurl, date, url } = pic;

    let card = document.createElement("div");
    card.classList.add("card");

    let link = document.createElement("a");
    link.setAttribute("title", "View Full Image");
    link.setAttribute("target", "_blank");
    link.setAttribute("href", url);

    let image = document.createElement("img");
    image.src = hdurl;
    image.setAttribute("alt", "NASA picture of the day");
    image.classList.add("card-img-top");

    link.appendChild(image);

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    let h5 = document.createElement("h5");
    h5.classList.add("card-title");
    h5.textContent = title;
    let p1 = document.createElement("p");
    p1.textContent =
      page === "results" ? "Add to Favorites" : "Remove Favorite";
    p1.classList.add("clickable");
    p1.setAttribute(
      "onclick",
      page === "results" ? `saveFavorite('${url}')` : `removeFavorite('${url}')`
    );
    let p2 = document.createElement("p");
    p2.classList.add("card-text");
    p2.textContent = explanation;

    let small = document.createElement("small");
    small.classList.add("text-muted");

    let strong = document.createElement("strong");
    strong.textContent = date;
    let span = document.createElement("span");
    span.textContent = copyright && ` ${copyright}`;

    small.append(strong, span);

    cardBody.append(h5, p1, p2, small);

    card.append(link, cardBody);

    imagesContainer.appendChild(card);
  });
}

function displayImages(page) {
  if (localStorage.getItem("favorites")) {
    favorites = JSON.parse(localStorage.getItem("favorites"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

function saveFavorite(url) {
  let item = resultsArray.find((result) => result.url === url);

  if (!(url in favorites)) {
    favorites[url] = item;

    saveConfirmed.hidden = false;

    setTimeout(() => {
      saveConfirmed.hidden = true;
    }, 2000);

    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

function removeFavorite(url) {
  delete favorites[url];

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayImages("favorites");
}

fetchNASAPics();
