document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const telephone = params.get("telephone");

    function setInputValue(id, value) {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.value = value || "";
        }
    }

    // 📝 **Pré-remplissage des champs du lead avec les données de l'URL**
    setInputValue("nom", params.get("nom"));
    setInputValue("prenom", params.get("prenom"));
    setInputValue("email", params.get("email"));
    setInputValue("telephone", formatTelephone(telephone));
    setInputValue("adresse", params.get("adresse"));
    setInputValue("codePostal", params.get("codePostal"));
    setInputValue("ville", params.get("ville"));
    setInputValue("typeBien", params.get("typeBien"));
    setInputValue("surface", params.get("surface"));
    setInputValue("nbPieces", params.get("nbPieces"));
    setInputValue("prix", params.get("prix"));
    setInputValue("dateReception", params.get("dateReception"));
    setInputValue("googleStreetView", params.get("googleStreetView"));
    setInputValue("validation", params.get("validation"));
    setInputValue("idEmail", params.get("idEmail"));
    setInputValue("agenceEnCharge", params.get("agenceEnCharge"));
    setInputValue("agenceAdresse", params.get("agenceAdresse"));
    setInputValue("agenceTelephone", params.get("agenceTelephone"));
    setInputValue("negociateurAffecte", params.get("negociateurAffecte"));
    setInputValue("telephoneCommercial", params.get("telephoneCommercial"));
    setInputValue("mailCommercial", params.get("mailCommercial"));
    setInputValue("brevo", params.get("brevo"));
    setInputValue("statutRDV", params.get("statutRDV"));
    setInputValue("rdv", params.get("rdv"));
    setInputValue("notification", params.get("notification"));

    // 🛠️ Fonction pour ajouter un "0" si le numéro a été tronqué dans Google Sheets
    function formatTelephone(num) {
    if (!num) return ""; // Si vide, retourner une chaîne vide
    num = num.replace(/\s+/g, ''); // Supprime les espaces
    if (num.length === 9) {
        return "0" + num; // Ajoute un "0" devant si le numéro est à 9 chiffres
    }
    return num;
    }

    // 📍 **Lien Google Maps**
    const googleMapsLink = document.getElementById("googleMaps");
    if (googleMapsLink && params.get("googleStreetView")) {
        googleMapsLink.href = params.get("googleStreetView");
    }

    // 📞 **Gérer l'affichage du bouton "Appeler"**
    if (telephone) {
        document.getElementById("appelerBtn").style.display = "block";
    } else {
        document.getElementById("appelerBtn").style.display = "none";
    }

    // 🛠️ **Fonction pour mettre à jour Google Sheets**
    function updateGoogleSheet(action, callback = null) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        let url = `https://script.google.com/macros/s/AKfycbx8jhzit3sZ1paGd6XsYCasKn_629u258n9fO5PNP6FmjXfFC6WvUGuvT_2RRQZ93IVxA/exec?action=${action}&row=${params.get("row")}`;
        console.log("📡 URL envoyée : " + url);

        fetch(url)
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur : " + result);
                alert(result);
                if (callback) callback(); // Exécute la suite après mise à jour (ex: appel mobile)
            })
            .catch(error => console.error("❌ Erreur : " + error));
    }

    // 📞 **Bouton "Appeler" (différent sur PC et mobile)**
    document.getElementById("appelerBtn")?.addEventListener("click", function() {
    const formattedTelephone = formatTelephone(telephone);

    if (/Mobi|Android/i.test(navigator.userAgent)) {
        // 📱 Mobile : Enregistrer d'abord dans Google Sheets puis appeler
        updateGoogleSheet("appel", function() {
            setTimeout(() => {
                window.location.href = "tel:" + formattedTelephone;
            }, 1000); // ⏳ Délai pour s'assurer que la mise à jour est bien faite
        });
    } else {
        // 🖥️ PC : Afficher une popup avec le numéro
        alert("📞 Numéro du lead : " + formattedTelephone);
        updateGoogleSheet("appel");
    }
});

    // ✅ **Boutons d'action sur le lead**
    document.getElementById("priseChargeBtn")?.addEventListener("click", () => updateGoogleSheet("confirm"));
    document.getElementById("modifierBtn")?.addEventListener("click", () => updateGoogleSheet("update"));
    document.getElementById("rendezVousBtn")?.addEventListener("click", () => updateGoogleSheet("rendezvous"));
});
