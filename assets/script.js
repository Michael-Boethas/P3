import * as modules from "./modules.js"
import { WORKS_URL, MAIN_GALLERY } from "./constants.js"



modules.setEditMode();
modules.createFiltersButtons();
modules.displayWorks(await modules.fetchData(WORKS_URL), MAIN_GALLERY);
