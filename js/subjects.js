document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('subjects-container');
    if (!container) return;

    fetch('data/subjects.json')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                container.innerHTML = '<p>No subjects found.</p>';
                return;
            }
            container.innerHTML = '';
            data.forEach(subject => {
                const card = document.createElement('div');
                card.className = 'card subject-card';
                card.innerHTML = `
                    <div>
                        <h3>${subject.name}</h3>
                        <p class="code">${subject.code}</p>
                    </div>
                    <div class="grade">${subject.grade}%</div>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error fetching subjects:', error);
            container.innerHTML = '<p>Could not load subject data.</p>';
        });
});