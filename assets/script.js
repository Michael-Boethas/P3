import * as modules from "./modules.js"
import { WORKS_URL } from "./constants.js"


if(sessionStorage.getItem("token")) {
    const editingModeBanner = document.querySelector(".editing-mode-banner");
    editingModeBanner.style.display = "flex";
    const editButton = document.querySelector(".edit-button");
    editButton.style.display = "flex";
    const loginTab = document.querySelector("header nav ul li:nth-child(3)")
    loginTab.textContent = "logout";
    loginTab.addEventListener("click", () => {
        sessionStorage.removeItem("token");
        window.location.href = "./index.html";
    });
}
modules.createFiltersButtons();
modules.displayWorks(await modules.fetchData(WORKS_URL));