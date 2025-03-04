document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);

    function formatTelephone(num) {
        if (!num) return "";
        num = num.replace(/\s+/g, '');
        if (num.length === 9 && /^[1-9][0-9]+$/.test(num)) {
            return "0" + num;
        }
        return num;
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        let dateObj = new Date(dateString);
        if (isNaN(dateObj)) return dateString; // Si invalide, retourne la valeur brute
        return dateObj.toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit" }) +
               " " + dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    }

    function getParamValue(key) {
        for (let [paramKey, paramValue] of params.entries()) {
            if (decodeURIComponent(paramKey).toLowerCase().trim() === key.toLowerCase().trim()) {
                return decodeURIComponent(paramValue);
            }
        }
        return "";
    }

    function setTextContent(id, value, format = null) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = format ? format(value) : value || "";
        }
    }

    // 🚀 **Pré-remplissage des informations du lead**
    setTextContent("nom", getParamValue("nom"));
    setTextContent("prenom", getParamValue("prenom"));
    setTextContent("email", getParamValue("email"));
    setTextContent("telephone", formatTelephone(getParamValue("telephone")));
    setTextContent("adresse", getParamValue("adresse"));
    setTextContent("codePostal", getParamValue("codePostal"));
    setTextContent("ville", getParamValue("ville"));
    setTextContent("TypedeBien", getParamValue("TypedeBien"));
    setTextContent("surface", getParamValue("surface"));
    setTextContent("nbPieces", getParamValue("nbPieces"));
    setTextContent("prix", getParamValue("prix"));
    setTextContent("idEmail", getParamValue("idEmail"));
    setTextContent("agenceEnCharge", getParamValue("agenceEnCharge"));
    setTextContent("agenceAdresse", getParamValue("agenceAdresse"));
    setTextContent("agenceTelephone", getParamValue("agenceTelephone"));
    setTextContent("negociateurAffecte", getParamValue("negociateurAffecte"));
    setTextContent("telephoneCommercial", getParamValue("telephoneCommercial"));
    setTextContent("brevo", getParamValue("brevo"));
    setTextContent("statutRDV", getParamValue("statutRDV"));
    setTextContent("rdv", getParamValue("rdv"), formatDate); // 📅 Format date RDV
    setTextContent("dateReception", getParamValue("dateReception"), formatDate); // 🗓️ Format date Réception
    setTextContent("notification", getParamValue("notification"));

    // 📍 **Lien Google Maps**
    const googleMapsLink = document.getElementById("googleMaps");
    if (googleMapsLink && getParamValue("googleMaps")) {
        googleMapsLink.href = getParamValue("googleMaps");
        googleMapsLink.textContent = "📍 Voir sur Google Maps";
    }

    // 📞 **Gérer l'affichage du bouton "Appeler"**
    const telephone = formatTelephone(getParamValue("telephone"));
    if (telephone) {
        document.getElementById("appelerBtn").style.display = "block";
    } else {
        document.getElementById("appelerBtn").style.display = "none";
    }

    function updateGoogleSheet(action, callback = null) {
        if (!confirm("Êtes-vous sûr de vouloir effectuer cette action ?")) return;

        let url = `https://script.google.com/macros/s/AKfycbx8jhzit3sZ1paGd6XsYCasKn_629u258n9fO5PNP6FmjXfFC6WvUGuvT_2RRQZ93IVxA/exec?action=${action}&row=${params.get("row")}`;
        console.log("📡 URL envoyée : " + url);

        fetch(url)
            .then(response => response.text())
            .then(result => {
                console.log("✅ Réponse du serveur : " + result);
                alert(result);
                if (callback) callback();
            })
            .catch(error => console.error("❌ Erreur : " + error));
    }

    document.getElementById("appelerBtn")?.addEventListener("click", function() {
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            updateGoogleSheet("appel", function() {
                setTimeout(() => {
                    window.location.href = "tel:" + telephone;
                }, 1000);
            });
        } else {
            alert("📞 Numéro du lead : " + telephone);
            updateGoogleSheet("appel");
        }
    });

    document.getElementById("priseChargeBtn")?.addEventListener("click", () => updateGoogleSheet("confirm"));
    document.getElementById("modifierBtn")?.addEventListener("click", () => updateGoogleSheet("update"));
    document.getElementById("rendezVousBtn")?.addEventListener("click", () => updateGoogleSheet("rendezvous"));
});
