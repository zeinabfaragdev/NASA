const imagesContainer = document.querySelector(".images-container");

let resultsArray = [];

async function fetchNASAPics() {
  try {
    const res = await fetch(
      "https://api.nasa.gov/planetary/apod?api_key=5iLOwOTnHSCNJJa01DB6dsqygJmgWpXjO2dbgd4X&count=10"
    );
    resultsArray = await res.json();
    displayImages();
  } catch (err) {
    console.log(err);
  }
}

function displayImages() {
  resultsArray.forEach((pic) => {
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
    p1.textContent = "Add to Favorites";
    p1.classList.add("clickable");
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

fetchNASAPics();
