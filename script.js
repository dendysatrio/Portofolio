// ===== PARTICLE BACKGROUND =====
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, particles, animationId;
    const PARTICLE_COUNT = 80;
    const CONNECTION_DISTANCE = 120;
    const MOUSE_RADIUS = 150;
    let mouse = { x: -9999, y: -9999 };

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Move particles
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Mouse interaction
            const mdx = p.x - mouse.x;
            const mdy = p.y - mouse.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < MOUSE_RADIUS) {
                const opacity = (1 - mDist / MOUSE_RADIUS) * 0.3;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }

        animationId = requestAnimationFrame(drawParticles);
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    resize();
    createParticles();
    drawParticles();
})();


// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// ===== MOBILE NAV TOGGLE =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Close nav on outside click
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
});


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger the animations
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ===== ACTIVE NAV LINK HIGHLIGHT =====
const sections = document.querySelectorAll('.section, .hero');
const navLinksList = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinksList.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
}, {
    threshold: 0.3
});

sections.forEach(section => sectionObserver.observe(section));


// ===== PROJECT MODAL =====
const projectData = [
    {
        findings: [
            "56.6% of 129,487 passengers were dissatisfied or neutral — majority at risk",
            "Digital Experience Gap (0.92) was the #1 driver of dissatisfaction",
            "Physical Comfort (0.78) and Service Quality (0.67) followed closely",
            "Operational Reliability had the lowest gap — already the strongest dimension"
        ],
        images: [
            "https://raw.githubusercontent.com/dendysatrio/airline-passenger-satisfaction/main/Revo%20Air%20FULL.png"
        ],
        links: [
            { label: "GitHub", url: "https://github.com/dendysatrio/airline-passenger-satisfaction", primary: true },
            { label: "Tableau Dashboard", url: "https://public.tableau.com/views/AirlinePassengerDashboardDendySatrio/AirlinePassengerDashboard?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link", primary: false },
            { label: "View Report", url: "https://github.com/dendysatrio/airline-passenger-satisfaction/blob/main/Passenger%20Satisfaction%20Performance%20Report%20(Dendy_Satrio_Wibowo).pdf", primary: false }
        ]
    },
    {
        findings: [
            "Cleaned 5,500+ card records and 2,000 user profiles for RevoBank Indonesia",
            "Fixed data type issues: credit_limit & transaction amounts converted from object to float",
            "Applied business rule filtering — excluded cards with missing or zero credit limits",
            "Standardized categorical values and removed all duplicate records"
        ],
        images: [
            "https://raw.githubusercontent.com/dendysatrio/credit-card-segmentation/main/Bar%20chart%20DTI%20ratio%20by%20credit%20score%20category.png",
            "https://raw.githubusercontent.com/dendysatrio/credit-card-segmentation/main/Bar%20char%20avg%20card%20brand.png",
            "https://raw.githubusercontent.com/dendysatrio/credit-card-segmentation/main/Line%20chart%20avg%20credit%20limit%20by%20age.png",
            "https://raw.githubusercontent.com/dendysatrio/credit-card-segmentation/main/Ple%20chart%20fraud.png",
            "https://raw.githubusercontent.com/dendysatrio/credit-card-segmentation/main/boxplot%20DTI%20distribution.png",
            "https://raw.githubusercontent.com/dendysatrio/credit-card-segmentation/main/Customer%20Segmentaion/Spending%20behaviour.png",
            "https://raw.githubusercontent.com/dendysatrio/credit-card-segmentation/main/Customer%20Segmentaion/credit%20limit.png",
            "https://raw.githubusercontent.com/dendysatrio/credit-card-segmentation/main/Customer%20Segmentaion/distribution.png",
            "https://raw.githubusercontent.com/dendysatrio/credit-card-segmentation/main/Customer%20Segmentaion/risk%20activity.png"
        ],
        links: [
            { label: "GitHub", url: "https://github.com/dendysatrio/credit-card-segmentation", primary: true }
        ]
    },
    {
        findings: [
            "Tracked Rp508.5M in total expenses across 1,000 transactions in 2024",
            "Average spending per transaction: Rp508.5K",
            "Spending peaked in November 2024 — highest monthly total of the year",
            "Top merchant: PLN Loket Jakarta (Rp14.4M) — utilities dominated spending"
        ],
        images: [],
        links: [
            { label: "GitHub", url: "https://github.com/dendysatrio/expense-tracker-viz", primary: true },
            { label: "Live Dashboard", url: "https://public.tableau.com/views/DATAVIZ_OCT25_Dendy_Satrio_intermediate/Dashboard?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link", primary: false }
        ]
    },
    {
        findings: [
            "Cleaned dataset from 4,217 to 4,200 rows — removed 5 duplicates & 12 outliers (IQR method)",
            "10/10 campaign was the most revenue-efficient (highest revenue per Rp1 of discount)",
            "Men's Fashion had the best revenue efficiency across ALL 3 campaigns consistently",
            "A/B test: new product page increased avg transaction value by ~11% (Rp830K vs Rp746K, p < 0.05)"
        ],
        images: [],
        links: [
            { label: "GitHub", url: "https://github.com/dendysatrio/tokobli-analysis", primary: true },
            { label: "View Deck", url: "https://github.com/dendysatrio/tokobli-analysis/blob/main/%5BW2W3%20OCT25%5D_dendy_satrio_intermediate.pdf", primary: false }
        ]
    },
    {
        findings: [
            "Confections was #1 in revenue (556M+), unique customers, and repeat rate (99.85%)",
            "Revenue is volume-driven, not price-driven — high-priced categories underperformed",
            "Top 4 categories (Confections, Meat, Poultry, Cereals) contributed 44%+ of total revenue",
            "Top customer (ID 94800) generated 130K+ with steady, consistent repeat buying behavior"
        ],
        images: [
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/schema%20sales.png",
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/Q1%20Syntax.jpg",
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/Q1%20Tabel.jpg",
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/Q2%20Syntax.jpg",
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/Q2%20Tabel.jpg",
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/Q3%20Syntax.jpg",
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/Q3%20Tabel.jpg",
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/assignment%20sql%201.png",
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/assignment%20sql%202.png",
            "https://raw.githubusercontent.com/dendysatrio/sql-analysis/main/assignment%20sql%203.png"
        ],
        links: [
            { label: "GitHub", url: "https://github.com/dendysatrio/sql-analysis", primary: true },
            { label: "View Queries", url: "https://github.com/dendysatrio/sql-analysis/blob/main/SQL%20Query.sql", primary: false },
            { label: "View Deck", url: "https://github.com/dendysatrio/sql-analysis/blob/main/%5BSQL%20OCT25%5Ddendy_satrio_intermediate.pdf", primary: false }
        ]
    }
];

const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.project-card').forEach((card, index) => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('.project-link')) return;

        const data = projectData[index];
        const titleEl = card.querySelector('.project-title');
        const contextSpans = card.querySelectorAll('.project-context span');
        const tags = card.querySelectorAll('.tag');
        const badge = card.querySelector('.project-badge');

        // Badge
        const modalBadge = document.getElementById('modalBadge');
        if (badge) {
            modalBadge.textContent = badge.textContent;
            modalBadge.classList.add('visible');
        } else {
            modalBadge.classList.remove('visible');
        }

        // Title
        document.getElementById('modalTitle').textContent = titleEl ? titleEl.textContent : '';

        // Findings
        const findingsEl = document.getElementById('modalFindings');
        findingsEl.innerHTML = '';
        data.findings.forEach(f => {
            const li = document.createElement('li');
            li.textContent = f;
            findingsEl.appendChild(li);
        });

        // Carousel
        const imageWrap = document.getElementById('modalImageWrap');
        const modalImage = document.getElementById('modalImage');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dotsEl = document.getElementById('carouselDots');

        if (data.images && data.images.length > 0) {
            let currentIdx = 0;

            function setImage(idx) {
                modalImage.classList.add('fading');
                setTimeout(() => {
                    modalImage.src = data.images[idx];
                    modalImage.alt = titleEl ? titleEl.textContent : '';
                    modalImage.classList.remove('fading');
                }, 220);
                dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
                    d.classList.toggle('active', i === idx);
                });
                prevBtn.classList.toggle('hidden', data.images.length <= 1);
                nextBtn.classList.toggle('hidden', data.images.length <= 1);
            }

            // Build dots
            dotsEl.innerHTML = '';
            data.images.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', () => { currentIdx = i; setImage(i); });
                dotsEl.appendChild(dot);
            });

            // Click zoom
            modalImage.onclick = () => window.open(data.images[currentIdx], '_blank');

            // Arrows
            prevBtn.onclick = () => { currentIdx = (currentIdx - 1 + data.images.length) % data.images.length; setImage(currentIdx); };
            nextBtn.onclick = () => { currentIdx = (currentIdx + 1) % data.images.length; setImage(currentIdx); };

            setImage(0);
            imageWrap.classList.add('visible');
        } else {
            imageWrap.classList.remove('visible');
            modalImage.src = '';
            dotsEl.innerHTML = '';
        }

        // Tags
        const tagsEl = document.getElementById('modalTags');
        tagsEl.innerHTML = '';
        tags.forEach(tag => {
            const t = document.createElement('span');
            t.className = 'tag';
            t.textContent = tag.textContent;
            tagsEl.appendChild(t);
        });

        // Context
        if (contextSpans.length >= 2) {
            document.getElementById('modalContext').textContent = contextSpans[0].textContent;
            document.getElementById('modalDate').textContent = contextSpans[1].textContent;
        }

        // Links
        const linksEl = document.getElementById('modalLinks');
        linksEl.innerHTML = '';
        data.links.forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.className = `modal-link-btn ${link.primary ? 'primary' : 'secondary'}`;
            a.innerHTML = `${link.label} <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
            linksEl.appendChild(a);
        });

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
