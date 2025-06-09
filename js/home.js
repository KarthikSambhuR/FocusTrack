document.addEventListener('DOMContentLoaded', function() {
    const quotes = [
        "The secret to getting ahead is getting started.",
        "Don't watch the clock; do what it does. Keep going.",
        "The expert in anything was once a beginner.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "Believe you can and you're halfway there."
    ];

    const quoteElement = document.getElementById('motivational-quote');
    if (quoteElement) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.innerHTML = `"${quotes[randomIndex]}"`;
    }
});