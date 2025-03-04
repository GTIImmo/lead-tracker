document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function setTextValue(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value || "Non renseigné";
        }
    }

    // 📝 **Remplissage automatique des champs du lead**
    setTextValue("nom", params.get("nom"));
    setTextValue("prenom", params.get("prenom"));
    setTextValue("email", params.get("email"));
    setTextValue("telephone", params.get("telephone"));
    setTextValue("adresse", params.get("adresse"));
    setTextValue("codePostal", params.get("codePostal"));
    setTextValue("ville", params.get("ville"));
    setTextValue("typeBien", params.get("typeBien"));
    setTextValue("surface", params.get("surface"));
    setTextValue("nbPieces", params.get("nbPieces"));
    setTextValue("prix", params.get("prix"));
    setTextValue("dateReception", params.get("dateReception"));
    setTextValue("validation", params.get("validation"));
    setTextValue("idEmail", params.get("idEmail"));
    setTextValue("agenceEnCharge", params.get("agenceEnCharge"));
    setTextValue("agenceAdresse", params.get("agenceAdresse"));
    setTextValue("agenceTelephone", params.get("agenceTelephone"));
    setTextValue("negociateurAffecte", params.get("negociateurAffecte"));
    setTextValue("telephoneCommercial", params.get("telephoneCommercial"));
    setTextValue("mailCommercial", params.get("mailCommercial"));
    setTextValue("brevo", params.get("brevo"));
    setTextValue("statutRDV", params.get("statutRDV"));
    setTextValue("rdv", params.get("rdv"));
    setTextValue("notification", params.get("notification"));

    // 📍 **Lien Google Maps**
    const googleMapsLink = document.getElementById("googleStreetView");
    if (googleMapsLink && params.get("googleStreetView")) {
        googleMapsLink.href = params.get("googleStreetView");
    }

    // 📞 **Affichage du bouton "Appeler" uniquement si un téléphone est présent**
    const telephone = params.get("telephone");
    if (telephone) {
        document.getElementById("appelerBtn").style.display = "block";
    } else {
        document.getElementById("appelerBtn").style.display = "none";
    }

    // 🛠️ **Mise à jour Google Sheets**
    function updateGoogleSheet(action, callback = null) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        let url = `https://script.google.com/macros/s/AKfycbx8jhzit3sZ1paGd6XsYCasKn_629u258n9fO5PNP6FmjXfFC6WvUGuvT_2RRQZ93IVxA/exec?action=${action}&row=${params.get("row")}`;
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

    // 📞 **Bouton "Appeler" (Mobile & PC)**
    document.getElementById("appelerBtn")?.addEventListener("click", function() {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            updateGoogleSheet("appel", function() {
                setTimeout(() => {
                    window.location.href = "tel:" + telephone;
                }, 1000);
            });
        } else {
            alert("📞 Numéro du lead : " + telephone);
            updateGoogleSheet("appel");
        }
    });

    // ✅ **Boutons d'action**
    document.getElementById("priseChargeBtn")?.addEventListener("click", () => updateGoogleSheet("confirm"));
    document.getElementById("modifierBtn")?.addEventListener("click", () => updateGoogleSheet("update"));
    document.getElementById("rendezVousBtn")?.addEventListener("click", () => updateGoogleSheet("rendezvous"));
});
