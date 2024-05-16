import * as modules from "./modules.js"
import { MODAL_GALLERY,MODAL_UPLOAD_FORM } from "./constants.js"


const toggleGreyedOut = () => {
    const confirmButton = document.querySelector("#modal input[type='button']");
    confirmButton.classList.toggle("btn--greyed-out", !checkInputFields());
}

function checkInputFields() {
    const addPhotoField = document.getElementById("add-photo");
    const titleField = document.getElementById("title");
    const categoryField = document.getElementById("categories-dropdown");
    return (addPhotoField.value !== "" && titleField.value !== "" && categoryField.value !== "no-selection");
}

const handleModal = async () => {
    const addPhotoButton = document.querySelector("input[value='Ajouter une photo']");
    addPhotoButton.addEventListener("click", () => {
        document.querySelector("#modal h2").textContent = "Ajout photo";
        
        const confirmButton = document.querySelector("#modal input[type='button']");
        confirmButton.value = "Valider";
        confirmButton.classList.add("btn--greyed-out");

        const addPhotoField = document.getElementById("add-photo");
        addPhotoField.addEventListener("input", () => {
            if (addPhotoField.value !== "") {
                document.querySelectorAll(".photo-upload-container > *").forEach(
                    item => item.style.display = "none"
                );
                const photo = document.createElement("img");
                const file = addPhotoField.files[0];
                const imageURL = URL.createObjectURL(file);     // Récupérer l'URL de la photo
                photo.src = imageURL;
                document.querySelector(".photo-upload-container")
                        .appendChild(photo);
            }
        });
        
        document.getElementById("add-photo")
            .addEventListener("input", toggleGreyedOut);
        document.getElementById("title")
            .addEventListener("input", toggleGreyedOut);
        document.getElementById("categories-dropdown")
            .addEventListener("change", toggleGreyedOut);

        MODAL_GALLERY.style.display = "none";
        MODAL_UPLOAD_FORM.style.display = "flex";
        
        const goBackButton = document.getElementsByClassName("fa-arrow-left")[0];
        goBackButton.style.display = "block";
        goBackButton.addEventListener("click", async () => {


            MODAL_UPLOAD_FORM.style.display = "none";
            await modules.showModal();
            goBackButton.style.display = "none";
            confirmButton.value = "Ajouter une photo";
            confirmButton.classList.remove("btn--greyed-out");

            document.querySelectorAll(".photo-upload-container > *").forEach(
                item => item.style.display = "block"
            );
            document.querySelector(".photo-upload-container img").remove();
        });
    })
}
await handleModal();