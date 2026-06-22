// Script de verificação de autenticação para todas as páginas protegidas
(function() {
    'use strict';

    // Verificar se o Netlify Identity está disponível
    if (typeof netlifyIdentity === 'undefined') {
        console.error('Netlify Identity não está carregado');
        return;
    }

    // Aguarda o Netlify Identity inicializar antes de verificar autenticação
    // O evento 'init' dispara após a inicialização completa, incluindo restauração da sessão
    netlifyIdentity.on('init', function(user) {
        if (!user) {
            console.log("Usuário não autenticado, redirecionando para login...");
            window.location.href = '/login.html';
        } else {
            console.log('Usuário autenticado:', user.email);
            addLogoutButton(user);
        }
    });

    // Listener para logout
    netlifyIdentity.on('logout', function() {
        console.log('Logout detectado, redirecionando...');
        window.location.href = '/login.html';
    });

    // Função para adicionar botão de logout
    function addLogoutButton(user) {
        // Verificar se já existe um botão de logout
        if (document.getElementById('user-info-container')) {
            return;
        }

        // Criar container de informações do usuário
        const userInfoContainer = document.createElement('div');
        userInfoContainer.id = 'user-info-container';
        userInfoContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(10, 10, 26, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            border: 1px solid rgba(0, 247, 255, 0.3);
            box-shadow: 0 4px 15px rgba(0, 247, 255, 0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 1rem;
        `;

        // Informações do usuário
        const userInfo = document.createElement('div');
        userInfo.style.cssText = `
            color: #f0f8ff;
            font-size: 0.9rem;
        `;
        userInfo.innerHTML = `
            <div style="opacity: 0.7; font-size: 0.8rem;">Logado como:</div>
            <div style="font-weight: 600; color: #00f7ff;">${user.email}</div>
        `;

        // Botão de logout
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Sair';
        logoutBtn.style.cssText = `
            background: linear-gradient(135deg, #00f7ff, #ff00c8);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            color: #0a0a1a;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        `;

        logoutBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 10px rgba(0, 247, 255, 0.4)';
        });

        logoutBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });

        logoutBtn.addEventListener('click', function() {
            if (confirm('Deseja realmente sair?')) {
                netlifyIdentity.logout();
            }
        });

        userInfoContainer.appendChild(userInfo);
        userInfoContainer.appendChild(logoutBtn);
        document.body.appendChild(userInfoContainer);

        // Responsividade para mobile
        if (window.innerWidth <= 768) {
            userInfoContainer.style.cssText += `
                top: 10px;
                right: 10px;
                left: 10px;
                padding: 0.8rem 1rem;
                flex-direction: column;
                gap: 0.5rem;
            `;
            userInfo.style.textAlign = 'center';
            logoutBtn.style.width = '100%';
        }
    }
})();

