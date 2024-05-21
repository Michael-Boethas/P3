import * as modules from "./modules.js"
import { LAYER, MODAL_WINDOW, MODAL_GALLERY, MODAL_UPLOAD_FORM, CONFIRM_BUTTON,
         ADD_PHOTO_FIELD, TITLE_FIELD, CATEGORY_FIELD, GO_BACK_BUTTON,
         WORKS_URL, TOKEN_NAME, USER_ID, 
         CATEGORIES_URL, REGEX,ADD_PHOTO_BUTTON,
         MODAL_HEADING, MAIN_GALLERY} from "./constants.js"




// Gestion de la selection de Photo /////////////////////////////////////
function displayImagePreview() {
    if (ADD_PHOTO_FIELD.value !== "") {
        document.querySelectorAll(".photo-upload-container > *").forEach(item => {
            item.id === "add-photo" ? null : item.style.display = "none";     // Ignorer le bouton file input
            item.nodeName === "IMG" ? item.remove() : null });      // Effacer l'image existante
        const imagePreview = document.createElement("img");
        const imageURL = URL.createObjectURL(ADD_PHOTO_FIELD.files[0]);   // Récupérer l'URL de la photo
        imagePreview.src = imageURL;
        document.querySelector(".photo-upload-container")
                .appendChild(imagePreview);
        toggleGreyedOut();
    }
}

// Suppression d'une image invalide ///////////////////////////////////////////
function removeInvalidImage() {
    console.log("removeInvalidImage called");
    const imagePreview = document.querySelector(".photo-upload-container img");
    if (imagePreview) {
        imagePreview.remove();
        toggleGreyedOut();
    }
    document.querySelectorAll(".photo-upload-container > *").forEach(
        item => item.style.display = "block"
    );
    ADD_PHOTO_FIELD.value = "";
}

// Vérification de la validité du fichier selectionné //////////////////////////
function imageIsValid(addPhotoField) {
    console.log("imageIsValid: " + addPhotoField.files[0])
    const selectedPhoto = addPhotoField.files[0];
    if ((selectedPhoto.type !== "image/jpeg" &&
         selectedPhoto.type !== "image/png" &&
         selectedPhoto.value !== "") ||
         selectedPhoto.size > 4194304) {
            window.alert("Formats acceptés:  jpg, png; 4mo max");
            removeInvalidImage();
            toggleGreyedOut();
            // setModalUploadForm();
            return false;
    } else {
        return true;
    }
}

// Vérification du contenu de la chaine de caractères /////////////////////////
function stringIsValid(string) {
    if (REGEX.test(string)) {
        window.alert(`Les caractères suivants ne sont pas autorisés:
        \` ! @ # $ % ^ & * ( ) _ + = { } [ ] | \\ ; ? / > <`);
        TITLE_FIELD.value = "";
        toggleGreyedOut();
    }
    return !REGEX.test(string);
}

// Verification du champs catégorie ///////////////////////////////////////////
function optionIsSelected() {
    if (CATEGORY_FIELD.value === "no-selection") {
    }
}

// Vérification de la complétude du formulaire ///////////////////////////////
function formIsFilled() {
    console.log("formIsFilled called: " + (ADD_PHOTO_FIELD.value !== "" && TITLE_FIELD.value !== "" && CATEGORY_FIELD.value !== "no-selection"))

    return (ADD_PHOTO_FIELD.value !== "" &&
            TITLE_FIELD.value !== "" &&
            CATEGORY_FIELD.value !== "no-selection");
}

// Vérification de la validité du formulaire //////////////////////////////////
function checkInputFields() {
    console.log("checkInputFields called")
    if (formIsFilled()) {
        return imageIsValid(ADD_PHOTO_FIELD) &&
               stringIsValid(TITLE_FIELD.value) &&
               optionIsSelected();
    }
    else {
        return false;
    }
}

// Envoi des données du formulaire au serveur //////////////////////////////////
async function uploadWork() {
    try {
        const token = sessionStorage.getItem(TOKEN_NAME);
        const userId = sessionStorage.getItem(USER_ID);
        const formData = new FormData();        
        formData.append("title", TITLE_FIELD.value);
        formData.append("category", CATEGORY_FIELD.value);
        formData.append("image", ADD_PHOTO_FIELD.files[0]); 
        const headers = {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "User-Id": userId
        };
        await modules.sendData(WORKS_URL, headers, formData);
        window.alert("Ajout validé");
    } catch (error) {
        window.alert("Erreur lors de la publication");
        console.error("Error uploading work:", error);
    }
}

// Gestion du bouton d'envoi des données /////////////////////////////////////
async function submitButton(event) {
    console.log("submitButton called");
    event.preventDefault();
    // if(checkInputFields()){
        uploadWork()
            .then(window.location.href = "./index.html")
                .catch(err => console.log("uploadWork error: " + err))
        // modules.displayWorks(await modules.fetchData(WORKS_URL), MAIN_GALLERY);
        // window.location.href = "./index.html";
    // }
};

// Gestion de la validité du formulaire ///////////////////////////////////////
function toggleFormSubmit() {
    console.log("toggleFormSubmit called");
    // CONFIRM_BUTTON.removeEventListener("click", submitButton); // pour éviter l'ajout multiple d'eventListeners
    if (checkInputFields()) {
        console.log(checkInputFields())
        CONFIRM_BUTTON.addEventListener("click", submitButton, {once: true});
    }
}

// Changement de la couleur du bouton de Validation ////////////////////////////
function toggleGreyedOut() {
    CONFIRM_BUTTON.classList.toggle("btn--greyed-out", !formIsFilled());
}

// Affichage de la modale //////////////////////////////////////////////////////
export async function showModal() {
    LAYER.style.display = "block";
    MODAL_WINDOW.style.display = "flex";
    await setModalGallery();
}

// Fermeture de la modale ///////////////////////////////////////////////////
export async function hideModal() {
    // modules.displayWorks(await modules.fetchData(WORKS_URL), MAIN_GALLERY);
    await setModalGallery();
    LAYER.style.display = "none";
    MODAL_WINDOW.style.display = "none";
}

// Affichage du formulaire de la modale //////////////////////////////////////
async function setModalUploadForm() {

    MODAL_GALLERY.style.display = "none";
    MODAL_UPLOAD_FORM.style.display = "flex";
    MODAL_HEADING.textContent = "Ajout photo";
    ADD_PHOTO_BUTTON.style.display = "none";
    CONFIRM_BUTTON.style.display = "block";
    CONFIRM_BUTTON.classList.add("btn--greyed-out");
    GO_BACK_BUTTON.style.display = "block";
    GO_BACK_BUTTON.addEventListener("click", setModalGallery);
    TITLE_FIELD.value = "";
    ADD_PHOTO_FIELD.value = "";
    ADD_PHOTO_FIELD.removeEventListener("input", displayImagePreview);
    ADD_PHOTO_FIELD.addEventListener("input", displayImagePreview);

    const categories = await modules.fetchData(CATEGORIES_URL);
    CATEGORY_FIELD.innerHTML = "<option value=no-selection></option>";  // Rafraichissement des catégories
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = "option" + category.id;
        option.textContent = category.name;
        CATEGORY_FIELD.appendChild(option);
    });

    const formFields = [ADD_PHOTO_BUTTON, TITLE_FIELD, CATEGORY_FIELD];
    formFields.forEach(field => 
        field.removeEventListener("input", toggleGreyedOut));
    formFields.forEach(field =>
        field.addEventListener("input", toggleGreyedOut, {once: true}));
    formFields.forEach(field =>
        field.removeEventListener("change", toggleFormSubmit));
    formFields.forEach(field =>
        field.addEventListener("change", toggleFormSubmit, {once: true}));
}


// Affichage de la galerie de suppression des travaux /////////////////////
async function setModalGallery() {
    console.log("setModalGallery called")
    MODAL_HEADING.textContent = "Galerie photo";
    MODAL_UPLOAD_FORM.style.display = "none";
    GO_BACK_BUTTON.style.display = "none";
    MODAL_GALLERY.style.display = "grid";
    CONFIRM_BUTTON.style.display = "none";
    CONFIRM_BUTTON.classList.remove("btn--greyed-out");
    ADD_PHOTO_BUTTON.style.display = "block";

    document.querySelectorAll(".photo-upload-container > *").forEach(
        item => item.style.display = "block"
    );
    const imagePreview = document.querySelector(".photo-upload-container img");
    if (imagePreview) {
        imagePreview.remove();
        document.getElementById("add-photo").value = "";
    }
    const works = await modules.fetchData(WORKS_URL);
    modules.displayWorks(works, MODAL_GALLERY);
    modules.displayWorks(works, MAIN_GALLERY);      // Rafraichissement simultané de la galerie principale

}


// Gestion de la modale ///////////////////////////////////////////////////
// async function handleModal() {
if (ADD_PHOTO_BUTTON) {
    ADD_PHOTO_BUTTON.addEventListener("click", () => {
        setModalUploadForm();
    })
}
// }

// document.addEventListener("DOMContentLoaded", await handleModal());