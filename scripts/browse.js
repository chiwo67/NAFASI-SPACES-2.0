const statusElement = document.getElementById("spaces-status");
const spacesList = document.getElementById("spaces-list");
const categoryFilter = document.getElementById("category-filter");

let spaces = [];

async function loadSpaces() {
  try {
    if (typeof getListings === 'function') {
      spaces = getListings();
      if (spaces.length) {
        renderSpaces();
        return;
      }
    }

    const response = await fetch("../data/spaces.json");
    if (!response.ok) throw new Error(`Request failed (${response.status})`);

    spaces = await response.json();
    if (!Array.isArray(spaces))
      throw new Error("The spaces data is not a list.");
    renderSpaces();
  } catch (error) {
    console.error("Could not load spaces:", error);
    statusElement.textContent =
      "Unable to load spaces. Please refresh and try again.";
    statusElement.className = "text-center font-semibold mt-5 text-red-700";
  }
}

function createSpaceCard(space){
   const card = document.createElement('article');
  card.className = 'space-card border border-black text-center font-semibold px-8 py-3.5 rounded-[7px] bg-[#F5D7AB]';

  if (space.image) {
    const image = document.createElement('img');
    image.src = space.image;
    image.alt = space.name || space.title;
    image.className = 'w-full h-48 object-cover rounded mb-3';
    card.append(image);
  }

  const name = document.createElement('h3');
  name.className = 'text-lg';
  name.textContent = space.name || space.title;

  const description = document.createElement('p');
  description.className = 'my-3';
  description.textContent = space.description;

  const bookLink = document.createElement('a');
  bookLink.className = 'book-now-button';
  bookLink.href = space.bookingUrl;
  bookLink.textContent = 'Book Now';

  card.append(name, description, bookLink);
  return card;
}

function renderSpaces() {
  const selectedCategory = categoryFilter.value;
  const visibleSpaces = selectedCategory === 'all'
    ? spaces
    : spaces.filter((space) => space.category === selectedCategory);

  spacesList.replaceChildren();
  const categories = [...new Set(visibleSpaces.map((space) => space.category))];

  categories.forEach((category) => {
    const section = document.createElement('section');
    section.id = category;
    section.className = 'mt-5';

    const heading = document.createElement('h2');
    heading.className = 'text-center underline font-bold text-4xl mb-3';
    heading.textContent = category;

    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4';
    visibleSpaces
      .filter((space) => space.category === category)
      .forEach((space) => grid.append(createSpaceCard(space)));

    section.append(heading, grid);
    spacesList.append(section);
  });

  statusElement.hidden = true;
  spacesList.hidden = false;
}

loadSpaces();
