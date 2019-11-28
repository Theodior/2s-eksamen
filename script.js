window.addEventListener("load", start);

let cykler = [];
const url = "https://theodior.dk/kea/The_Leftovers/wordpress/wp-json/wp/v2/leftovers?per_page=100";
let filter = "Alle";

// const liste = document.querySelector(".liste");

function start() {

    hentJson();
    addEventListenersToButtons();
    sidenVises();
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



async function hentJson() {
    const response = await fetch(url);
    cykler = await response.json();
    console.log(cykler);
    vis();
}


function vis() {
    const skabelon = document.querySelector("template");
    const liste = document.querySelector(".liste");
    if (liste) {
        liste.innerHTML = "";

        cykler.forEach((cykel) => {
            if (filter == "Alle" || filter == cykel.kategori) {
                const klon = skabelon.cloneNode(true).content;
                klon.querySelector(".title").textContent = cykel.navn;

                klon.querySelector("img").src = cykel.billede.guid;
                klon.querySelector("img").alt = "billede af" + cykel.title.rendered;
                klon.querySelector(".beskrivelse").innerHTML = cykel.kort;
                liste.appendChild(klon);
                liste.lastElementChild.addEventListener("click", () => {
                    location.href = `produkt.html?navn=${cykel.navn}`
                });
            }
        })
    }
}

function visSingle(bike) {
    document.querySelector("#single").style.display = "block";
    document.querySelector("#single .luk").addEventListener("click", lukSingle);
    document.querySelector(".beskrivelse h2").textContent = bike.navn;
    document.querySelector(".beskrivelse .billede").src = bike.billede.guid;
    document.querySelector(".beskrivelse .billede").alt = "billede af" + bike.navn;
    document.querySelector(".beskrivelse .pris").textContent = bike.lang;
}

function lukSingle() {
    document.querySelector("#single").style.display = "none";
}



function addEventListenersToButtons() {
    document.querySelectorAll(".filter").forEach(elm => {
        elm.addEventListener("click", filtrering);
    })
}

function filtrering() {
    filter = this.dataset.kategori;
    document.querySelector("h2").textContent = this.textContent;
    document.querySelectorAll(".cykel_filter").forEach(elm => {
        elm.classList.remove("valgt");
    })
    this.classList.add("valgt");
    vis();
}
