document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const leadInfoDiv = document.getElementById("leadInfo");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    let modifiedFields = {}; // Stocker les champs modifiés

    // ✅ **Création dynamique des champs**
    function createLeadInfoField(label, paramKey) {
        let value = params.get(paramKey) || "";
        let container = document.createElement("p");

        if (value === "") {
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = `Entrez ${label.toLowerCase()}`;
            input.dataset.key = paramKey;
            input.addEventListener("input", function () {
                modifiedFields[paramKey] = input.value;
                saveChangesBtn.style.display = "block";
            });
            container.appendChild(input);
        } else {
            container.textContent = `📌 ${label}: ${value}`;
        }

        leadInfoDiv.appendChild(container);
    }

    // ✅ **Liste des informations affichées**
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
        { label: "Date de réception", key: "dateReception" },
        { label: "Statut RDV", key: "statutRDV" },
        { label: "RDV", key: "rdv" },
    ];

    fields.forEach(field => createLeadInfoField(field.label, field.key));

    // ✅ **Mise à jour Google Sheets**
    function updateGoogleSheet(action, additionalParams = {}) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        let url = `https://script.google.com/macros/s/AKfycbx8jhzit3sZ1paGd6XsYCasKn_629u258n9fO5PNP6FmjXfFC6WvUGuvT_2RRQZ93IVxA/exec?action=${action}&row=${params.get("row")}`;

        Object.entries(additionalParams).forEach(([key, value]) => {
            url += `&${key}=${encodeURIComponent(value)}`;
        });

        fetch(url)
            .then(response => response.text())
            .then(result => {
                alert(result);
                location.reload(); // Recharger la page après mise à jour
            })
            .catch(error => console.error("❌ Erreur :", error));
    }

    // 📞 **Bouton "Appeler"**
    document.getElementById("appelerBtn")?.addEventListener("click", function() {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            updateGoogleSheet("appel", {}, () => {
                setTimeout(() => {
                    window.location.href = "tel:" + params.get("telephone");
                }, 1000);
            });
        } else {
            alert("📞 Numéro du lead : " + params.get("telephone"));
            updateGoogleSheet("appel");
        }
    });

    // ✅ **Boutons d'action**
    document.getElementById("priseChargeBtn")?.addEventListener("click", () => updateGoogleSheet("confirm"));
    document.getElementById("rendezVousBtn")?.addEventListener("click", () => updateGoogleSheet("rendezvous"));

    // ✅ **Enregistrement des modifications**
    saveChangesBtn.addEventListener("click", function () {
        if (Object.keys(modifiedFields).length === 0) return;
        updateGoogleSheet("update", modifiedFields);
    });
});
