document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function setInputValue(id, value, editable = false) {
        let input = document.getElementById(id);
        input.value = value || "";
        input.readOnly = !editable; // Désactive les champs non modifiables
        input.style.backgroundColor = editable ? "#FFF" : "#DDD"; // Style visuel
    }

    // 📝 Liste des champs modifiables
    const editableFields = ["nom", "prenom", "email", "telephone", "statutRDV", "rdv"];

    // 🔒 Remplissage et verrouillage des champs
    setInputValue("nom", params.get("nom"), true);
    setInputValue("prenom", params.get("prenom"), true);
    setInputValue("email", params.get("email"), true);
    setInputValue("telephone", params.get("telephone"), true);
    setInputValue("statutRDV", params.get("statutRDV"), true);
    setInputValue("rdv", params.get("rdv"), true);
    
    // 🚫 Champs non modifiables
    setInputValue("adresse", params.get("adresse"));
    setInputValue("codePostal", params.get("codePostal"));
    setInputValue("ville", params.get("ville"));
    setInputValue("typeBien", params.get("typeBien"));
    setInputValue("surface", params.get("surface"));
    setInputValue("prix", params.get("prix"));
    setInputValue("dateReception", params.get("dateReception"));
    document.getElementById("googleMaps").href = params.get("googleMaps");

    function updateGoogleSheet(action, data = {}) {
        if (!confirm("Êtes-vous sûr de vouloir enregistrer ces modifications ?")) return;

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
        editableFields.forEach(id => {
            let input = document.getElementById(id);
            newData[id] = input.value;
    document.getElementById("modifierBtn").addEventListener("click", () => {
    let newData = {};
    editableFields.forEach(id => {
        let input = document.getElementById(id);
        newData[id] = input.value;
    });

    console.log("🔍 Données envoyées :", newData); // 🔴 Debug

    fetch(`https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=update&row=${params.get("row")}&` + new URLSearchParams(newData).toString())
        .then(response => response.text())
        .then(result => {
            console.log("✅ Réponse du serveur :", result);
            alert("✅ Modifications enregistrées !");
        })
        .catch(error => {
            console.error("❌ Erreur d'envoi :", error);
            alert("❌ Erreur lors de l'enregistrement !");
        });
});

        });

        updateGoogleSheet("update", newData);
    });
});
