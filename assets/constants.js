//  Routes de l'API /////////////////////////////////////////////////  
export const WORKS_URL = "http://localhost:5678/api/works";
export const CATEGORIES_URL = "http://localhost:5678/api/categories";
export const USERS_LOGIN_URL = "http://localhost:5678/api/users/login";

// Éléments du DOM /////////////////////////////////////////////////
export const FILTERS = document.getElementById("filters");
export const MAIN_GALLERY = document.getElementById("main-gallery");
export const LAYER = document.getElementById("layer");

export const LOGIN_SUBMIT_BUTTON = document.querySelector('input[value="Connexion"]');

export const MODAL_WINDOW = document.getElementById("modal");
export const MODAL_GALLERY = document.getElementById("modal-gallery");
export const MODAL_UPLOAD_FORM = document.getElementById("modal-upload-form");
export const TRASH_ICON = document.querySelectorAll(".fa-trash-can");
export const CONFIRM_BUTTON = document.querySelector("#modal input[type='button']");
export const ADD_PHOTO_FIELD = document.getElementById("add-photo");
export const TITLE_FIELD = document.getElementById("title")
export const CATERGORY_FIELD = document.getElementById("categories-dropdown")
export const GO_BACK_BUTTON = document.getElementsByClassName("fa-arrow-left")[0];


// Autre
export const TOKEN_NAME = "token"