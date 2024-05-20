import * as modules from "./modules.js"
import { LAYER, MODAL_WINDOW, MODAL_GALLERY, MODAL_UPLOAD_FORM, CONFIRM_BUTTON,
         ADD_PHOTO_FIELD, TITLE_FIELD, CATEGORY_FIELD, GO_BACK_BUTTON,
         WORKS_URL, TOKEN_NAME, USER_ID, 
         CATEGORIES_URL, REGEX,ADD_PHOTO_BUTTON,
         MODAL_HEADING} from "./constants.js"




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
    }
}

// Suppression d'une image invalide ///////////////////////////////////////////
function removeInvalidImage() {
    console.log("removeInvalidImage called");
    const imagePreview = document.querySelector(".photo-upload-container img");
    if (imagePreview) {
        imagePreview.remove();

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
            window.alert(`"Formats acceptés: 
                           jpg, png; 4mo max"`);
            removeInvalidImage();
            return false;
    } else {
        return true;
    }
}

// Vérification du contenu de la chaine de caractères /////////////////////////
function stringIsValid(string) {
    if (REGEX.test(string)) {
        window.alert(`"Les caractères suivants ne sont pas autorisés:
        \`!@#$%^&*()_+={}[]|\\;?/><"`);
        TITLE_FIELD.value = "";
    }
    return !REGEX.test(string);
}

// Verification du champs catégorie ///////////////////////////////////////////
function isOptionSelected() {
    if (CATEGORY_FIELD.value === "no-selection") {
        window.alert("Catégorie non renseignée");
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

    if (formIsFilled()) {
        return imageIsValid(ADD_PHOTO_FIELD) &&
               stringIsValid(TITLE_FIELD.value) &&
               isOptionSelected();
    }
    else {
        return false;
    }
}


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
        window.alert("Erreur lors de la publication du travail")
        console.error("Error uploading work:", error);
    }
}

async function submitEventListener(event) {
    event.preventDefault();
    if(checkInputFields()){
        uploadWork();
        window.location.href = "./index.html";
    }
};

// Gestion de la validité du formulaire ///////////////////////////////////////
function toggleFormSubmit() {
    CONFIRM_BUTTON.removeEventListener("click", submitEventListener); // pour éviter l'ajout multiple d'eventListeners
    CONFIRM_BUTTON.addEventListener("click", submitEventListener); 
}

// Changement de la couleur du bouton de Validation ////////////////////////////
function toggleGreyedOut() {
    CONFIRM_BUTTON.classList.toggle("btn--greyed-out", !formIsFilled());
}

// Affichage de la modale /////////////////////////////////////////
export async function showModal() {
    LAYER.style.display = "block";
    MODAL_WINDOW.style.display = "flex";
    await setModalGallery();
}

// Fermeture de la modale //////////////////////////////////////////
export async function hideModal() {
    LAYER.style.display = "none";
    MODAL_WINDOW.style.display = "none";
    await setModalGallery();
}

// Affichage du formulaire de la modale /////////////////////////////////
async function setModalUploadForm() {

    MODAL_GALLERY.style.display = "none";
    MODAL_UPLOAD_FORM.style.display = "flex";
    GO_BACK_BUTTON.style.display = "block";
    GO_BACK_BUTTON.addEventListener("click", setModalGallery);
    MODAL_HEADING.textContent = "Ajout photo";

    ADD_PHOTO_BUTTON.style.display = "none";
    CONFIRM_BUTTON.style.display = "block";

    CONFIRM_BUTTON.classList.add("btn--greyed-out");
    ADD_PHOTO_FIELD.value = "";
    ADD_PHOTO_FIELD.removeEventListener("input", displayImagePreview);
    ADD_PHOTO_FIELD.addEventListener("input", displayImagePreview);
    TITLE_FIELD.value = "";
    const categories = await modules.fetchData(CATEGORIES_URL);
    CATEGORY_FIELD.innerHTML = "<option value=no-selection></option>";
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = "option" + category.id;
        option.textContent = category.name;
        CATEGORY_FIELD.appendChild(option);
    });

    CONFIRM_BUTTON.addEventListener("click", checkInputFields)
    const formFields = [ADD_PHOTO_BUTTON, TITLE_FIELD, CATEGORY_FIELD];
    formFields.forEach(field => 
        field.removeEventListener("input", toggleGreyedOut));
    formFields.forEach(field =>
        field.addEventListener("input", toggleGreyedOut));
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