import * as modules from "./modules.js"
import { MODAL_GALLERY, MODAL_UPLOAD_FORM, CONFIRM_BUTTON,
         ADD_PHOTO_FIELD, TITLE_FIELD, CATEGORY_FIELD, GO_BACK_BUTTON,
         WORKS_URL, TOKEN_NAME, USER_ID, 
         CATEGORIES_URL, REGEX} from "./constants.js"


// Vérification de la validité du fichier selectionné //////////////////////////
function isImageValid(selectedPhoto) {
    if ((selectedPhoto.type !== "image/jpeg" &&
         selectedPhoto.type !== "image/png" &&
         selectedPhoto.value !== "") ||
         selectedPhoto.size > 4194304) {
            return false;
    } else {
        return true;
    }
}

// Vérification du contenu de la chaine de caractères /////////////////////////
function isStringValid(string) {
    return !REGEX.test(string);
}

// Vérification de la validité du formulaire //////////////////////////////////
function checkInputFields() {

    if (!isStringValid(TITLE_FIELD.value)) {
        window.alert("Les caractères suivants ne sont pas autorisés: [!@#$%^*()+=}{[\\]|;/><~]");
    }

    return (ADD_PHOTO_FIELD.value !== "" &&
                TITLE_FIELD.value !== "" &&
                CATEGORY_FIELD.value !== "no-selection");
    // } catch(error) {
    //     window.alert("Format invalide !!");
    //     console.log(error);
    //     return false;
    // }
}

// Changement de la couleur du bouton de Validation ////////////////////////////
function toggleGreyedOut() {
    CONFIRM_BUTTON.classList.toggle("btn--greyed-out", !checkInputFields());
}

// Gestion de la validité du formulaire ///////////////////////////////////////
function toggleFormSubmit() {
    ADD_PHOTO_FIELD.addEventListener("input", toggleGreyedOut);
    TITLE_FIELD.addEventListener("input", toggleGreyedOut);
    CATEGORY_FIELD.addEventListener("change", toggleGreyedOut);
    // CONFIRM_BUTTON.removeEventListener("click", () => {});
    CONFIRM_BUTTON.addEventListener("click", async (event) => {
        event.preventDefault();
        // if (!checkInputFields()) {
        //     window.alert("")
        //     return;
        // }
        const token = sessionStorage.getItem(TOKEN_NAME);
        const userId = sessionStorage.getItem(USER_ID);
        const formData = new FormData();        // Format attendu pour l'ajout de travaux
        formData.append("title", TITLE_FIELD.value);
        formData.append("category", CATEGORY_FIELD.value);
        formData.append("image", ADD_PHOTO_FIELD.files[0]); 
        const headers = {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
            "User-Id": userId
            // "Content-Type": "multipart/form-data",
        };
        await modules.sendData(WORKS_URL, headers, formData);
    });
}

// Gestion de la selection de Photo /////////////////////////////////////
function pickPhoto() {
    if (ADD_PHOTO_FIELD.value !== "") {
        document.querySelectorAll(".photo-upload-container > *").forEach(
            item => item.style.display = "none"
        );
        const imagePreview = document.createElement("img");
        const imageURL = URL.createObjectURL(ADD_PHOTO_FIELD.files[0]);   // Récupérer l'URL de la photo
        imagePreview.src = imageURL;
        document.querySelector(".photo-upload-container")
                .appendChild(imagePreview);
    }
}

// Affichage du formulaire de la modale /////////////////////////////////
async function showModalUploadForm() {
    MODAL_GALLERY.style.display = "none";
    MODAL_UPLOAD_FORM.style.display = "flex";
    CONFIRM_BUTTON.value = "Valider";
    CONFIRM_BUTTON.classList.add("btn--greyed-out");
    ADD_PHOTO_FIELD.removeEventListener("click", pickPhoto);
    ADD_PHOTO_FIELD.addEventListener("input", pickPhoto);
    TITLE_FIELD.value = "";
    const categories = await modules.fetchData(CATEGORIES_URL);
    CATEGORY_FIELD.innerHTML = "<option value=no-selection></option>";
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = "option" + category.id;
        option.textContent = category.name;
        CATEGORY_FIELD.appendChild(option);
    })
    toggleFormSubmit();
}

// Affichage de la galerie de suppression des travaux /////////////////////
function showModalGallery() {
    MODAL_UPLOAD_FORM.style.display = "none";
    GO_BACK_BUTTON.style.display = "none";
    MODAL_GALLERY.style.display = "grid";
    CONFIRM_BUTTON.value = "Ajouter une photo";
    CONFIRM_BUTTON.classList.remove("btn--greyed-out");

    document.querySelectorAll(".photo-upload-container > *").forEach(
        item => item.style.display = "block"
    );
    const imagePreview = document.querySelector(".photo-upload-container img");
    if (imagePreview) {
        imagePreview.remove();
        document.getElementById("add-photo").value = "";
    }
}

// Gestion de la modale ///////////////////////////////////////////////////
async function handleModal() {
    const addPhotoButton = document.querySelector("input[value='Ajouter une photo']");
    addPhotoButton.addEventListener("click", () => {
        document.querySelector("#modal h2").textContent = "Ajout photo";
        
        showModalUploadForm();
        
        GO_BACK_BUTTON.style.display = "block";
        GO_BACK_BUTTON.addEventListener("click", showModalGallery);
    })
}
await handleModal();