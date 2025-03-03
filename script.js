document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function setInputValue(id, value) {
        document.getElementById(id).value = value || "";
    }

    // Remplissage automatique des champs avec les valeurs du lead
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
    document.getElementById("googleMaps").href = params.get("googleMaps");

    setInputValue("agence", params.get("agence"));
    setInputValue("agenceAdresse", params.get("agenceAdresse"));
    setInputValue("agenceTelephone", params.get("agenceTelephone"));
    setInputValue("negociateur", params.get("negociateur"));
    setInputValue("mailCommercial", params.get("mailCommercial"));

    function updateGoogleSheet(action, data = {}) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) {
            return;
        }

        let queryParams = new URLSearchParams({ action, row: params.get("row") });

        Object.keys(data).forEach(key => {
            queryParams.append(key, data[key]);
        });

        fetch(`https://script.google.com/macros/s/AKfycbzc7q5-9UOVnnwsXc0SGlVGKrrg0MxdoRJaqJJvAzqfbDcHDrgjYeiJ_KlOfHBmBCoe2w/exec?` + queryParams.toString())
            .then(response => response.text())
            .then(result => alert("✅ Modifications enregistrées avec succès !"))
            .catch(error => alert("❌ Erreur lors de l'enregistrement !"));
    }

    document.getElementById("priseChargeBtn").addEventListener("click", () => updateGoogleSheet("confirm"));

    document.getElementById("modifierBtn").addEventListener("click", () => {
        let newData = {};
        document.querySelectorAll("input").forEach(input => {
            newData[input.id] = input.value;
        });

        updateGoogleSheet("update", newData);
    });
});
