document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function setInputValue(id, value) {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.value = value || "";
        }
    }

    // Pré-remplissage des champs avec les données du lead
    setInputValue("nom", params.get("nom"));
    setInputValue("prenom", params.get("prenom"));
    setInputValue("email", params.get("email"));
    setInputValue("telephone", params.get("telephone"));
    setInputValue("adresse", params.get("adresse"));
    setInputValue("codePostal", params.get("codePostal"));
    setInputValue("ville", params.get("ville"));
    setInputValue("typeBien", params.get("typeBien"));
    setInputValue("surface", params.get("surface"));
    setInputValue("prix", params.get("prix"));
    setInputValue("dateReception", params.get("dateReception"));
    setInputValue("mailCommercial", params.get("mailCommercial"));

    const googleMapsLink = document.getElementById("googleMaps");
    if (googleMapsLink && params.get("googleMaps")) {
        googleMapsLink.href = params.get("googleMaps");
    }

    // Fonction pour envoyer les actions vers Google Sheets via Google Apps Script
    function updateGoogleSheet(action) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        fetch(`https://script.google.com/macros/s/AKfycbx8jhzit3sZ1paGd6XsYCasKn_629u258n9fO5PNP6FmjXfFC6WvUGuvT_2RRQZ93IVxA/exec?action=${action}&row=${params.get("row")}`)
            .then(() => alert("✅ Action enregistrée avec succès !"))
            .catch(() => alert("❌ Erreur lors de l'enregistrement"));
    }

    // Gestion du bouton "C'est noté"
    document.getElementById("priseChargeBtn")?.addEventListener("click", () => updateGoogleSheet("confirm"));

    // Gestion du bouton "Modifier"
    document.getElementById("modifierBtn")?.addEventListener("click", () => {
        let newData = new URLSearchParams();
        document.querySelectorAll("input").forEach(input => {
            newData.append(input.id, input.value);
        });

        fetch(`https://script.google.com/macros/s/AKfycbx8jhzit3sZ1paGd6XsYCasKn_629u258n9fO5PNP6FmjXfFC6WvUGuvT_2RRQZ93IVxA/exec?action=update&row=${params.get("row")}&` + newData.toString())
            .then(() => alert("✅ Modifications enregistrées avec succès !"))
            .catch(() => alert("❌ Erreur lors de la mise à jour"));
    });

    // Gestion du bouton "Rendez-vous"
    document.getElementById("rendezVousBtn")?.addEventListener("click", () => updateGoogleSheet("rendezvous"));

    // Gestion du bouton "📞 Appeler" (Mobile & PC)
    const telephone = params.get("telephone");
    if (telephone) {
        document.getElementById("appelerBtn").style.display = "block";
    } else {
        document.getElementById("appelerBtn").style.display = "none";
    }

    document.getElementById("appelerBtn")?.addEventListener("click", function() {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
        // 📱 Sur mobile : Enregistrer d'abord dans Google Sheets puis appeler
        updateGoogleSheet("appel", function() {
            setTimeout(() => {
                window.location.href = "tel:" + telephone;
            }, 1000); // ⏳ Petit délai pour laisser Google Sheets s'enregistrer
        });
    } else {
        // 🖥️ Sur PC : Afficher le numéro et enregistrer l'appel
        alert("📞 Numéro du lead : " + telephone);
        updateGoogleSheet("appel");
    }
});
