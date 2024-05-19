import { WORKS_URL, CATEGORIES_URL, FILTERS, MAIN_GALLERY,
     LAYER, MODAL_WINDOW, MODAL_GALLERY, 
     MODAL_UPLOAD_FORM, CONFIRM_BUTTON,
     TOKEN_NAME, USER_ID} from "./constants.js";

// Réception des données via l'API ////////////////////////////////
export async function fetchData(dataUrl) {
    const data = await fetch(dataUrl)
                .then(data => data.json())
                .catch(err => {
                    window.alert("Erreur lors de la réception de données depuis le serveur");
                    console.log(err)
                });
    return data;
}


// Envoi des données à l'API //////////////////////////////////////
export async function sendData(url, headersJson, bodyJson) {
    const response = await fetch(url, {
        method: 'POST',
        headers: headersJson,
        body: JSON.stringify(bodyJson)
    })
    .then(response => response.json())
    .catch(err => {
        window.alert("Erreur lors de l'envoi de données au serveur");
        console.log(err)
    });
    return response;
}

// Suppression d'un travail sur la base de données /////////////////
export async function deleteWorkRequest(id) {
    const token = sessionStorage.getItem(TOKEN_NAME);
    const userId = sessionStorage.getItem(USER_ID);
    await fetch(`${WORKS_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'User-Id': userId
      }
    })
    .catch(err => {
        window.alert("Erreur de communication avec le serveur");
        console.log(err)
    });
}

// Mise en place du mode édition ////////////////////////////////////
export async function setEditMode(){
    if(sessionStorage.getItem(TOKEN_NAME)) {
        const editingModeBanner = document.querySelector(".editing-mode-banner");
        editingModeBanner.style.display = "flex";

        const loginTab = document.querySelector("header nav ul li:nth-child(3)")
        loginTab.textContent = "logout";
        loginTab.addEventListener("click", logout);
    
        FILTERS.remove();
    
        const projectsHeading = document.querySelector(".projets-heading");
        projectsHeading.style.padding = "0 0 110px 0"
    
        const editButton = document.querySelector(".edit-button");
        editButton.style.display = "flex";
        editButton.addEventListener("click", showModal);

        const closeButton = document.querySelector(".close-button");
        closeButton.addEventListener("click", hideModal);
        LAYER.addEventListener("click", hideModal);
    }
}

// Affichage de la modale /////////////////////////////////////////
export async function showModal() {
    LAYER.style.display = "block";
    MODAL_WINDOW.style.display = "flex";
    MODAL_GALLERY.style.display = "grid";
    document.querySelector("#modal h2").textContent = "Galerie photo";
    const works = await fetchData(WORKS_URL);
    displayWorks(works, MODAL_GALLERY);
}

// Fermeture de la modale //////////////////////////////////////////
export async function hideModal() {
    LAYER.style.display = "none";
    MODAL_WINDOW.style.display = "none";
    MODAL_UPLOAD_FORM.style.display= "none";
    CONFIRM_BUTTON.value = "Ajouter une photo";
    CONFIRM_BUTTON.classList.remove("btn--greyed-out");
    const uploadedPhoto = document.querySelector(".photo-upload-container img");
    if (uploadedPhoto) {
        document.getElementById("add-photo").value = "";
        uploadedPhoto.remove();
        document.querySelectorAll(".photo-upload-container > *").forEach(
            item => item.style.display = "block"
        );
    }
}

// Suppression du token de connexion et redirection //////////////// 
export const logout = () => {
    sessionStorage.removeItem(TOKEN_NAME);
    window.location.href = "./index.html";
}

// Ajout des travaux au DOM ////////////////////////////////////////
export async function appendWork(work, gallery) {
    const item = document.createElement("figure");
    const photo = document.createElement("img");
    photo.src = work.imageUrl;
    photo.alt = work.title;
    item.appendChild(photo);
    item.dataset.id = work.id;
    item.dataset.categoryId = work.categoryId;
    item.dataset.userId = work.userId;
    if (gallery === MAIN_GALLERY) {
        const caption = document.createElement("figcaption");
        caption.innerText = work.title;
        item.appendChild(caption);
    } else {
        const trashIcon = document.createElement("i");
        trashIcon.className = "fa-solid fa-trash-can";
        trashIcon.dataset.id = work.id;
        item.appendChild(trashIcon);
        trashIcon.addEventListener("click", async (event) => 
            await deleteWork(event.target.dataset.id));
    }
    gallery.appendChild(item);
}

// Suppression d'un travail et rafraichissement /////////////////////
export const deleteWork = async (id) => {
    if (confirm("Confirmer la suppression ?")) {
        await deleteWorkRequest(id);
        const works = await fetchData(WORKS_URL);
        displayWorks(works, MODAL_GALLERY);
        displayWorks(works, MAIN_GALLERY);
    }
} 

// Rafraichissement de la gallerie et affichage des travaux /////////
export function displayWorks(works, gallery) {
    gallery.innerHTML = "";
    works.forEach(work => appendWork(work, gallery));
}

// Filtrage des travaux par catégorie ///////////////////////////////
export async function filterWorks(filterCategoryId) {
    let works = await fetchData(WORKS_URL);
    if (filterCategoryId === "filter-0") {
        displayWorks(works, MAIN_GALLERY);
    } else {
        let filteredWorks = [];
        works.forEach(work => {
            if("filter-" + work.categoryId === filterCategoryId) {
                filteredWorks.push(work);
            }
        });
        displayWorks(filteredWorks, MAIN_GALLERY);
        return filteredWorks;
    }
}

// Création des filtres dynamiques //////////////////////////////////
export async function createFiltersButtons() {
    const categories = await fetchData(CATEGORIES_URL);
    FILTERS.innerHTML = "";
    const noFilter = document.createElement("button");
    noFilter.className = "btn";
    noFilter.id = "filter-0";
    noFilter.innerText = "Tous";
    noFilter.addEventListener("click", (event) => filterWorks(event.target.id));
    FILTERS.appendChild(noFilter);
    categories.forEach(categorie => {
        const item = document.createElement("button");
        item.className = "btn";
        item.id = "filter-" + categorie.id;
        item.innerText = categorie.name;
        item.addEventListener("click", (event) => filterWorks(event.target.id));
        FILTERS.appendChild(item);
    });
}