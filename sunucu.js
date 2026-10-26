const http = require("http");
const fs = require("fs");
const path = require("path");

const publicKlasoru = path.join(__dirname, "public");

const icerikTurleri = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
};

function metinGonder(yanit, durum, metin) {
    yanit.writeHead(durum, {
        "Content-Type": "text/plain; charset=utf-8"
    });
    yanit.end(metin);
}

function jsonGonder(yanit, durum, veri) {
    yanit.writeHead(durum, {
        "Content-Type": "application/json; charset=utf-8"
    });
    yanit.end(JSON.stringify(veri));
}

const sunucu = http.createServer(function (istek, yanit) {
    console.log(istek.method + " " + istek.url);

    if (istek.method !== "GET") {
        yanit.setHeader("Allow", "GET");
        metinGonder(yanit, 405, "Bu yöntem desteklenmiyor.");
        return;
    }

    const adres = new URL(istek.url, "http://localhost:3000");
    const yol = adres.pathname;

    // Etkinlik listesi ve tek etkinlik için API.
    if (
        yol === "/api/etkinlikler" ||
        /^\/api\/etkinlikler\/\d+$/.test(yol)
    ) {
        const veriDosyasi = path.join(__dirname, "etkinlikler.json");

        fs.readFile(veriDosyasi, "utf8", function (hata, icerik) {
            if (hata) {
                jsonGonder(yanit, 500, {
                    hata: "Etkinlik verileri okunamadı."
                });
                return;
            }

            let etkinlikler;

            try {
                etkinlikler = JSON.parse(icerik);
            } catch (hata) {
                jsonGonder(yanit, 500, {
                    hata: "Etkinlik verileri geçersiz."
                });
                return;
            }

            if (yol === "/api/etkinlikler") {
                const tur = adres.searchParams.get("tur");

                if (tur !== null) {
                    etkinlikler = etkinlikler.filter(function (etkinlik) {
                        return etkinlik.tur === tur;
                    });
                }

                jsonGonder(yanit, 200, etkinlikler);
                return;
            }

            const id = Number(yol.split("/")[3]);

            const etkinlik = etkinlikler.find(function (eleman) {
                return eleman.id === id;
            });

            if (etkinlik) {
                jsonGonder(yanit, 200, etkinlik);
            } else {
                jsonGonder(yanit, 404, {
                    hata: "Etkinlik bulunamadı"
                });
            }
        });

        return;
    }

    // Yalnızca public klasöründeki dosyaları sunar.
    let dosyaYolu;

    try {
        const dosyaAdi = yol === "/"
            ? "index.html"
            : decodeURIComponent(yol.slice(1));

        dosyaYolu = path.resolve(publicKlasoru, dosyaAdi);
    } catch (hata) {
        metinGonder(yanit, 404, "Sayfa bulunamadı.");
        return;
    }

    const goreliYol = path.relative(publicKlasoru, dosyaYolu);

    if (
        goreliYol.startsWith("..") ||
        path.isAbsolute(goreliYol)
    ) {
        metinGonder(yanit, 404, "Sayfa bulunamadı.");
        return;
    }

    fs.readFile(dosyaYolu, function (hata, icerik) {
        if (hata) {
            metinGonder(yanit, 404, "Sayfa bulunamadı.");
            return;
        }

        const uzanti = path.extname(dosyaYolu);
        const icerikTuru =
            icerikTurleri[uzanti] || "application/octet-stream";

        yanit.writeHead(200, {
            "Content-Type": icerikTuru
        });

        yanit.end(icerik);
    });
});

sunucu.listen(3000, function () {
    console.log("Sunucu çalışıyor: http://localhost:3000");
});