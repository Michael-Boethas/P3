import * as modules from "./modules.js"
import { LAYER, MODAL_WINDOW, MODAL_GALLERY, MODAL_UPLOAD_FORM, MODAL_SUBMIT_BUTTON,
         ADD_PHOTO_FIELD, TITLE_FIELD, CATEGORY_FIELD, GO_BACK_BUTTON,
         WORKS_URL, TOKEN_NAME, CATEGORIES_URL, REGEX,ADD_PHOTO_BUTTON,
         MODAL_HEADING, MAIN_GALLERY} from "./constants.js"



// Gestion de la selection de Photo /////////////////////////////////////
function displayImagePreview() {
    if (ADD_PHOTO_FIELD.value !== "") { 
        document.querySelectorAll(".photo-upload-container > *").forEach(item => {
            item.id === "add-photo" ? null : item.style.display = "none";     // Ignorer le bouton file input
            item.nodeName === "IMG" ? item.remove() : null;                 // Suppression de l'image existante
         });
        const imagePreview = document.createElement("img");
        const imageURL = URL.createObjectURL(ADD_PHOTO_FIELD.files[0]);      // Acquisition de l'URL de la photo
        imagePreview.src = imageURL;
        document.querySelector(".photo-upload-container")
                .appendChild(imagePreview);
    }
}

// Suppression d'une image invalide ///////////////////////////////////////////
function removeImage() {
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
    const selectedPhoto = addPhotoField.files[0];
    if ((selectedPhoto.type !== "image/jpeg" &&
         selectedPhoto.type !== "image/png" &&
         selectedPhoto.value !== "") ||
         selectedPhoto.size > 4194304) {
            Swal.fire({
                icon: "warning",
                text: `Formats acceptés:  jpg, png. 4mo max`,
                showCloseButton: true,
                showConfirmButton: false
            })
            removeImage();
            toggleGreyedOut();
            toggleFormSubmit();
            return false;
    } else {
        return true;
    }
}

// Vérification du contenu de la chaine de caractères /////////////////////////
function stringIsValid(string) {
    if (REGEX.test(string)) {
        Swal.fire({
            icon: "warning",
            text: `Les caractères suivants ne sont pas autorisés:
            \`!@#$%^&*()_+={}[]|\\;?/><`,
            showCloseButton: true,
            showConfirmButton: false
        })
        TITLE_FIELD.value = "";
        toggleGreyedOut();
        toggleFormSubmit();
    } else {
        return !REGEX.test(string);
    }
}

// Verification du champs catégorie ///////////////////////////////////////////
function optionIsSelected() {
    if (CATEGORY_FIELD.value === "no-selection") {
        return false;
    } else {
        toggleGreyedOut();
        toggleFormSubmit();
        return true;
    }
}

// Vérification de la complétude du formulaire ///////////////////////////////
function formIsFilled() {
    return (ADD_PHOTO_FIELD.value !== "" &&
            TITLE_FIELD.value !== "" &&
            CATEGORY_FIELD.value !== "no-selection");
}

// Vérification de la validité du formulaire //////////////////////////////////
function checkInputFields() {
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
        const formData = new FormData();                // Format pour l'envoi des données du formulaire 
        formData.append("image", ADD_PHOTO_FIELD.files[0]);
        formData.append("title", TITLE_FIELD.value);
        formData.append("category", CATEGORY_FIELD.value.slice(-1)); // option-n
        const response = await fetch(WORKS_URL, {       // Envoi des travaux à l'API
          "method": "POST",
          "body": formData,
          "headers": 
          {
            "Authorization": `Bearer ${token}`,     // Authentification
            }
        })
        return response.ok;                  // Statut de la requête
    } catch (error) {
        console.error(error);
        return false;
    }
}


// Gestion du bouton d'envoi des données /////////////////////////////////////
async function submitButton(event) {
    event.preventDefault();
    if (checkInputFields()) {                    // Vérification des champs du formulaire
        Swal.fire({
            text: "Confirmer l'ajout ?",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non"
        }).then(async (result) => { 
            if (result.isConfirmed) {
                const isSuccess = await uploadWork();    // Fonction d'envoi des travaux
                if (isSuccess) {
                    Swal.fire({
                        icon: "success",
                        text: `L'ajout a bien été pris en compte`,
                        showCloseButton: true,
                        showConfirmButton: false
                    })
                    setModalGallery();             // Affichage de la galerie modale avec le travail ajouté
                } else {
                    Swal.fire({
                        icon: "warning",
                        text: `Échec de l'ajout`,
                        showCloseButton: true,
                        showConfirmButton: false
                    })
                }
            }
        })
    }
}

// Gestion de la validité du formulaire ///////////////////////////////////////
function toggleFormSubmit() {
    MODAL_SUBMIT_BUTTON.removeEventListener("click", submitButton); 
    if (formIsFilled()) {
        MODAL_SUBMIT_BUTTON.addEventListener("click", submitButton);     // Activation du bouton submit
    }
}

// Changement de la couleur du bouton de Validation ////////////////////////////
function toggleGreyedOut() {
    MODAL_SUBMIT_BUTTON.classList.toggle("btn--greyed-out", !formIsFilled());
}

// Affichage de la modale //////////////////////////////////////////////////////
export async function showModal() {
    LAYER.style.display = "block";
    MODAL_WINDOW.style.display = "flex";
    await setModalGallery();
}

// Fermeture de la modale /////////////////////////////////////////////////////
export async function hideModal() {
    await setModalGallery();
    LAYER.style.display = "none";
    MODAL_WINDOW.style.display = "none";
}

// Mise en place du formulaire de la modale ///////////////////////////////////
async function setModalUploadForm() {

    MODAL_GALLERY.style.display = "none";
    MODAL_UPLOAD_FORM.style.display = "flex";                // Mise en place du formulaire 
    MODAL_HEADING.textContent = "Ajout photo";
    ADD_PHOTO_BUTTON.style.display = "none";
    MODAL_SUBMIT_BUTTON.style.display = "block";
    MODAL_SUBMIT_BUTTON.classList.add("btn--greyed-out");
    GO_BACK_BUTTON.style.display = "block";
    GO_BACK_BUTTON.addEventListener("click", setModalGallery);
    TITLE_FIELD.value = "";
    ADD_PHOTO_FIELD.value = "";
    ADD_PHOTO_FIELD.addEventListener("click", () => { 
        removeImage();
        toggleGreyedOut();
    })
    ADD_PHOTO_FIELD.removeEventListener("input", displayImagePreview);
    ADD_PHOTO_FIELD.addEventListener("input", displayImagePreview);     // Affichage de l'aperçu

    const categories = await modules.fetchData(CATEGORIES_URL);
    CATEGORY_FIELD.innerHTML = "<option value=no-selection></option>";  // Rafraichissement des catégories
    categories.forEach(category => {                                    // Ajout dynamique des catégories
        const option = document.createElement("option");
        option.value = "option-" + category.id;
        option.textContent = category.name;
        CATEGORY_FIELD.appendChild(option);
    });

    const formFields = [ADD_PHOTO_FIELD, TITLE_FIELD, CATEGORY_FIELD];  // Gestion des champs du formulaire
    formFields.forEach(field => 
        field.removeEventListener("input", toggleGreyedOut));
    formFields.forEach(field =>
        field.addEventListener("input", toggleGreyedOut));
    formFields.forEach(field =>
        field.removeEventListener("input", toggleFormSubmit));
    formFields.forEach(field =>
        field.addEventListener("input", toggleFormSubmit));

    MODAL_UPLOAD_FORM.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            MODAL_SUBMIT_BUTTON.click();
        }
    });
}


// Affichage de la galerie de suppression des travaux /////////////////////
async function setModalGallery() {
    MODAL_HEADING.textContent = "Galerie photo";
    MODAL_UPLOAD_FORM.style.display = "none";
    GO_BACK_BUTTON.style.display = "none";
    MODAL_GALLERY.style.display = "grid";
    MODAL_SUBMIT_BUTTON.style.display = "none";
    MODAL_SUBMIT_BUTTON.classList.remove("btn--greyed-out");
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
async function handleModal() {
    if (ADD_PHOTO_BUTTON) {
        ADD_PHOTO_BUTTON.addEventListener("click", () => {
            setModalUploadForm();
        })
    }
}
await handleModal();

