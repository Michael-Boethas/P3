import * as modules from "./modules.js"
import * as cst from "./constants.js"


modules.createFiltersButtons();
modules.displayWorks(await modules.fetchData(cst.worksUrl));