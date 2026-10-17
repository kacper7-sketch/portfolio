
document.addEventListener("DOMContentLoaded", () => {
    const elementy = document.querySelectorAll(
        ".hero-content, .hero-decoration, " +
        ".section h2, .section-label, " +
        ".about-text, .skills, .project-card, " +
        ".contact .btn"
    );

    const ograniczRuch = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (ograniczRuch || !("IntersectionObserver" in window)) {
        return;
    }

    const obserwator = new IntersectionObserver((wpisy) => {
        wpisy.forEach((wpis) => {
            if (wpis.isIntersecting) {
                wpis.target.classList.add("widoczny");
                obserwator.unobserve(wpis.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementy.forEach((element) => {
        element.classList.add("animacja");
        obserwator.observe(element);
    });
});

const formularz = document.querySelector("#formularz-kontaktowy");
const statusFormularza = document.querySelector("#status-formularza");

if (formularz && statusFormularza) {
    formularz.addEventListener("submit", async (event) => {
        event.preventDefault();

        const przycisk = formularz.querySelector("button[type='submit']");

        przycisk.disabled = true;
        statusFormularza.textContent = "Wysyłanie wiadomości...";

        try {
            const odpowiedz = await fetch(formularz.action, {
                method: "POST",
                body: new FormData(formularz),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!odpowiedz.ok) {
                throw new Error("Błąd wysyłania");
            }

            statusFormularza.textContent =
                "✅ Wiadomość została wysłana!";

            formularz.reset();
        } catch (blad) {
            statusFormularza.textContent =
                "❌ Nie udało się wysłać wiadomości. Spróbuj ponownie.";
        } finally {
            przycisk.disabled = false;
        }
    });
}
