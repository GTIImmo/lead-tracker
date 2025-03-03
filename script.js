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

    function updateGoogleSheet(action) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        fetch(`https://script.google.com/macros/s/AKfycby6aqw4oDxwUwHoc6JyDmKk6UoNwtQvLMKJu-wmWSzp7wI6emnL-yJycPWBH6AvJv5O-Q/exec?action=${action}&row=${params.get("row")}`)
            .then(() => alert("✅ Modifications enregistrées !"))
            .catch(() => alert("❌ Erreur"));
    }

    document.getElementById("priseChargeBtn").addEventListener("click", () => updateGoogleSheet("confirm"));
    document.getElementById("modifierBtn").addEventListener("click", () => {
        let newData = new URLSearchParams();
        document.querySelectorAll("input").forEach(input => {
            newData.append(input.id, input.value);
        });

        fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=update&row=${params.get("row")}&` + newData.toString())
            .then(() => alert("✅ Modifications enregistrées !"));
    });
});
