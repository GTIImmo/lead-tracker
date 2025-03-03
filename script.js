document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function setInputValue(id, value) {
        let field = document.getElementById(id);
        if (field) {
            field.value = value ? value : ""; // Gérer les valeurs nulles
        }
    }

    function formatNumber(value) {
        return value ? parseFloat(value).toLocaleString("fr-FR") : "";
    }

    function formatDate(value) {
        if (!value) return "";
        let date = new Date(value);
        return isNaN(date.getTime()) ? value : date.toLocaleDateString("fr-FR");
    }

    // Remplissage automatique des champs
    setInputValue("nom", params.get("nom"));
    setInputValue("prenom", params.get("prenom"));
    setInputValue("email", params.get("email"));
    setInputValue("telephone", params.get("telephone"));
    setInputValue("adresse", params.get("adresse"));
    setInputValue("codePostal", params.get("codePostal"));
    setInputValue("ville", params.get("ville"));
    setInputValue("typeBien", params.get("typeBien"));
    setInputValue("surface", formatNumber(params.get("surface")));
    setInputValue("prix", formatNumber(params.get("prix")));
    setInputValue("dateReception", formatDate(params.get("dateReception")));
    document.getElementById("googleMaps").href = params.get("googleMaps");

    // Informations Agence
    setInputValue("agence", params.get("agence"));
    setInputValue("agenceAdresse", params.get("agenceAdresse"));
    setInputValue("agenceTelephone", params.get("agenceTelephone"));
    setInputValue("negociateur", params.get("negociateur"));
    setInputValue("mailCommercial", params.get("mailCommercial"));

    // Fonction pour mettre à jour Google Sheets via Google Apps Script
    function updateGoogleSheet(action, data = {}) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) {
            return;
        }

        let queryParams = new URLSearchParams({ action, row: params.get("row") });

        Object.keys(data).forEach(key => {
            queryParams.append(key, data[key]);
        });

        fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?` + queryParams.toString())
            .then(response => response.text())
            .then(result => alert("✅ Modifications enregistrées avec succès !"))
            .catch(error => alert("❌ Erreur lors de l'enregistrement !"));
    }

    // Gestion des interactions avec les boutons
    document.getElementById("priseChargeBtn").addEventListener("click", () => updateGoogleSheet("confirm"));

    document.getElementById("modifierBtn").addEventListener("click", () => {
        let newData = {};
        document.querySelectorAll("input").forEach(input => {
            newData[input.id] = input.value;
        });

        updateGoogleSheet("update", newData);
    });

    document.getElementById("rendezVousBtn").addEventListener("click", () => updateGoogleSheet("rendezvous"));
});
