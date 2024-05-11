import * as modules from "./modules.js"
import { WORKS_URL, FILTERS, MAIN_GALLERY,LAYER, MODAL_WINDOW } from "./constants.js"

export const showModal = async () => {
    LAYER.style.display = "block";
    MODAL_WINDOW.style.display = "flex";
}

export const hideModal = async () => {
    LAYER.style.display = "none";
    MODAL_WINDOW.style.display = "none";
}

export const handleEditMode = () => {
    if(sessionStorage.getItem("token")) {
        const editingModeBanner = document.querySelector(".editing-mode-banner");
        editingModeBanner.style.display = "flex";
    
        FILTERS.remove();
    
        const projectsHeading = document.querySelector(".projets-heading")
        projectsHeading.style.padding = "0 0 110px 0"
    
        const editButton = document.querySelector(".edit-button");
        editButton.style.display = "flex";
        editButton.addEventListener("click", showModal)

        const closeButton = document.querySelector(".close-button");
        closeButton.addEventListener("click", hideModal);
        LAYER.addEventListener("click", hideModal);

        
        const loginTab = document.querySelector("header nav ul li:nth-child(3)")
        loginTab.textContent = "logout";
        loginTab.addEventListener("click", modules.logout);
    }
}

handleEditMode();
modules.createFiltersButtons();
modules.displayWorks(await modules.fetchData(WORKS_URL), MAIN_GALLERY);