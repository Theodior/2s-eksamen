window.addEventListener("load", start);

let produkter = [];
const url = "https://theodior.dk/kea/The_Leftovers/wordpress/wp-json/wp/v2/leftovers?per_page=100";
let filter = "Alle";

// const liste = document.querySelector(".liste");

function start() {

    hentJson();
    addEventListenersToButtons();
    sidenVises();
    hentFooter();
    setTimeout(showPage, 2000)
}

//Loading på index.html
function showPage() {
    document.querySelector("#bunny_container").style.display = "none";
    document.querySelector("#body_container").style.display = "block";
}

/*Henter footer fra DRY*/
async function hentFooter() {
    const response = await fetch("inc/footer.html");
    const inclusion = await response.text();
    document.querySelector("footer").innerHTML = inclusion;
}

/*burger menu*/

function sidenVises() {
    console.log("sidenVises");
    document.querySelector("#menuknap").addEventListener("click", toggleMenu);
}

function toggleMenu() {
    console.log("toggleMenu");
    document.querySelector("#menu").classList.toggle("hidden");

    let erSkjult = document.querySelector("#menu").classList.contains("hidden");
    if (erSkjult == true) {
        document.querySelector("#menuknap").textContent = "☰";
    } else {
        document.querySelector("#menuknap").textContent = "X";
    }
}

/*Henter array fra Json, via REST-API og kalder derefter function vis*/

async function hentJson() {
    const response = await fetch(url);
    produkter = await response.json();
    vis();
}

/*Vis tager udgangspunkt i template, hvortil den kloner de forskellig elementer ind i dem. Disse elementer kommer fra Rest-api via. Wordpress som backend. Filter bliver også tilføjet*/
function vis() {
    const skabelon = document.querySelector("template");
    const liste = document.querySelector(".liste");
    if (liste) {
        liste.innerHTML = "";

        produkter.forEach((produkt) => {
            if (filter == "Alle" || filter == produkt.kategori) {
                const klon = skabelon.cloneNode(true).content;
                klon.querySelector(".title").textContent = produkt.navn;

                klon.querySelector("img").src = produkt.billede.guid;
                klon.querySelector("img").alt = "billede af" + produkt.title.rendered;

                liste.appendChild(klon);
                liste.lastElementChild.addEventListener("click", () => {
                    location.href = `produkt.html?navn=${produkt.navn}`
                });
            }
        })
    }
}

/*Vis single fortæller hvilke elementer som skal komme på produkt.html*/
function visSingle(toej) {
    document.querySelector("#single").style.display = "block";
    document.querySelector("#single .luk").addEventListener("click", lukSingle);
    document.querySelector(".beskrivelse h2").textContent = toej.navn;
    document.querySelector(".beskrivelse .billede").src = toej.billede.guid;
    document.querySelector(".beskrivelse .billede").alt = "billede af" + toej.navn;
    document.querySelector(".beskrivelse .pris").textContent = toej.lang;
}

function lukSingle() {
    document.querySelector("#single").style.display = "none";
}


/*Adder click til filter knapper*/
function addEventListenersToButtons() {
    document.querySelectorAll(".filter").forEach(elm => {
        elm.addEventListener("click", filtrering);
    })
}

/*Skifter filter på valgt og fortæller i h2, hvilket filter man er på*/
function filtrering() {
    filter = this.dataset.kategori;
    document.querySelector("h2").textContent = this.textContent;
    document.querySelectorAll(".cykel_filter").forEach(elm => {
        elm.classList.remove("valgt");
    })
    this.classList.add("valgt");
    vis();
}
