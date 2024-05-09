import { USERS_LOGIN_URL } from "./constants.js";
import * as modules from "./modules.js";


// Gestion du login ////////////////////////////////////////////////
const handleLoginButton = async (event) => {
    event.preventDefault();
    const submitButton = document.querySelector('input[value="Connexion"]');
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");
    const loginData = await modules.sendData(USERS_LOGIN_URL,
        {
            email: emailField.value,
            password: passwordField.value
        });

    if (loginData.token) {
        sessionStorage.setItem("token", loginData.token);
        window.location.href = "./index.html";
    } else {
        const existingErrorMessage = document.querySelector(".error-message");

        if (!existingErrorMessage) {
            const errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            errorMessage.textContent = "La combinaison adresse email / mot de passe est incorrecte";
            submitButton.insertAdjacentElement('afterend', errorMessage);
        } else {
            existingErrorMessage.style.animation = "jiggle 500ms";
            setTimeout(() => { existingErrorMessage.style.animation = ""; }, 500);
        }
    }
};

// Event listener du bouton connexion
function loginButton() {
    const submitButton = document.querySelector('input[value="Connexion"]');
    submitButton.addEventListener("click", handleLoginButton);
};
loginButton();