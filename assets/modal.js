import * as modules from "./modules.js"
import { MODAL_GALLERY, MODAL_UPLOAD_FORM, CONFIRM_BUTTON,
         ADD_PHOTO_FIELD, TITLE_FIELD, CATERGORY_FIELD, GO_BACK_BUTTON,
         WORKS_URL, TOKEN_NAME, USER_ID, 
         CATEGORIES_URL} from "./constants.js"


function checkInputFields() {
    const titleField = document.getElementById("title");
    const categoryField = document.getElementById("categories-dropdown");
    return (ADD_PHOTO_FIELD.value !== "" &&
            titleField.value !== "" &&
            categoryField.value !== "no-selection");
}

function toggleGreyedOut() {
    CONFIRM_BUTTON.classList.toggle("btn--greyed-out", !checkInputFields());
}

function toggleFormSubmit() {
    ADD_PHOTO_FIELD.addEventListener("input", toggleGreyedOut);
    TITLE_FIELD.addEventListener("input", toggleGreyedOut);
    CATERGORY_FIELD.addEventListener("change", toggleGreyedOut);
    CONFIRM_BUTTON.addEventListener("click", async (event) => {
        event.preventDefault();
        const token = sessionStorage.getItem(TOKEN_NAME);
        const userId = sessionStorage.getItem(USER_ID);
        // const formData = new FormData();
        // formData.append('title', TITLE_FIELD.value);
        // formData.append('category', CATERGORY_FIELD.value);
        // formData.append('image', ADD_PHOTO_FIELD.value); 
        // const headers = {
        //    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTUwNDc1MCwiZXhwIjoxNzE1NTkxMTUwfQ.zosK7or3x5fcoNzFrrpH5J-RTK3e95RaYXdaxFXvUrw'
        // };
        await modules.sendData(
            WORKS_URL,
            {
                "accept": "application/json",
                "Authorization": `Bearer ${token}`,
                "User-Id": userId
            },
            {
                "title": TITLE_FIELD.value,
                "category": CATERGORY_FIELD.value,
                "image": ADD_PHOTO_FIELD.value
            }
        );
    });
}

// Gestion de la selection de Photo /////////////////////////////////////
function pickPhoto() {
    if (ADD_PHOTO_FIELD.value !== "") {
        document.querySelectorAll(".photo-upload-container > *").forEach(
            item => item.style.display = "none"
        );
        const photo = document.createElement("img");
        const file = ADD_PHOTO_FIELD.files[0];
        const imageURL = URL.createObjectURL(file);     // Récupérer l'URL de la photo
        photo.src = imageURL;
        document.querySelector(".photo-upload-container")
                .appendChild(photo);
    }
}


async function showModalUploadForm() {
    MODAL_GALLERY.style.display = "none";
    MODAL_UPLOAD_FORM.style.display = "flex";
    CONFIRM_BUTTON.value = "Valider";
    CONFIRM_BUTTON.classList.add("btn--greyed-out");
    ADD_PHOTO_FIELD.removeEventListener("click", pickPhoto);
    ADD_PHOTO_FIELD.addEventListener("input", pickPhoto);
    TITLE_FIELD.value = "";
    const categories = await modules.fetchData(CATEGORIES_URL);
    CATERGORY_FIELD.innerHTML = "<option value=no-selection></option>";
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = "option" + category.id;
        option.textContent = category.name;
        CATERGORY_FIELD.appendChild(option);
    })
    toggleFormSubmit();
}

function showModalGallery() {
    MODAL_UPLOAD_FORM.style.display = "none";
    GO_BACK_BUTTON.style.display = "none";
    MODAL_GALLERY.style.display = "grid";
    CONFIRM_BUTTON.value = "Ajouter une photo";
    CONFIRM_BUTTON.classList.remove("btn--greyed-out");

    document.querySelectorAll(".photo-upload-container > *").forEach(
        item => item.style.display = "block"
    );
    const uploadedPhoto = document.querySelector(".photo-upload-container img");
    if (uploadedPhoto) {
        uploadedPhoto.remove();
        document.getElementById("add-photo").value = "";
    }
}

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