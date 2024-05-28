import * as modules from "./modules.js"
import { WORKS_URL, MAIN_GALLERY } from "./constants.js"



modules.setEditMode();
modules.createFiltersButtons();
modules.displayWorks(await modules.fetchData(WORKS_URL), MAIN_GALLERY);  // Réception et affichage des travaux sur le portfolio 
modules.dummyElements();

// Pour que la redirection depuis login.html vers la section contact s'effectue correctement
if (sessionStorage.getItem("contactRedirect")) {
    sessionStorage.removeItem("contactRedirect");
    window.location.href = "#contact"
}

