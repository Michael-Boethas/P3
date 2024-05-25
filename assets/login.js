import { USERS_LOGIN_URL, LOGIN_SUBMIT_BUTTON, TOKEN_NAME, USER_ID } from "./constants.js";
import * as modules from "./modules.js";


// Gestion du login ////////////////////////////////////////////////
const handleLoginButton = async (event) => {
    event.preventDefault();
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const loginData = await modules.sendData(USERS_LOGIN_URL,
        {
            "Content-Type": "application/json"
        },
        {
            "email": emailField.value,
            "password": passwordField.value
        }).catch(err => {
            Swal.fire({
                icon: "warning",
                text: `Erreur lors de la réception de données
                       depuis le serveur`,
                showCloseButton: true,
                showConfirmButton: false
            })
            console.log(err);
        })

    if (loginData.token) {
        sessionStorage.setItem(USER_ID, loginData.userId);
        sessionStorage.setItem(TOKEN_NAME, loginData.token);
        window.location.href = "./index.html";
    } else {
        passwordField.value = "";
        const existingErrorMessage = document.querySelector(".error-message");

        if (!existingErrorMessage) {
            const errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            errorMessage.textContent = "La combinaison adresse email / mot de passe est incorrecte";
            LOGIN_SUBMIT_BUTTON.insertAdjacentElement("afterend", errorMessage);
        } else {
            existingErrorMessage.style.animation = "jiggle 500ms";
            setTimeout(() => { existingErrorMessage.style.animation = ""; }, 500);
        }
    }
};

LOGIN_SUBMIT_BUTTON.addEventListener("click", handleLoginButton);