document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loader").classList.add("fade-out");
    setTimeout(fadeIn, 750);
    setTimeout(cta, 750);
});

function fadeIn() {
    document.getElementById("main-view").classList.replace("d-none", "d-block");
    document.getElementById("main-view").classList.add("fade-in");
}

window.onscroll = () => {
    if (window.scrollY > 50) {
        document.getElementById("cta").classList.replace("fade-in", "fade-out");
    } else {
        document.getElementById("cta").classList.replace("fade-out", "fade-in");
    }
};

export function cta() {
    console.log("CTA");
    if (
        document.body.offsetHeight - window.innerHeight > 300 &&
        window.scrollY < 50
    ) {
        document.getElementById("cta").classList.replace("d-none", "d-block");
        document.getElementById("cta").classList.replace("fade-out", "fade-in");
    } else {
        document.getElementById("cta").classList.replace("d-block", "d-none");
        document.getElementById("cta").classList.replace("fade-in", "fade-out");
    }
}
