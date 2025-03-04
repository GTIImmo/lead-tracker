document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const leadInfoDiv = document.getElementById("leadInfo");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    let modifiedFields = {}; // Stocker les champs modifiés

    function formatTelephone(num) {
        if (!num) return "";
        num = num.replace(/\s+/g, '');
        if (num.length === 9 && /^[1-9][0-9]+$/.test(num)) {
            return "0" + num;
        }
        return num;
    }

    function createLeadInfoField(label, key) {
        let value = params.get(key) || "";
        let container = document.createElement("p");

        if (value === "") {
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = `Entrez ${label.toLowerCase()}`;
            input.dataset.key = key;
            input.addEventListener("input", function () {
                modifiedFields[key] = input.value;
                saveChangesBtn.style.display = "block";
            });
            container.appendChild(input);
        } else {
            container.textContent = `📌 ${label}: ${value}`;
        }

        leadInfoDiv.appendChild(container);
    }

    // ✅ Liste des informations affichées/modifiables
    const fields = [
        { label: "Nom", key: "nom" },
        { label: "Prénom", key: "prenom" },
        { label: "Email", key: "email" },
        { label: "Téléphone", key: "telephone" },
        { label: "Adresse", key: "adresse" },
        { label: "Code Postal", key: "codePostal" },
        { label: "Ville", key: "ville" },
        { label: "Type de bien", key: "typeBien" },
        { label: "Surface", key: "surface" },
        { label: "Nb de pièces", key: "nbPieces" },
        { label: "Prix estimé", key: "prix" },
        { label: "Statut RDV", key: "statutRDV" },
        { label: "RDV", key: "rdv" }
    ];

    fields.forEach(field => createLeadInfoField(field.label, field.key));

    // ✅ Enregistrement des modifications
    saveChangesBtn.addEventListener("click", function () {
        if (Object.keys(modifiedFields).length === 0) return;

        if (!confirm("Voulez-vous enregistrer ces modifications ?")) return;

        let url = `https://script.google.com/macros/s/AKfycbx8jhzit3sZ1paGd6XsYCasKn_629u258n9fO5PNP6FmjXfFC6WvUGuvT_2RRQZ93IVxA/exec?action=update&row=${params.get("row")}`;

        Object.entries(modifiedFields).forEach(([key, value]) => {
            url += `&${key}=${encodeURIComponent(value)}`;
        });

        fetch(url)
            .then(response => response.text())
            .then(result => {
                alert("✅ Modifications enregistrées !");
                location.reload();
            })
            .catch(error => console.error("❌ Erreur :", error));
    });

    // ✅ Boutons d’actions
    document.getElementById("priseChargeBtn").addEventListener("click", () => updateGoogleSheet("confirm"));
    document.getElementById("appelerBtn").addEventListener("click", () => updateGoogleSheet("appel"));
    document.getElementById("rendezVousBtn").addEventListener("click", () => updateGoogleSheet("rendezvous"));

    function updateGoogleSheet(action) {
        let url = `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=${action}&row=${params.get("row")}`;

        fetch(url)
            .then(response => response.text())
            .then(result => {
                alert(result);
            })
            .catch(error => console.error("❌ Erreur :", error));
    }
});
