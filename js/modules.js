import { showModal, hideModal } from "./modal.js";
import { WORKS_URL, CATEGORIES_URL, FILTERS, MAIN_GALLERY,
         LAYER, MODAL_CLOSE_BUTTON, MODAL_GALLERY,
         TOKEN_NAME, USER_ID, EDITING_MODE_BANNER, LOGIN_TAB,
         EDIT_BUTTON, PROJECTS_HEADING, CONTACT_FORM, DISCLAIMER,
         FORGOTTEN_PASSWORD } from "./constants.js";


// Réception des données via l'API ////////////////////////////////
export async function fetchData(dataUrl) {
    const data = fetch(dataUrl)
                .then(data => data.json())
                .catch(error => {
                    Swal.fire({
                        icon: "warning",
                        text: `Erreur lors de la réception de données
                               depuis le serveur`,
                        showCloseButton: true,
                        showConfirmButton: false
                    })
                    console.error(error);
                    throw error;
                });
    return data;
}


// Envoi des données à l'API //////////////////////////////////////
export async function sendData(url, headersJson, bodyJson) {
    const response = fetch(url, {
        "method": "POST",                    // Méthode de la requête fetch
        "headers": headersJson,              // Headers en JSON
        "body": JSON.stringify(bodyJson)     // Conversion du JSON en chaine de caractères
    })
    .then(response => response.json())
    .catch(error => {
        Swal.fire({
            icon: "warning",
            text: `Erreur lors de l'envoi de données
                   au serveur`,
            showCloseButton: true,
            showConfirmButton: false
        })
        console.error(error);
        throw error;
    });
    return response;    // identifiant et token de connexion  
}

// Suppression d'un travail sur la base de données /////////////////
export async function deleteWorkRequest(id) {
    const token = sessionStorage.getItem(TOKEN_NAME);
    return fetch(`${WORKS_URL}/${id}`, {
        "method": "DELETE",
        "headers": {
            "Authorization": `Bearer ${token}`,     // Authentification
        }
    })
    .catch(error => {
        Swal.fire({
            icon: "warning",
            text: `Erreur de communication avec le serveur lors
                   de la suppression`,
            showCloseButton: true,
            showConfirmButton: false
        });
        console.error(error);
        throw error;             // Propagation de l'erreur
    });
}

// Mise en place du mode édition ////////////////////////////////////
export async function setEditMode(){
    if(sessionStorage.getItem(TOKEN_NAME)) {
        EDITING_MODE_BANNER.style.display = "flex";
        EDITING_MODE_BANNER.addEventListener("click", showModal);

        LOGIN_TAB.textContent = "logout";
        LOGIN_TAB.addEventListener("click", logout);
    
        FILTERS.remove();
        PROJECTS_HEADING.style.padding = "0 0 110px 0"
    
        EDIT_BUTTON.style.display = "flex";
        EDIT_BUTTON.addEventListener("click", showModal);   // Bouton d'accès à la modale

        MODAL_CLOSE_BUTTON.onclick = hideModal;
        LAYER.onclick = hideModal;
        
        MODAL_CLOSE_BUTTON.addEventListener("click", hideModal);
        LAYER.addEventListener("click", hideModal);
    }
}


// Suppression du token de connexion et redirection //////////////// 
export function logout() {
    sessionStorage.removeItem(TOKEN_NAME);
    sessionStorage.removeItem(USER_ID);
    window.location.href = "./index.html";
}

// Ajout des travaux au DOM ////////////////////////////////////////
export async function appendWork(work, gallery) {
    const item = document.createElement("figure");      // Création des éléments
    const photo = document.createElement("img");
    photo.src = work.imageUrl;                          // Réception de l'image et du titre
    photo.alt = work.title;
    item.appendChild(photo);
    item.dataset.id = work.id;                          // Attribution des identifiants 
    item.dataset.categoryId = work.categoryId;
    item.dataset.userId = work.userId;
    if (gallery === MAIN_GALLERY) {             // Galerie du portfolio avec intitulé
        const caption = document.createElement("figcaption");
        caption.innerText = work.title;
        item.appendChild(caption);
    } else {                                    // Galerie de la modale avec icône de suppression
        const trashIcon = document.createElement("i");
        trashIcon.className = "fa-solid fa-trash-can";  // Création du bouton supprimer et attribution de l'identifiant
        trashIcon.dataset.id = work.id;
        item.appendChild(trashIcon);
        trashIcon.addEventListener("click", async (event) => {  // Ajout de la fonctionnalité suppression
            await deleteWork(event.target.dataset.id)
            .catch(error => console.error(error));
        });
    }
    gallery.appendChild(item);
}


// Suppression d'un travail et rafraichissement /////////////////////
export async function deleteWork(id) {
    try {
        const result = await Swal.fire({        // Attente de confirmation
            text: "Confirmer la suppression ?",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
            didOpen: () => {                    //  Bouton de confirmation en rouge 
                document.querySelector(".swal2-confirm.swal2-styled")
                    .style.backgroundColor = "#8B0000";
            }
        });
        if (result.isConfirmed) {
            await deleteWorkRequest(id);
            const works = await fetchData(WORKS_URL);
            displayWorks(works, MODAL_GALLERY);   // Rafraichissement des deux galeries 
            displayWorks(works, MAIN_GALLERY);
        }
    } catch (error) {
        console.error(error);
    }
}

// Rafraichissement de la galerie et affichage des travaux /////////
export function displayWorks(works, gallery) {          // Prend la galerie cible en paramètre
    gallery.innerHTML = "";                             // Rafraîchissement de la galerie
    works.forEach(work => appendWork(work, gallery));   // Ajout des travaux présents dans la liste en paramètre
}

// Filtrage des travaux par catégorie ///////////////////////////////
export async function filterWorks(filterCategoryId) {
    const works = await fetchData(WORKS_URL);   // Acquisition des travaux existants
    if (filterCategoryId === "filter-0") {      // Pas de filtre
        displayWorks(works, MAIN_GALLERY);
    } else {                                    // Filtrage par catégorie
        const filteredWorks = [];
        works.forEach(work => {
            if("filter-" + work.categoryId === filterCategoryId) {  // Ajout du travail s'il est de la bonne catégorie
                filteredWorks.push(work);
            }
        });
        displayWorks(filteredWorks, MAIN_GALLERY);    // Affichage des travaux filtrés sur le portfolio 
        return filteredWorks;
    }
}

// Création des filtres dynamiques //////////////////////////////////
export async function createFiltersButtons() {
    const categories = await fetchData(CATEGORIES_URL);     // Réception des catégories depuis l'API
    const noFilter = document.createElement("button");      // Bouton "Pas de filtre"
    noFilter.className = "btn";
    noFilter.id = "filter-0";
    noFilter.innerText = "Tous";
    noFilter.addEventListener("click", (event) => filterWorks(event.target.id));
    FILTERS.appendChild(noFilter);
    categories.forEach(categorie => {
        const item = document.createElement("button");      // Création du bouton avec son categoryId
        item.className = "btn";
        item.id = "filter-" + categorie.id;
        item.innerText = categorie.name;
        item.addEventListener("click", (event) => filterWorks(event.target.id));  // filterWorks() sur l'id du filtre cliqué
        FILTERS.appendChild(item);
    });
}


// Message d'erreur pour les fonctionnalités indisponnibles ///////////
export function dummyElements() {
    [[CONTACT_FORM, "submit"],
    [DISCLAIMER, "click"],
    [FORGOTTEN_PASSWORD, "click"]].forEach(([element, eventType]) => {
        if (element) {
            element.addEventListener(eventType, function(event) {
                event.preventDefault();
                Swal.fire({
                    icon: "warning",
                    text: "Fonctionnalité indisponible",
                    showCloseButton: true,
                    showConfirmButton: false
                });
            });
        }
    });
}