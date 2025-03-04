document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const telephone = params.get("telephone");

    function setInputValue(id, value) {
        const inputElement = document.getElementById(id);
        if (inputElement) {
            inputElement.value = value || "";
        }
    }

    // 📝 **Pré-remplissage des champs du lead avec les données de l'URL**
    <p><strong>Nom :</strong> <span id="nom"></span></p>
    <p><strong>Prénom :</strong> <span id="prenom"></span></p>
    <p><strong>Email :</strong> <span id="email"></span></p>
    <p><strong>Téléphone :</strong> <span id="telephone"></span></p>
    <p><strong>Adresse :</strong> <span id="adresse"></span></p>
    <p><strong>Code Postal :</strong> <span id="codePostal"></span></p>
    <p><strong>Ville :</strong> <span id="ville"></span></p>
    <p><strong>Type de Bien :</strong> <span id="typeBien"></span></p>
    <p><strong>Surface :</strong> <span id="surface"></span> m²</p>
    <p><strong>Nombre de pièces :</strong> <span id="nbPieces"></span></p>
    <p><strong>Prix de vente estimé :</strong> <span id="prix"></span> €</p>
    <p><strong>Date de réception :</strong> <span id="dateReception"></span></p>
    <p><strong>Google Street View :</strong> <a id="googleStreetView" href="#" target="_blank">Voir sur Google Maps</a></p>

    <p><strong>Statut RDV :</strong> <span id="statutRDV"></span></p>
    <p><strong>RDV :</strong> <span id="rdv"></span></p>
    


    // 📍 **Lien Google Maps**
    const googleMapsLink = document.getElementById("googleMaps");
    if (googleMapsLink && params.get("googleStreetView")) {
        googleMapsLink.href = params.get("googleStreetView");
    }

    // 📞 **Gérer l'affichage du bouton "Appeler"**
    if (telephone) {
        document.getElementById("appelerBtn").style.display = "block";
    } else {
        document.getElementById("appelerBtn").style.display = "none";
    }

    // 🛠️ **Fonction pour mettre à jour Google Sheets**
    function updateGoogleSheet(action, callback = null) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        let url = `https://script.google.com/macros/s/AKfycbx8jhzit3sZ1paGd6XsYCasKn_629u258n9fO5PNP6FmjXfFC6WvUGuvT_2RRQZ93IVxA/exec?action=${action}&row=${params.get("row")}`;
        console.log("📡 URL envoyée : " + url);

        fetch(url)
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur : " + result);
                alert(result);
                if (callback) callback(); // Exécute la suite après mise à jour (ex: appel mobile)
            })
            .catch(error => console.error("❌ Erreur : " + error));
    }

    // 📞 **Bouton "Appeler" (différent sur PC et mobile)**
    document.getElementById("appelerBtn")?.addEventListener("click", function() {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            // 📱 Mobile : Enregistrer d'abord dans Google Sheets puis appeler
            updateGoogleSheet("appel", function() {
                setTimeout(() => {
                    window.location.href = "tel:" + telephone;
                }, 1000); // ⏳ Petit délai pour laisser Google Sheets s'enregistrer
            });
        } else {
            // 🖥️ PC : Afficher une popup avec le numéro
            alert("📞 Numéro du lead : " + telephone);
            updateGoogleSheet("appel");
        }
    });

    // ✅ **Boutons d'action sur le lead**
    document.getElementById("priseChargeBtn")?.addEventListener("click", () => updateGoogleSheet("confirm"));
    document.getElementById("modifierBtn")?.addEventListener("click", () => updateGoogleSheet("update"));
    document.getElementById("rendezVousBtn")?.addEventListener("click", () => updateGoogleSheet("rendezvous"));
});
