import { Wheel } from "./wheel";

function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

window.onload = () => {
    const url = new URL(location.href);

    if (url.hash) {
        url.hash = "";
        location.href = url.href;
    }

    const wheels: Wheel[] = [];
    const geografi = [
        "Svealand",
        "Norrland",
        "Götaland",
        "Norge/Danmark/Island",
        "Finland/Baltikum",
        "Tyskland/Österrike/Schweiz",
        "Frankrike & Benelux",
        "England",
        "Irland/Skottland/Wales",
        "Spanien/Portugal/Italien",
        "Balkan",
        "Turkiet",
        "Polen/Tjeckien/Slovakien",
        "Ungern/Rumänien/Bulgarien",
        "Ryssland/Ukraina/Vitryssland",
        "Iran/Kaukasus",
        "Arabvärlden & Israel",
        "Centralasien (2) & Mongoliet",
        "Indiska subkontinenten (1)",
        "Kina",
        "Sydostasien",
        "Japan/Korea",
        "Indonesien/Filippinerna",
        "Oceanien",
        "Kanada",
        "USA: Västkust",
        "USA: Mellanvästern",
        "USA: Södern",
        "USA: Östkust",
        "Centralamerika/Mexiko",
        "Karibien",
        "Sydamerika",
        "Nordafrika",
        "Västafrika",
        "Södra Afrika",
        "Östafrika",
    ];
    const tider = [
        "1945 - 1949",
        "1950 - 1954",
        "1955 - 1959",
        "1960 - 1964",
        "1965 - 1969",
        "1970 - 1974",
        "1975 - 1979",
        "1980 - 1984",
        "1985 - 1989",
        "1990 - 1994",
        "1995 - 1999",
        "2000 - 2004",
        "2005 - 2009",
        "2010 - 2014",
        "2015 - 2019",
        "2020 - 2024",
    ];

    shuffleArray(geografi);
    shuffleArray(tider);

    wheels.push(
        new Wheel("geografi", "Geografi", geografi)
            .addFootnotes([
                "(1) Indien, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka",
                "(2) Afghanistan, Turkmenistan, Uzbekistan, Tadzjikistan, Kirgizistan, Kazakstan",
            ]),
        new Wheel("tid", "Tid", tider),
    );

    const navButtons = wheels.map((wheel) => wheel.getNavButton());

    wheels.forEach((wheel) => { wheel.addNavButtons(navButtons) });
};
