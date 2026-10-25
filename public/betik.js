const etkinlikler = [
    {
        id: 1,
        baslik: "Web Programlama Atölyesi",
        tur: "atolye",
        tarih: "2026-11-10",
        yer: "Bilgisayar Laboratuvarı",
        kontenjan: 30
    },
    {
        id: 2,
        baslik: "Git ve GitHub Atölyesi",
        tur: "atolye",
        tarih: "2026-11-12",
        yer: "Bilgisayar Laboratuvarı",
        kontenjan: 25
    },
    {
        id: 3,
        baslik: "Yapay Zekâ Söyleşisi",
        tur: "soylesi",
        tarih: "2026-11-16",
        yer: "Konferans Salonu",
        kontenjan: 200
    },
    {
        id: 4,
        baslik: "Yazılımda Kariyer Söyleşisi",
        tur: "soylesi",
        tarih: "2026-11-18",
        yer: "Mühendislik Fakültesi",
        kontenjan: 120
    },
    {
        id: 5,
        baslik: "Yazılım Topluluğu Tanışma Toplantısı",
        tur: "topluluk",
        tarih: "2026-11-20",
        yer: "Öğrenci Merkezi",
        kontenjan: 60
    },
    {
        id: 6,
        baslik: "Kitap Topluluğu Buluşması",
        tur: "topluluk",
        tarih: "2026-11-23",
        yer: "Kütüphane",
        kontenjan: 40
    }
];

const liste = document.getElementById("etkinlikListesi");

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

        const turAdlari = {
            atolye: "Atölye",
            soylesi: "Söyleşi",
            topluluk: "Topluluk"
        };

        const etiket = document.createElement("span");
        etiket.className = "etiket";
        etiket.textContent = turAdlari[etkinlik.tur];

        kart.append(baslik, tarih, yer, kontenjan, etiket);
        liste.append(kart);
    });
}

kartlariGoster(etkinlikler);