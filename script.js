document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);

    function formatTelephone(num) {
        if (!num) return "";
        num = num.replace(/\s+/g, '');
        if (num.length === 9 && /^[1-9][0-9]+$/.test(num)) {
            return "0" + num;
        }
        return num;
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        let dateObj = new Date(dateString);
        if (isNaN(dateObj)) return dateString; // Si invalide, retourne la valeur brute
        return dateObj.toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit" }) +
            " " + dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }

    function getParamValue(key) {
        return params.has(key) ? decodeURIComponent(params.get(key)) : "";
    }

    function setTextContent(id, value, format = null) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = format ? format(value) : value || "";
        }
    }

    // 🚀 **Pré-remplissage des informations du lead**
    const fields = ["nom", "prenom", "email", "telephone", "adresse", "codePostal", "ville", "typeBien", "surface", "nbPieces", "prix"];
    let modifications = {};
    let hasEmptyFields = false;

    fields.forEach(id => {
        const element = document.getElementById(id);
        const value = getParamValue(id);
        
        if (element) {
            if (value.trim()) {
                element.textContent = value;
            } else {
                hasEmptyFields = true;
                // Création d'un champ modifiable
                const input = document.createElement("input");
                input.type = "text";
                input.id = `edit-${id}`;
                input.className = "form-control";
                input.placeholder = `Modifier ${id}`;
                element.appendChild(input);

                input.addEventListener("input", () => {
                    modifications[id] = input.value;
                    document.getElementById("enregistrerModifications").style.display = "block"; // Afficher le bouton Enregistrer
                });
            }
        }
    });

    // 📍 **Lien Google Maps**
    const googleMapsLink = document.getElementById("googleMaps");
    if (googleMapsLink && getParamValue("googleMaps")) {
        googleMapsLink.href = getParamValue("googleMaps");
        googleMapsLink.textContent = "📍 Voir sur Google Maps";
    }

    // 📞 **Gérer l'affichage du bouton "Appeler"**
    const telephone = formatTelephone(getParamValue("telephone"));
    if (telephone) {
        document.getElementById("appelerBtn").style.display = "block";
    } else {
        document.getElementById("appelerBtn").style.display = "none";
    }

    function updateGoogleSheet(action, callback = null) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        let url = `https://script.google.com/macros/s/AKfycbzKoPG9RZbPNzW-MDXmzs99f8eMaoYFF6awbb4_NPdeBhKATXqiwfQQMtD_k__bVN0t/exec?action=${action}&row=${params.get("row")}`;
        console.log("📡 URL envoyée : " + url);

        fetch(url)
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur : " + result);
                alert(result);
                if (callback) callback();
            })
            .catch(error => console.error("❌ Erreur : " + error));
    }

    document.getElementById("appelerBtn")?.addEventListener("click", function () {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            updateGoogleSheet("appel", function () {
                setTimeout(() => {
                    window.location.href = "tel:" + telephone;
                }, 1000);
            });
        } else {
            alert("📞 Numéro du lead : " + telephone);
            updateGoogleSheet("appel");
        }
    });

    // 📥 **Bouton "Enregistrer" pour envoyer les modifications**
    const saveButton = document.getElementById("enregistrerModifications");
    if (saveButton) {
        saveButton.addEventListener("click", function () {
            if (Object.keys(modifications).length === 0) {
                alert("Aucune modification détectée.");
                return;
            }

            let url = `https://script.google.com/macros/s/AKfycbzKoPG9RZbPNzW-MDXmzs99f8eMaoYFF6awbb4_NPdeBhKATXqiwfQQMtD_k__bVN0t/exec?action=update&row=${params.get("row")}`;

            Object.keys(modifications).forEach(key => {
                url += `&${encodeURIComponent(key)}=${encodeURIComponent(modifications[key])}`;
            });

            console.log("📡 Envoi des modifications : " + url);

            fetch(url)
                .then(response => response.text())
                .then(result => {
                    console.log("✅ Réponse serveur : " + result);
                    alert(result);
                    location.reload(); // Recharge la page pour voir les mises à jour
                })
                .catch(error => console.error("❌ Erreur : " + error));
        });

        if (hasEmptyFields) {
            saveButton.style.display = "block"; // Affiche le bouton s'il y a des champs à modifier
        }
    }

    // 🎯 **Gestion des autres actions**
    document.getElementById("priseChargeBtn")?.addEventListener("click", () => updateGoogleSheet("confirm"));
    document.getElementById("modifierBtn")?.addEventListener("click", () => updateGoogleSheet("update"));
    document.getElementById("rendezVousBtn")?.addEventListener("click", () => updateGoogleSheet("rendezvous"));
});
