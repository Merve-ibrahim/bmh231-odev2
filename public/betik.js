let etkinlikler = [];

const liste = document.getElementById("etkinlikListesi");
const arama = document.getElementById("arama");
const dugmeler = document.querySelectorAll(".filtreler button");
const durumMesaji = document.getElementById("durumMesaji");

const turAdlari = {
    atolye: "Atölye",
    soylesi: "Söyleşi",
    topluluk: "Topluluk"
};

let secilenTur = "tumu";

// Etkinlik kartlarını oluşturur.
function kartlariGoster(veriler) {
    liste.replaceChildren();

    veriler.forEach(function (etkinlik) {
        const kart = document.createElement("article");
        kart.className = "kart";

        const baslik = document.createElement("h2");
        baslik.textContent = etkinlik.baslik;

        const tarih = document.createElement("p");
        tarih.textContent = "Tarih: " +
            new Date(etkinlik.tarih + "T00:00:00")
                .toLocaleDateString("tr-TR");

        const yer = document.createElement("p");
        yer.textContent = "Yer: " + etkinlik.yer;

        const kontenjan = document.createElement("p");
        kontenjan.textContent = "Kontenjan: " + etkinlik.kontenjan;

        const etiket = document.createElement("span");
        etiket.className = "etiket";
        etiket.textContent = turAdlari[etkinlik.tur];

        kart.append(baslik, tarih, yer, kontenjan, etiket);
        liste.append(kart);
    });
}

// Tür filtresini ve aramayı birlikte uygular.
function filtreleVeGoster() {
    const aranan = arama.value.trim().toLocaleLowerCase("tr-TR");

    const sonuclar = etkinlikler.filter(function (etkinlik) {
        const turUygun =
            secilenTur === "tumu" || etkinlik.tur === secilenTur;

        const baslikUygun = etkinlik.baslik
            .toLocaleLowerCase("tr-TR")
            .includes(aranan);

        return turUygun && baslikUygun;
    });

    kartlariGoster(sonuclar);

    durumMesaji.textContent = sonuclar.length === 0
        ? "Aramanıza uygun etkinlik yok."
        : "";
}

// Arama kutusuna yazıldığında sonuçları günceller.
arama.addEventListener("input", filtreleVeGoster);

// Tür düğmelerine tıklandığında filtreyi değiştirir.
dugmeler.forEach(function (dugme) {
    dugme.addEventListener("click", function () {
        secilenTur = dugme.dataset.tur;

        dugmeler.forEach(function (buton) {
            const secili = buton === dugme;

            buton.classList.toggle("secili", secili);
            buton.setAttribute("aria-pressed", String(secili));
        });

        filtreleVeGoster();
    });
});

// Öneri formunun alanları.
const form = document.getElementById("oneriFormu");
const adAlani = document.getElementById("etkinlikAdi");
const tarihAlani = document.getElementById("etkinlikTarihi");
const epostaAlani = document.getElementById("eposta");
const formMesaji = document.getElementById("formMesaji");

// Form gönderildiğinde bilgileri kontrol eder.
form.addEventListener("submit", function (olay) {
    olay.preventDefault();

    const hatalar = [];

    if (adAlani.value.trim().length < 5) {
        hatalar.push("Etkinlik adı en az 5 karakter olmalıdır.");
    }

    const bugun = new Date();
    bugun.setHours(0, 0, 0, 0);

    const secilenTarih =
        new Date(tarihAlani.value + "T00:00:00");

    if (!tarihAlani.value || isNaN(secilenTarih.getTime())) {
        hatalar.push("Geçerli bir tarih seçiniz.");
    } else if (secilenTarih < bugun) {
        hatalar.push("Tarih geçmiş bir gün olamaz.");
    }

    if (!epostaAlani.value.trim() || !epostaAlani.validity.valid) {
        hatalar.push("Geçerli bir e-posta adresi giriniz.");
    }

    if (hatalar.length > 0) {
        formMesaji.className = "hata";
        formMesaji.textContent = hatalar.join(" ");
    } else {
        formMesaji.className = "basari";
        formMesaji.textContent =
            "Teşekkürler! Etkinlik öneriniz doğrulamadan geçti.";

        form.reset();
    }
});

// Etkinlikleri API'den alır.
async function etkinlikleriGetir() {
    durumMesaji.textContent = "Yükleniyor...";

    arama.disabled = true;

    dugmeler.forEach(function (dugme) {
        dugme.disabled = true;
    });

    try {
        const response = await fetch("/api/etkinlikler");

        if (!response.ok) {
            throw new Error("HTTP hatası: " + response.status);
        }

        etkinlikler = await response.json();

        filtreleVeGoster();

        arama.disabled = false;

        dugmeler.forEach(function (dugme) {
            dugme.disabled = false;
        });
    } catch (hata) {
        liste.replaceChildren();

        durumMesaji.textContent =
            "Etkinlikler yüklenemedi. Lütfen daha sonra tekrar deneyiniz.";
    }
}

etkinlikleriGetir();