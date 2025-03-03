document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Script chargé correctement !");

    const params = new URLSearchParams(window.location.search);

    function setInputValue(id, value, editable = false) {
        let input = document.getElementById(id);
        if (input) {
            input.value = value || "";
            input.readOnly = !editable; 
            input.style.backgroundColor = editable ? "#FFF" : "#DDD";
        } else {
            console.warn(`⚠️ Champ manquant : ${id}`);
        }
    }

    // Champs modifiables uniquement
    const editableFields = ["nom", "prenom", "email", "telephone", "statutRDV", "rdv"];

    setInputValue("nom", params.get("nom"), true);
    setInputValue("prenom", params.get("prenom"), true);
    setInputValue("email", params.get("email"), true);
    setInputValue("telephone", params.get("telephone"), true);
    setInputValue("statutRDV", params.get("statutRDV"), true);
    setInputValue("rdv", params.get("rdv"), true);

    // Vérifier si le bouton "Modifier" existe
    const modifierBtn = document.getElementById("modifierBtn");
    if (!modifierBtn) {
        console.error("❌ Bouton 'Modifier' introuvable !");
        return;
    }

    function updateGoogleSheet(action, data = {}) {
        if (!confirm("Êtes-vous sûr de vouloir enregistrer ces modifications ?")) return;

        let queryParams = new URLSearchParams({ action, row: params.get("row") });

        Object.keys(data).forEach(key => {
            queryParams.append(key, data[key]);
        });

        console.log("🔍 Envoi des données à Google Apps Script :", queryParams.toString());

        fetch(`https://script.google.com/macros/s/AKfycbzc7q5-9UOVnnwsXc0SGlVGKrrg0MxdoRJaqJJvAzqfbDcHDrgjYeiJ_KlOfHBmBCoe2w/exec/exec?` + queryParams.toString())
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur :", result);
                alert("✅ Modifications enregistrées !");
            })
            .catch(error => {
                console.error("❌ Erreur d'envoi :", error);
                alert("❌ Erreur lors de l'enregistrement !");
            });
    }

    // Ajouter l'événement "click" sur le bouton Modifier
    modifierBtn.addEventListener("click", () => {
        console.log("📝 Bouton 'Modifier' cliqué !");
        let newData = {};
        editableFields.forEach(id => {
            let input = document.getElementById(id);
            if (input) newData[id] = input.value;
        });

        updateGoogleSheet("update", newData);
    });
});
