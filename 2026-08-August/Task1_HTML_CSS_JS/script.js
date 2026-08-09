const form = document.querySelector('.contact-form');

if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const messageBox = document.getElementById('formMessage');

        if (name === '' || email === '' || message === '') {
            if (messageBox) {
                messageBox.textContent = 'Please fill in all fields before submitting.';
                messageBox.style.color = '#7A316F';
                messageBox.style.background = '#F8EAF2';
            } else {
                alert('Please fill in all fields!!');
            }
        } else {
            if (messageBox) {
                messageBox.textContent = 'Form submitted successfully!';
                messageBox.style.color = '#461959';
                messageBox.style.background = '#AED8CC';
            } else {
                alert('Form submitted successfully!!');
            }

            form.reset();
        }
    });
}

const navToggle = document.querySelector('.nav-toggle');
const navBar = document.querySelector('.nav-bar');

if (navToggle && navBar) {
    navToggle.addEventListener('click', function () {
        const isOpen = navBar.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('[data-category]');

if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const selectedFilter = button.dataset.filter;

            filterButtons.forEach((control) => control.classList.toggle('active', control === button));

            projectCards.forEach((card) => {
                if (selectedFilter === 'all' || card.dataset.category === selectedFilter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.18 });

    document.querySelectorAll('section').forEach((section) => {
        section.classList.add('reveal');
        observer.observe(section);
    });
} else {
    document.querySelectorAll('section').forEach((section) => {
        section.classList.add('reveal', 'is-visible');
    });
}

const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer p');

if (footerText) {
    footerText.textContent = `© ${currentYear} Umalavanya Chinatapanti. All rights reserved.`;
}
