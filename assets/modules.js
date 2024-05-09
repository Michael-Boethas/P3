import { WORKS_URL, CATEGORIES_URL } from "./constants.js";

// // Réception des données via l'API ////////////////////////////////
// export async function fetchData(dataUrl) {
//     const data = await fetch(dataUrl)
//                 .then(data => data.json())
//                 .catch(err => console.log(err));
//     return data;
// }

// Réception des données via l'API ///////////////////////////////
export async function fetchData(dataUrl) {
    const response = await fetch(dataUrl);
    const data = await response.json();
    return data;
}

// Envoi des données à l'API ////////////////////////////////////////
export async function sendData(url, bodyJson) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(bodyJson)
    });
    return await response.json();
}

// Ajout des travaux au DOM ////////////////////////////////////////
export function addWork(work) {
    const gallery = document.querySelector(".gallery");
    const item = document.createElement("figure");
    const photo = document.createElement("img");
    photo.src = work.imageUrl;
    photo.alt = work.title;
    const caption = document.createElement("figcaption");
    caption.innerText = work.title;
    item.appendChild(photo);
    item.appendChild(caption);
    item.dataset.id = work.id;
    item.dataset.categoryId = work.categoryId;
    item.dataset.userId = work.userId;
    gallery.appendChild(item);
}

// Rafraichissement de la gallerie et affichage des travaux /////////
export function displayWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    works.forEach(work => addWork(work));
}

// Filtrage des travaux par catégorie ///////////////////////////////
export async function filterWorks(filterCategoryId) {
    let works = await fetchData(WORKS_URL);
    if (filterCategoryId === "filter-0") {
        displayWorks(works);
    } else {
        let filteredWorks = [];
        works.forEach(work => {
            if("filter-" + work.categoryId === filterCategoryId) {
                filteredWorks.push(work);
            }
        });
        displayWorks(filteredWorks);
        return filteredWorks;
    }
}

// Création des filtres dynamiques //////////////////////////////////
export async function createFiltersButtons() {
    const categories = await fetchData(CATEGORIES_URL);
    const filters = document.querySelector(".filters");
    filters.innerHTML = "";
    const noFilter = document.createElement("button");
    noFilter.className = "btn";
    noFilter.id = "filter-0";
    noFilter.innerText = "Tous";
    noFilter.addEventListener("click", (event) => filterWorks(event.target.id));
    filters.appendChild(noFilter);
    categories.forEach(categorie => {
        const item = document.createElement("button");
        item.className = "btn";
        item.id = "filter-" + categorie.id;
        item.innerText = categorie.name;
        item.addEventListener("click", (event) => filterWorks(event.target.id));
        filters.appendChild(item);
    });
}