window.onscroll = () => {
    if (window.scrollY > 50) {
        document.getElementById("cta").classList.replace("fade-in", "fade-out");
    } else {
        document.getElementById("cta").classList.replace("fade-out", "fade-in");
    }
};

export function cta() {
    if (document.body.offsetHeight - window.innerHeight > 200) {
        document.getElementById("cta").classList.replace("d-none", "d-block");
        document.getElementById("cta").classList.replace("fade-out", "fade-in");
    } else {
        document.getElementById("cta").classList.replace("d-block", "d-none");
        document.getElementById("cta").classList.replace("fade-in", "fade-out");
    }
}
