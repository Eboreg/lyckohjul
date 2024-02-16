export class Wheel {
    readonly wheel: HTMLElement;
    readonly spinButton: HTMLButtonElement;
    readonly mao: Element | null;
    readonly spinnnnAudio = new Audio("assets/SPINNNNN.wav");
    readonly wheelAudio = new Audio("assets/wheel.wav");
    readonly id: string;
    readonly navButtons: Element;
    readonly name: string;
    readonly sliceColors: string[];
    readonly footnotes: Element;
    readonly overlay: HTMLElement;
    readonly slices: HTMLElement[] = [];
    readonly errors: Element;

    currentRotation: number = 0;
    currentTopSlice?: HTMLElement;

    constructor(id: string, name: string, slices: string[]) {
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

        if (slices.length % 2 == 0 && slices.length > 4) this.sliceColors = ["red", "blue"];
        else if ((slices.length - 1) % 3 != 0 && slices.length > 5)
            this.sliceColors = ["red", "blue", "darkgreen"];
        else if ((slices.length - 1) % 4 != 0)
            this.sliceColors = ["red", "blue", "darkgreen", "darkmagenta"];
        else this.sliceColors = ["red", "blue", "darkred", "darkgreen", "darkmagenta"];

        this.name = name;
        this.wheel = container.querySelector(".wheel") as HTMLElement;
        this.spinButton = container.querySelector(".spin-button") as HTMLButtonElement;
        this.mao = container.querySelector(".mao");
        this.navButtons = container.querySelector(".nav-buttons") as Element;
        this.footnotes = container.querySelector(".footnotes") as Element;
        this.id = id;
        this.spinButton.addEventListener("click", () => { this.spin() });
        this.overlay = container.querySelector(".container-overlay") as HTMLElement;
        this.errors = container.querySelector(".errors") as Element;

        if (slices.length < 5) {
            this.addError("We need at least 5 slices at the moment.");
        } else {
            for (let i = 0; i < slices.length; i++) {
                this.addSlice(slices[i], i, slices.length);
            }
            this.currentTopSlice = this.slices[0];
        }
    }

    addError(text: string) {
        const elem = document.createElement("p");
        elem.textContent = text;
        this.errors.appendChild(elem);
        this.errors.classList.add("show");
    }

    addFootnotes(footnotes: string[]): Wheel {
        for (const footnote of footnotes) {
            const elem = document.createElement("p");
            elem.textContent = footnote;
            this.footnotes.appendChild(elem);
        }
        return this;
    }

    addNavButtons(buttons: HTMLButtonElement[]): Wheel {
        for (const button of buttons.map((b) => b.cloneNode(true) as HTMLButtonElement)) {
            const wheelId = button.dataset.wheel!;

            if (wheelId == this.id) button.classList.add("active");
            else button.addEventListener("click", () => { location.hash = `#${wheelId}` });
            this.navButtons.appendChild(button);
        }
        return this;
    }

    getNavButton(): HTMLButtonElement {
        const button = document.createElement("button");

        button.dataset.wheel = this.id;
        button.textContent = this.name;
        return button;
    }

    addSlice(text: string, index: number, totalSliceCount: number): Wheel {
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
        let p4: number[];

        if (a > radius) {
            const a2 = a - radius;
            const b2 = a2 * Math.tan(this.radians(B));
            const b2percent = (b2 / diameter) * 100;
            p4 = [0, b2percent];
        } else {
            const apercent = (50 * (radius - a)) / radius;
            p4 = [apercent, 0];
        }

        slice.className = "slice";
        slice.style.clipPath = `polygon(0% 0%, 50% 0%, 50% 50%, ${p4[0]}% ${p4[1]}%)`;
        slice.style.transform = `rotate(${rotation}turn)`;
        slice.style.backgroundColor = this.sliceColors[index % this.sliceColors.length];

        label.className = "slice-label";
        if (totalSliceCount > 30) label.classList.add("small");
        label.style.transform = `rotate(${textAngle}deg)`;
        label.style.left = `${textLeft}px`;
        label.style.width = `${innerLength}px`;

        labelText.textContent = text;

        label.appendChild(labelText);
        slice.appendChild(label);
        this.wheel.appendChild(slice);
        this.slices.push(slice);

        return this;
    }

    getNextRotation(): number {
        // Make sure it doesn't stop too close to a slice border.
        const turnsPerSlice = 1 / this.slices.length;
        let rotation: number;
        let turnsFromSliceStart: number;
        let turnsFromSliceEnd: number;

        do {
            rotation = (Math.random() * 10) + 7;
            turnsFromSliceStart = (rotation + this.currentRotation) % turnsPerSlice;
            turnsFromSliceEnd = turnsPerSlice - turnsFromSliceStart;
        } while (turnsFromSliceStart < 0.002 || turnsFromSliceEnd < 0.002);

        return rotation + this.currentRotation;
    }

    spin() {
        const turnsPerSlice = 1 / this.slices.length;
        const rotation = this.getNextRotation();
        const nextTopSliceIdx =
            (this.slices.length - Math.floor((rotation / turnsPerSlice) % this.slices.length)) % this.slices.length;
        const duration = 13000;
        const keyframes = [
            { transform: `rotate(${this.currentRotation}turn)`, easing: "cubic-bezier(0.1, 0.2, 0.2, 1.02)" },
            { transform: `rotate(${rotation}turn)` },
        ];

        this.currentTopSlice?.classList.remove("top");
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
        if (this.mao != null) this.mao.animate(keyframes, { duration: duration + 2000, fill: "both" });
    }

    radians(degrees: number): number {
        return (degrees * Math.PI) / 180;
    }
}
