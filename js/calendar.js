document.addEventListener('DOMContentLoaded', () => {
    const calendarContainer = document.getElementById('calendar-container');
    const modal = document.getElementById('event-modal');
    const modalBody = document.getElementById('modal-body');
    const modalCloseBtn = modal.querySelector('.modal-close');

    if (!calendarContainer) return;

    let date = new Date();
    let currentYear = date.getFullYear();
    let currentMonth = date.getMonth();

    let events = JSON.parse(localStorage.getItem('calendarEvents')) || {};

    const saveEvents = () => {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    };

    const renderCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const monthName = firstDay.toLocaleString('default', { month: 'long' });
        
        calendarContainer.innerHTML = '';

        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.innerHTML = `
            <div id="calendar-nav">
                <button id="prev-month"><i class='bx bx-chevron-left'></i></button>
            </div>
            <div id="month-year">${monthName} ${currentYear}</div>
            <div id="calendar-nav">
                <button id="next-month"><i class='bx bx-chevron-right'></i></button>
            </div>
        `;
        calendarContainer.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';
        
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            grid.innerHTML += `<div class="calendar-day-header">${day}</div>`;
        });

        for (let i = startDayOfWeek; i > 0; i--) {
            grid.innerHTML += `<div class="calendar-day other-month">${lastDayOfLastMonth.getDate() - i + 1}</div>`;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString();
            grid.innerHTML += `
                <div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}">
                    <span class="day-number">${day}</span>
                    ${(events[dateStr] && events[dateStr].length > 0) ? '<div class="event-dot"></div>' : ''}
                </div>`;
        }
        calendarContainer.appendChild(grid);

        document.getElementById('prev-month').onclick = () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); };
        document.getElementById('next-month').onclick = () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); };

        document.querySelectorAll('.calendar-day:not(.other-month)').forEach(dayCell => {
            dayCell.onclick = () => showModal(dayCell.dataset.date);
        });
    };

    const showModal = (dateStr) => {
        const dayEvents = events[dateStr] || [];
        const eventListHTML = dayEvents.length > 0
            ? dayEvents.map((event, index) => `
                <div class="event-item" data-index="${index}">
                    <span>${event.text}</span>
                    <button class="delete-event-btn"><i class='bx bx-trash'></i></button>
                </div>`).join('')
            : '<p>No events for this day.</p>';

        modalBody.innerHTML = `
            <h3>Events for ${new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h3>
            <div id="event-list">${eventListHTML}</div>
            <form id="event-form" style="margin-top: 20px;">
                <input type="text" id="event-input" placeholder="Add new event..." required autocomplete="off">
                <button type="submit" class="btn" style="width: 100%;">Add Event</button>
            </form>
        `;
        modal.classList.add('active');

        document.getElementById('event-form').onsubmit = (e) => {
            e.preventDefault();
            const input = document.getElementById('event-input');
            const text = input.value.trim();
            if (text) {
                if (!events[dateStr]) events[dateStr] = [];
                events[dateStr].push({ text });
                saveEvents();
                renderCalendar();
                showModal(dateStr); // Refresh modal to show newly added event
            }
        };

        modalBody.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.onclick = () => {
                const eventItem = btn.closest('.event-item');
                const index = parseInt(eventItem.dataset.index);
                events[dateStr].splice(index, 1);
                if (events[dateStr].length === 0) {
                    delete events[dateStr];
                }
                saveEvents();
                renderCalendar();
                showModal(dateStr); // Refresh modal to show updated list
            };
        });
    };

    const closeModal = () => modal.classList.remove('active');
    modalCloseBtn.onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };

    renderCalendar();
});