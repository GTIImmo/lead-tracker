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

    // 📝 Champs modifiables uniquement
    const editableFields = ["nom", "prenom", "email", "telephone", "statutRDV", "rdv"];

    setInputValue("nom", params.get("nom"), true);
    setInputValue("prenom", params.get("prenom"), true);
    setInputValue("email", params.get("email"), true);
    setInputValue("telephone", params.get("telephone"), true);
    setInputValue("statutRDV", params.get("statutRDV"), true);
    setInputValue("rdv", params.get("rdv"), true);

    setInputValue("adresse", params.get("adresse"));
    setInputValue("codePostal", params.get("codePostal"));
    setInputValue("ville", params.get("ville"));
    setInputValue("typeBien", params.get("typeBien"));
    setInputValue("surface", params.get("surface"));
    setInputValue("prix", params.get("prix"));
    setInputValue("dateReception", params.get("dateReception"));
    document.getElementById("googleMaps").href = params.get("googleMaps");

    // 🚀 Gestion des boutons
    function updateGoogleSheet(action, data = {}) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        let queryParams = new URLSearchParams({ action, row: params.get("row") });

        Object.keys(data).forEach(key => {
            queryParams.append(key, data[key]);
        });

        console.log(`🔍 Envoi de l'action '${action}' à Google Apps Script avec les données :`, queryParams.toString());

        fetch(`https://script.google.com/macros/s/AKfycby6aqw4oDxwUwHoc6JyDmKk6UoNwtQvLMKJu-wmWSzp7wI6emnL-yJycPWBH6AvJv5O-Q/exec?` + queryParams.toString())
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur :", result);
                alert("✅ Action enregistrée avec succès !");
            })
            .catch(error => {
                console.error("❌ Erreur d'envoi :", error);
                alert("❌ Erreur lors de l'enregistrement !");
            });
    }

    // 📌 Bouton "C'est noté"
    const priseChargeBtn = document.getElementById("priseChargeBtn");
    if (priseChargeBtn) {
        priseChargeBtn.addEventListener("click", () => {
            console.log("✅ Bouton 'C'est noté' cliqué !");
            updateGoogleSheet("confirm");
        });
    } else {
        console.error("❌ Bouton 'C'est noté' introuvable !");
    }

    // 📌 Bouton "Modifier"
    const modifierBtn = document.getElementById("modifierBtn");
    if (modifierBtn) {
        modifierBtn.addEventListener("click", () => {
            console.log("📝 Bouton 'Modifier' cliqué !");
            let newData = {};
            editableFields.forEach(id => {
                let input = document.getElementById(id);
                if (input) newData[id] = input.value;
            });

            updateGoogleSheet("update", newData);
        });
    } else {
        console.error("❌ Bouton 'Modifier' introuvable !");
    }

    // 📌 Bouton "Prendre un rendez-vous"
    const rendezVousBtn = document.getElementById("rendezVousBtn");
    if (rendezVousBtn) {
        rendezVousBtn.addEventListener("click", () => {
            console.log("📅 Bouton 'Prendre un rendez-vous' cliqué !");
            updateGoogleSheet("rendezVous");
        });
    } else {
        console.error("❌ Bouton 'Prendre un rendez-vous' introuvable !");
    }
});
