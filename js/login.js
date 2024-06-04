import * as modules from "./modules.js";
import { USERS_LOGIN_URL, LOGIN_SUBMIT_BUTTON, TOKEN_NAME, USER_ID, CONTACT_LINK } from "./constants.js";


// Gestion du login ////////////////////////////////////////////////
async function handleLoginButton(event) {
    event.preventDefault();                                     // Prévention du raffraîchissement de la page
    
    const emailField = document.getElementById("email");        // Aquisition des identifiants saisis
    const passwordField = document.getElementById("password");
    const loginData = await modules.sendData(USERS_LOGIN_URL,   // Envoi des identifiants à la route /users/login de l'API et réception du token
        {
            "Content-Type": "application/json"                  // Données envoyées en JSON
        },
        {
            "email": emailField.value,                          // Envoi des identifiants saisis dans le body
            "password": passwordField.value
        })
        .catch(error => {
            Swal.fire({
                icon: "warning",
                text: `Erreur lors de la réception de données
                       depuis le serveur`,
                showCloseButton: true,
                showConfirmButton: false
            })
            console.error(error);
        })

    if (loginData.token) {                                      // Stockage de l'identifiant et du token de connexion
        sessionStorage.setItem(USER_ID, loginData.userId);
        sessionStorage.setItem(TOKEN_NAME, loginData.token);
        window.location.href = "./index.html";                  // Redirection après connexion
    } else {
        passwordField.value = "";                               // Suppression du contenu du champs mot de passe 
        const existingErrorMessage = document.querySelector(".error-message");

        if (!existingErrorMessage) {
            const errorMessage = document.createElement("span");
            errorMessage.classList.add("error-message");
            errorMessage.textContent = "La combinaison adresse email / mot de passe est incorrecte";
            LOGIN_SUBMIT_BUTTON.insertAdjacentElement("afterend", errorMessage);    // Insertion du message d'erreur en pied de formulaire 
        } else {
            existingErrorMessage.style.animation = "jiggle 500ms";
            setTimeout(() => { existingErrorMessage.style.animation = ""; }, 500);   // Animation CSS du message d'erreur si déjà affiché
        }
    }
};

LOGIN_SUBMIT_BUTTON.addEventListener("click", handleLoginButton);   // Attachement de la fonctionnalité login au bouton submit

// Gestion de la redirection vers la section index.html#contact /////////////////////
CONTACT_LINK.addEventListener("click", () => {
    sessionStorage.setItem("contactRedirect", true);
});

modules.dummyElements();