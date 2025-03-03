document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function setInputValue(id, value) {
        document.getElementById(id).value = value || "";
    }

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

    document.addEventListener("DOMContentLoaded", function() {
    function updateGoogleSheet(action) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=${action}&row=${new URLSearchParams(window.location.search).get("row")}`)
            .then(() => alert("✅ Action enregistrée avec succès !"))
            .catch(() => alert("❌ Erreur"));
    }

    document.getElementById("priseChargeBtn").addEventListener("click", () => updateGoogleSheet("confirm"));
    document.getElementById("modifierBtn").addEventListener("click", () => updateGoogleSheet("update"));
    document.getElementById("rendezVousBtn").addEventListener("click", () => updateGoogleSheet("rendezvous"));
});


        fetch(`https://script.google.com/macros/s/AKfycbwzQZu7sPa8q3NSKYT46Kg_9phPivfqT1l3riHQ0YmBOorroTtdMuDwgZX3dxGTvxHQLg/exec?action=update&row=${params.get("row")}&` + newData.toString())
            .then(() => alert("✅ Modifications enregistrées !"));
    });
});
