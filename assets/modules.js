import * as cst from "./constants.js";

// Réception des données via l'API ////////////////////////////////
export async function fetchData(getDataUrl) {
    const response = await fetch(getDataUrl);
    const data = await response.json();
    return data;
}

// Réception des catégories via l'API //////////////////////////////
export async function fetchCategories () {
    const response = await fetch(cst.getCategoriesUrl);
    const categories = await response.json();
    return categories;
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
    let works = await fetchData(cst.getWorksUrl);
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
    const categories = await fetchData(cst.getCategoriesUrl);
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