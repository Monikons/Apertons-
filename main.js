// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

// Админ-панель и форма
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    async function loadSubmissions() {
        try {
            const response = await fetch('http://localhost:5000/submissions');
            const data = await response.json();

            let html = '<h3>Полученные заявки</h3><table border="1"><tr><th>Имя</th><th>Email</th><th>Сообщение</th><th>Дата</th></tr>';
            data.forEach(item => {
                html += `<tr>
                    <td>${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.message}</td>
                    <td>${item.timestamp}</td>
                </tr>`;
            });
            html += '</table>';

            document.getElementById('submissions-table').innerHTML = html;
        } catch (error) {
            console.error('Ошибка при загрузке заявок:', error);
        }
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            try {
                const response = await fetch('http://localhost:5000/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const result = await response.json();

                if (result.status === 'success') {
                    alert('Спасибо! Ваша заявка сохранена.');
                    form.reset();
                    if (document.getElementById('admin-panel').style.display === 'block') {
                        loadSubmissions();
                    }
                } else {
                    alert('Ошибка: ' + result.message);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка соединения. Проверьте консоль.');
            }
        });
    }

    // Активация админ-панели
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            if (!document.getElementById('admin-button')) {
                const btn = document.createElement('button');
                btn.textContent = 'Админ-панель';
                btn.className = 'btn-secondary';
                btn.id = 'admin-button';
                btn.style.marginTop = '30px';
                btn.onclick = function() {
                    const password = prompt("Введите пароль администратора:");
                    if (password === "1234") {
                        document.getElementById("admin-panel").style.display = "block";
                        loadSubmissions();
                    } else {
                        alert("Неверный пароль");
                    }
                };

                const contactsSection = document.querySelector('#contacts .container');
                contactsSection.appendChild(btn);
            }
        }
    });
});

// Ресайз окна
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        if (mobileMenu) mobileMenu.classList.remove('active');
    }
});