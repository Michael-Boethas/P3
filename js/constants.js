//  Routes de l'API /////////////////////////////////////////////////  
export const WORKS_URL = "http://localhost:5678/api/works";
export const CATEGORIES_URL = "http://localhost:5678/api/categories";
export const USERS_LOGIN_URL = "http://localhost:5678/api/users/login";



// Éléments du DOM /////////////////////////////////////////////////
    // Page Principale
export const FILTERS = document.getElementById("filters");
export const MAIN_GALLERY = document.getElementById("main-gallery");
export const CONTACT_FORM = document.querySelector("#contact form");
export const DISCLAIMER = document.querySelector("footer li");
    // Page de login
export const CONTACT_LINK = document.querySelector("nav li:nth-child(2)");
export const LOGIN_SUBMIT_BUTTON = document.querySelector(`input[value="Connexion"]`);
export const FORGOTTEN_PASSWORD = document.querySelector("#login span")
    // Mode d'édition
export const EDIT_BUTTON = document.querySelector(".edit-button");
export const PROJECTS_HEADING = document.querySelector(".projets-heading");
export const LOGIN_TAB = document.querySelector("header nav ul li:nth-child(3)")
export const EDITING_MODE_BANNER = document.querySelector(".editing-mode-banner");
    // Modale
export const LAYER = document.getElementById("layer");
export const MODAL_WINDOW = document.getElementById("modal");
export const GO_BACK_BUTTON = document.getElementsByClassName("fa-arrow-left")[0];
export const MODAL_CLOSE_BUTTON = document.querySelector(".close-button");
export const MODAL_HEADING = document.querySelector("#modal h2");
export const MODAL_GALLERY = document.getElementById("modal-gallery");
export const TRASH_ICON = document.querySelectorAll(".fa-trash-can");
export const MODAL_UPLOAD_FORM = document.getElementById("modal-upload-form");
export const ADD_PHOTO_BUTTON = document.getElementById("modal-gallery__btn");
export const ADD_PHOTO_FIELD = document.getElementById("add-photo");
export const TITLE_FIELD = document.getElementById("title");
export const CATEGORY_FIELD = document.getElementById("categories-dropdown");
export const MODAL_SUBMIT_BUTTON = document.getElementById("modal-upload-form__btn");



// Autres constantes /////////////////////////////////////////////////
export const TOKEN_NAME = "token";
export const USER_ID = "userId";
export const REGEX = /[!@#$%^*()+=}{[\]|\;/><~]/g;