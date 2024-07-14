/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/wheel.ts":
/*!**********************!*\
  !*** ./src/wheel.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Wheel = void 0;
class Wheel {
    constructor(id, name, slices) {
        this.spinnnnAudio = new Audio("assets/SPINNNNN.wav");
        this.wheelAudio = new Audio("assets/wheel.wav");
        this.slices = [];
        this.currentRotation = 0;
        const html = `
        <div class="container-overlay"></div>
        <div class="left-margin">
            <div class="nav-buttons"></div>
            <div class="footnotes"></div>
            <div class="errors"></div>
        </div>
        <div class="arrow-container"><div class="arrow"></div></div>
        <div class="wheel-container">
            <div class="wheel"></div>
            <img src="assets/mao-128px.png" alt="" class="mao">
        </div>
        <button class="spin-button">SPINNNNNNN!</button>`;
        const container = document.createElement("div");
        const anchor = document.createElement("div");
        anchor.id = id;
        container.className = "container";
        container.innerHTML = html;
        document.body.appendChild(anchor);
        document.body.appendChild(container);
        if (slices.length % 2 == 0 && slices.length > 4)
            this.sliceColors = ["red", "blue"];
        else if ((slices.length - 1) % 3 != 0 && slices.length > 5)
            this.sliceColors = ["red", "blue", "darkgreen"];
        else if ((slices.length - 1) % 4 != 0)
            this.sliceColors = ["red", "blue", "darkgreen", "darkmagenta"];
        else
            this.sliceColors = ["red", "blue", "darkred", "darkgreen", "darkmagenta"];
        this.name = name;
        this.wheel = container.querySelector(".wheel");
        this.spinButton = container.querySelector(".spin-button");
        this.mao = container.querySelector(".mao");
        this.navButtons = container.querySelector(".nav-buttons");
        this.footnotes = container.querySelector(".footnotes");
        this.id = id;
        this.spinButton.addEventListener("click", () => { this.spin(); });
        this.overlay = container.querySelector(".container-overlay");
        this.errors = container.querySelector(".errors");
        if (slices.length < 5) {
            this.addError("We need at least 5 slices at the moment.");
        }
        else {
            for (let i = 0; i < slices.length; i++) {
                this.addSlice(slices[i], i, slices.length);
            }
            this.currentTopSlice = this.slices[0];
        }
    }
    addError(text) {
        const elem = document.createElement("p");
        elem.textContent = text;
        this.errors.appendChild(elem);
        this.errors.classList.add("show");
    }
    addFootnotes(footnotes) {
        for (const footnote of footnotes) {
            const elem = document.createElement("p");
            const sup = document.createElement("sup");
            const span = document.createElement("span");
            sup.textContent = footnote.number.toString();
            span.textContent = footnote.text;
            elem.appendChild(sup);
            elem.appendChild(span);
            elem.classList.add("footnote");
            this.footnotes.appendChild(elem);
        }
        return this;
    }
    addNavButtons(buttons) {
        for (const button of buttons.map((b) => b.cloneNode(true))) {
            const wheelId = button.dataset.wheel;
            if (wheelId == this.id)
                button.classList.add("active");
            else
                button.addEventListener("click", () => { location.hash = `#${wheelId}`; });
            this.navButtons.appendChild(button);
        }
        return this;
    }
    getNavButton() {
        const button = document.createElement("button");
        button.dataset.wheel = this.id;
        button.textContent = this.name;
        return button;
    }
    addSlice(text, index, totalSliceCount) {
        const turnsPerSlice = 1 / totalSliceCount;
        const rotation = turnsPerSlice * index;
        const slice = document.createElement("div");
        const label = document.createElement("div");
        const labelText = document.createElement("span");
        const diameter = this.wheel.clientHeight;
        const radius = diameter / 2;
        const A = 360 * turnsPerSlice; // angle closest to the wheel centre
        const B = 180 - 90 - A;
        const b = radius;
        // length of outermost side of this slice if it was a right triangle:
        const a = b * Math.tan(this.radians(A));
        // length of straight line between the slice's two outer edges:
        const innerWidth = 2 * b * Math.sin(this.radians(A / 2));
        // length of straight line from center to previous straight line:
        const innerLength = b * Math.cos(this.radians(A / 2));
        const textAngle = -(90 + A / 2);
        const textLeft = -(innerWidth / 4) - 2;
        let p4;
        if (a > radius) {
            const a2 = a - radius;
            const b2 = a2 * Math.tan(this.radians(B));
            const b2percent = (b2 / diameter) * 100;
            p4 = [0, b2percent];
        }
        else {
            const apercent = (50 * (radius - a)) / radius;
            p4 = [apercent, 0];
        }
        slice.className = "slice";
        slice.style.clipPath = `polygon(0% 0%, 50% 0%, 50% 50%, ${p4[0]}% ${p4[1]}%)`;
        slice.style.transform = `rotate(${rotation}turn)`;
        slice.style.backgroundColor = this.sliceColors[index % this.sliceColors.length];
        label.className = "slice-label";
        if (totalSliceCount > 30)
            label.classList.add("small");
        label.style.transform = `rotate(${textAngle}deg)`;
        label.style.left = `${textLeft}px`;
        label.style.width = `${innerLength}px`;
        labelText.innerHTML = text;
        label.appendChild(labelText);
        slice.appendChild(label);
        this.wheel.appendChild(slice);
        this.slices.push(slice);
        return this;
    }
    getNextRotation() {
        // Make sure it doesn't stop too close to a slice border.
        const turnsPerSlice = 1 / this.slices.length;
        let rotation;
        let turnsFromSliceStart;
        let turnsFromSliceEnd;
        do {
            rotation = (Math.random() * 10) + 7;
            turnsFromSliceStart = (rotation + this.currentRotation) % turnsPerSlice;
            turnsFromSliceEnd = turnsPerSlice - turnsFromSliceStart;
        } while (turnsFromSliceStart < 0.002 || turnsFromSliceEnd < 0.002);
        return rotation + this.currentRotation;
    }
    spin() {
        var _a;
        const turnsPerSlice = 1 / this.slices.length;
        const rotation = this.getNextRotation();
        const nextTopSliceIdx = (this.slices.length - Math.floor((rotation / turnsPerSlice) % this.slices.length)) % this.slices.length;
        const duration = 13000;
        const keyframes = [
            { transform: `rotate(${this.currentRotation}turn)`, easing: "cubic-bezier(0.1, 0.2, 0.2, 1.02)" },
            { transform: `rotate(${rotation}turn)` },
        ];
        (_a = this.currentTopSlice) === null || _a === void 0 ? void 0 : _a.classList.remove("top");
        this.overlay.style.display = "block";
        void this.wheelAudio.play();
        void this.spinnnnAudio.play();
        this.wheel.animate(keyframes, { duration: duration, fill: "both" })
            .onfinish = () => {
            this.overlay.style.display = "none";
            this.currentRotation = rotation;
            this.currentTopSlice = this.slices[nextTopSliceIdx];
            this.currentTopSlice.classList.add("top");
            this.spinnnnAudio.load();
            this.wheelAudio.load();
        };
        if (this.mao != null)
            this.mao.animate(keyframes, { duration: duration + 2000, fill: "both" });
    }
    radians(degrees) {
        return (degrees * Math.PI) / 180;
    }
}
exports.Wheel = Wheel;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const wheel_1 = __webpack_require__(/*! ./wheel */ "./src/wheel.ts");
function shuffleArray(array) {
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
    const wheels = [];
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
        "Balkan<sup>4</sup>",
        "Turkiet",
        "Polen/Tjeckien/Slovakien",
        "Ungern/Rumänien/Bulgarien",
        "Ryssland/Ukraina/Vitryssland",
        "Iran/Kaukasus",
        "Arabvärlden & Israel",
        "Centralasien<sup>2</sup> & Mongoliet",
        "Indiska subkontinenten<sup>1</sup>",
        "Kina/Hongkong/Taiwan",
        "Sydostasien",
        "Japan/Korea",
        "Indonesien/Filippinerna",
        "Oceanien<sup>3</sup>",
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
    wheels.push(new wheel_1.Wheel("geografi", "Geografi", geografi)
        .addFootnotes([
        { number: 1, text: "Indien, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka" },
        { number: 2, text: "Afghanistan, Turkmenistan, Uzbekistan, Tadzjikistan, Kirgizistan, Kazakstan" },
        { number: 3, text: "Inkl. Australien, Nya Zeeland & Hawaii" },
        { number: 4, text: "F.d. Jugoslavien, Grekland, Albanien" },
    ]), new wheel_1.Wheel("tid", "Tid", tider));
    const navButtons = wheels.map((wheel) => wheel.getNavButton());
    wheels.forEach((wheel) => { wheel.addNavButtons(navButtons); });
};

})();

/******/ })()
;
//# sourceMappingURL=index.js.map