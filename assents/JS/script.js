// ============================================================
// script.js — interações do portfólio de Renan Bruno
// ============================================================

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Tema claro/escuro ---------- */
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const applyIcon = () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        toggle.textContent = isDark ? '☀️' : '🌙';
        toggle.setAttribute('aria-label', isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    };
    applyIcon();

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('rb-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('rb-theme', 'dark');
        }
        applyIcon();
    });
}

/* ---------- Link ativo na navegação ---------- */
function markActiveNavLink() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach((link) => {
        if (link.getAttribute('href') === current) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

/* ---------- Revelar cartões ao rolar a página ---------- */
function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    items.forEach((el) => observer.observe(el));
}

/* ---------- Botão "voltar ao topo" ---------- */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 500);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
}

/* ---------- Efeito de "digitação" no terminal da home ---------- */
function initTerminal() {
    const codeEl = document.getElementById('terminal-code');
    if (!codeEl) return;

    const linhas = [
        { text: 'const ', cls: 'kw' }, { text: 'renan = {' },
        { text: '  nome: ' }, { text: "'Renan Bruno'", cls: 'str' }, { text: ',' },
        { text: '  papel: ' }, { text: "'Dev em formação'", cls: 'str' }, { text: ',' },
        { text: '  stack: [' }, { text: "'HTML', 'CSS', 'JS', 'Python'", cls: 'str' }, { text: '],' },
        { text: '  cidade: ' }, { text: "'Fortaleza, CE'", cls: 'str' },
        { text: '};' },
    ];

    // Monta o texto final (usado direto se o utilizador preferir menos movimento)
    const fullHTML = [
        '<span class="kw">const</span> renan = {\n',
        '  nome: <span class="str">\'Renan Bruno\'</span>,\n',
        '  papel: <span class="str">\'Dev em formação\'</span>,\n',
        '  stack: [<span class="str">\'HTML\', \'CSS\', \'JS\', \'Python\'</span>],\n',
        '  cidade: <span class="str">\'Fortaleza, CE\'</span>\n',
        '};',
    ].join('');

    if (reduceMotion) {
        codeEl.innerHTML = fullHTML;
        return;
    }

    const plainLines = [
        "const renan = {",
        "  nome: 'Renan Bruno',",
        "  papel: 'Dev em formação',",
        "  stack: ['HTML', 'CSS', 'JS', 'Python'],",
        "  cidade: 'Fortaleza, CE'",
        "};",
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let shown = '';

    function typeStep() {
        if (lineIndex >= plainLines.length) {
            codeEl.innerHTML = fullHTML + '<span class="cursor"></span>';
            return;
        }
        const line = plainLines[lineIndex];
        if (charIndex <= line.length) {
            shown = plainLines.slice(0, lineIndex).join('\n') +
                    (lineIndex > 0 ? '\n' : '') +
                    line.slice(0, charIndex);
            codeEl.textContent = shown;
            charIndex++;
            setTimeout(typeStep, 18);
        } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeStep, 60);
        }
    }
    typeStep();
}

/* ---------- Certificados: imagem quebrada -> placeholder ---------- */
function handleCertError(img) {
    const frame = img.parentElement;
    frame.classList.add('cert-frame--empty');
    frame.innerHTML = '<span class="cert-placeholder">📄<br>Certificado em breve</span>';
}
window.handleCertError = handleCertError;

/* ---------- Copiar e-mail (contato.html) ---------- */
function initCopyEmail() {
    const display = document.getElementById('email-display');
    const btn = document.getElementById('copy-email-btn');
    const feedback = document.getElementById('copy-feedback');
    if (!display || !btn) return;

    const email = `${display.dataset.user}@${display.dataset.domain}`;
    display.textContent = email;

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(email);
            feedback.textContent = 'Copiado!';
        } catch (err) {
            feedback.textContent = 'Não foi possível copiar.';
        }
        setTimeout(() => { feedback.textContent = ''; }, 2000);
    });
}

/* ---------- Filtro de Projetos ---------- */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projetos = document.querySelectorAll('.projeto-item');
    
    if(!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe active de todos os botões
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adiciona no botão clicado
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projetos.forEach(projeto => {
                const category = projeto.getAttribute('data-category');
                
                if (filterValue === 'todos' || (category && category.includes(filterValue))) {
                    projeto.style.display = 'flex';
                    // Re-aplica animação
                    projeto.classList.remove('in-view');
                    setTimeout(() => projeto.classList.add('in-view'), 10);
                } else {
                    projeto.style.display = 'none';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    markActiveNavLink();
    initScrollReveal();
    initBackToTop();
    initTerminal();
    initCopyEmail();
    initProjectFilters();
});