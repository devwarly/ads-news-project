document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica de Temas ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const logoImg = document.getElementById('logo-img');
    const heroBackground = document.getElementById('hero-background');

    const initParticles = (color) => {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                "particles": {
                    "number": {
                        "value": 80,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": color
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 5
                        }
                    },
                    "opacity": {
                        "value": 0.5,
                        "random": false,
                        "anim": {
                            "enable": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 150,
                        "color": color,
                        "opacity": 0.4,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": true,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        }
    };

    const loadTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        let logoPathLight = 'img/2.png';
        let logoPathDark = 'img/1.png';

        if (window.location.pathname.includes('/templates/')) {
            logoPathLight = '../img/2.png';
            logoPathDark = '../img/1.png';
        }

        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
            if (logoImg) {
                logoImg.src = logoPathDark;
            }
            if (heroBackground) {
                heroBackground.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("${logoPathDark}")`;
            }
        } else {
            body.classList.remove('dark-theme');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
            if (logoImg) {
                logoImg.src = logoPathLight;
            }
            if (heroBackground) {
                heroBackground.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("${logoPathLight}")`;
            }
        }

        if (document.getElementById('particles-js')) {
            const particlesColor = getComputedStyle(document.body).getPropertyValue('--particles-color').trim();
            initParticles(particlesColor);
        }
    };

    const toggleTheme = () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        }
        loadTheme();
    };

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    loadTheme();
    
    const showMessage = (message, type = 'info', duration = 2500) => {
        let wrapper = document.getElementById('message-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.id = 'message-wrapper';
            document.body.appendChild(wrapper);
        }

        const messageContainer = document.createElement('div');
        messageContainer.classList.add('custom-message', `custom-message--${type}`);
        messageContainer.textContent = message;
        
        wrapper.innerHTML = '';
        wrapper.appendChild(messageContainer);

        messageContainer.classList.add('show');
        
        setTimeout(() => {
            messageContainer.classList.remove('show');
            messageContainer.classList.add('hide');
        }, duration);

        messageContainer.addEventListener('animationend', (event) => {
            if (event.animationName === 'slide-out-up') {
                messageContainer.remove();
                if (wrapper.children.length === 0) {
                    wrapper.remove();
                }
            }
        });
    };

    const showConfirmation = (message) => {
        return new Promise((resolve) => {
            const modalOverlay = document.getElementById('confirmation-modal');
            const confirmationMessage = document.getElementById('confirmation-message');
            const confirmButton = document.getElementById('confirm-button');
            const cancelButton = document.getElementById('cancel-button');

            confirmationMessage.textContent = message;
            modalOverlay.classList.remove('d-none');
            setTimeout(() => modalOverlay.classList.add('visible'), 10);

            const handleConfirm = () => {
                modalOverlay.classList.remove('visible');
                setTimeout(() => modalOverlay.classList.add('d-none'), 300);
                removeListeners();
                resolve(true);
            };

            const handleCancel = () => {
                modalOverlay.classList.remove('visible');
                setTimeout(() => modalOverlay.classList.add('d-none'), 300);
                removeListeners();
                resolve(false);
            };

            const removeListeners = () => {
                confirmButton.removeEventListener('click', handleConfirm);
                cancelButton.removeEventListener('click', handleCancel);
                modalOverlay.removeEventListener('click', handleOverlayClick);
            };

            const handleOverlayClick = (e) => {
                if (e.target === modalOverlay) {
                    handleCancel();
                }
            };
            
            confirmButton.addEventListener('click', handleConfirm);
            cancelButton.addEventListener('click', handleCancel);
            modalOverlay.addEventListener('click', handleOverlayClick);
        });
    };

    const carregarNoticiasDoBackend = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/noticias');
            if (!response.ok) {
                throw new Error('Erro ao buscar notícias do servidor.');
            }
            const noticias = await response.json();
            return noticias.sort((a, b) => new Date(b.data) - new Date(a.data));
        } catch (error) {
            console.error('Erro na requisição GET de notícias:', error);
            showMessage('Não foi possível carregar as notícias. Tente novamente mais tarde.', 'error');
            return [];
        }
    };

    const carregarNoticiaPorId = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/noticias/${id}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar a notícia específica.');
            }
            const noticia = await response.json();
            return noticia;
        } catch (error) {
            console.error('Erro na requisição GET de uma notícia:', error);
            showMessage('Não foi possível carregar a notícia. Verifique o ID.', 'error');
            return null;
        }
    };

    const excluirNoticia = async (id) => {
        const confirmed = await showConfirmation('Tem certeza que deseja excluir esta notícia?');
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:8080/api/noticias/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    showMessage('Notícia excluída com sucesso!', 'success');
                    const noticiasAtualizadas = await carregarNoticiasDoBackend();
                    renderizarNoticiasAdmin(noticiasAtualizadas);
                } else {
                    throw new Error('Falha ao excluir a notícia.');
                }
            } catch (error) {
                console.error('Erro na requisição DELETE:', error);
                showMessage('Erro ao excluir o notícia.', 'error');
            }
        }
    };

    const carregarCurriculoDoBackend = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/curriculo');
            if (!response.ok) {
                throw new Error('Erro ao buscar grade curricular do servidor.');
            }
            const curriculo = await response.json();
            return curriculo;
        } catch (error) {
            console.error('Erro na requisição GET do currículo:', error);
            showMessage('Não foi possível carregar a grade curricular.', 'error');
            return [];
        }
    };

    const excluirPeriodo = async (id) => {
        const confirmed = await showConfirmation('Tem certeza que deseja excluir este período?');
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:8080/api/curriculo/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    showMessage('Período excluído com sucesso!', 'success');
                    const curriculoAtualizado = await carregarCurriculoDoBackend();
                    renderizarCurriculoAdmin(curriculoAtualizado);
                    renderizarTabelaCurriculo(curriculoAtualizado);
                } else {
                    throw new Error('Falha ao excluir o período.');
                }
            } catch (error) {
                console.error('Erro na requisição DELETE de período:', error);
                showMessage('Erro ao excluir o período.', 'error');
            }
        }
    };

    const renderizarNoticias = (containerId, listaNoticias) => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            listaNoticias.forEach(noticia => {
                const imagemHtml = noticia.imagem ? `<img src="http://localhost:8080${noticia.imagem}" class="card-img-top" alt="Imagem da notícia">` : '';
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = noticia.texto;
                const textoPlano = tempDiv.textContent || tempDiv.innerText || '';
                
                const limiteCaracteres = 150; 
                let textoCurto = textoPlano.length > limiteCaracteres 
                    ? textoPlano.substring(0, limiteCaracteres) + '...'
                    : textoPlano;
                
                let pathPrefix = '';
                if (!window.location.pathname.includes('/templates/')) {
                    pathPrefix = 'templates/';
                }
                
                container.innerHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            ${imagemHtml}
                            
                            <div class="card-body">
                                <h5 class="card-title">${noticia.titulo}</h5>
                                <p class="card-text"><small class="text-muted">Publicado por ${noticia.autor} em ${new Date(noticia.data).toLocaleDateString()}</small></p>
                                <p class="card-text">${textoCurto}</p>
                                <a href="${pathPrefix}noticia.html?id=${noticia.id}" class="btn btn-primary mt-2">Ler mais</a>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
    };

    const renderizarNoticiasAdmin = (listaNoticias) => {
        const container = document.getElementById('noticias-list-admin');
        if (container) {
            container.innerHTML = '';
            listaNoticias.forEach(noticia => {
                container.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center p-3 mb-2 card">
                        <p class="m-0">${noticia.titulo}</p>
                        <div>
                            <button class="btn btn-sm btn-outline-primary edit-news-btn" data-id="${noticia.id}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-btn" data-id="${noticia.id}">Excluir</button>
                        </div>
                    </div>
                `;
            });
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    excluirNoticia(id);
                });
            });
            document.querySelectorAll('.edit-news-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const noticia = await carregarNoticiaPorId(id);
                    if (noticia) {
                        preencherFormularioNoticia(noticia);
                    }
                });
            });
        }
    };

    const renderizarTabelaCurriculo = (listaCurriculo) => {
        const container = document.getElementById('curriculo-tabela-corpo');
        if (container) {
            container.innerHTML = '';
            listaCurriculo.forEach(periodo => {
                const disciplinasHtml = periodo.disciplinas.map(d => `<li>${d}</li>`).join('');
                container.innerHTML += `
                    <tr>
                        <td>${periodo.nome}</td>
                        <td>
                            <ul class="disciplines">
                                ${disciplinasHtml}
                            </ul>
                        </td>
                    </tr>
                `;
            });
        }
    };

    const renderizarCurriculoAdmin = (listaCurriculo) => {
        const container = document.getElementById('curriculo-list-admin');
        if (container) {
            container.innerHTML = '';
            listaCurriculo.forEach(periodo => {
                container.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center p-3 mb-2 card">
                        <p class="m-0">${periodo.nome}</p>
                        <div>
                            <button class="btn btn-sm btn-outline-primary edit-periodo-btn" data-id="${periodo.id}">Editar</button>
                            <button class="btn btn-danger btn-sm delete-periodo-btn" data-id="${periodo.id}">Excluir</button>
                        </div>
                    </div>
                `;
            });
            document.querySelectorAll('.delete-periodo-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = e.target.getAttribute('data-id');
                    excluirPeriodo(id);
                });
            });
            document.querySelectorAll('.edit-periodo-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const periodo = await fetch(`http://localhost:8080/api/curriculo/${id}`).then(res => res.json());
                    if (periodo) {
                        preencherFormularioCurriculo(periodo);
                    }
                });
            });
        }
    };

    const preencherFormularioNoticia = (noticia) => {
        document.getElementById('noticia-id').value = noticia.id;
        document.getElementById('titulo-noticia').value = noticia.titulo;
        document.getElementById('btn-submit-news').textContent = 'Salvar Edição';

        const trixEditor = document.querySelector('trix-editor');
        trixEditor.value = noticia.texto;

        const imageInput = document.getElementById('imagem-noticia');
        const imagePreview = document.getElementById('image-preview');

        if (noticia.imagem) {
            imageInput.style.display = 'none';
            imagePreview.innerHTML = `
                <div class="position-relative d-inline-block">
                    <img src="http://localhost:8080${noticia.imagem}" class="img-fluid rounded" alt="Pré-visualização da imagem de destaque">
                    <button type="button" class="btn btn-danger btn-sm position-absolute top-0 start-100 translate-middle rounded-circle" id="remove-image-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            document.getElementById('remove-image-btn').addEventListener('click', () => {
                imageInput.style.display = 'block';
                imagePreview.innerHTML = '';
                imageInput.value = '';
            });
        } else {
            imageInput.style.display = 'block';
            imagePreview.innerHTML = '';
        }
    };
    
    const resetNewsForm = () => {
        const newsForm = document.getElementById('news-form');
        const trixEditor = document.querySelector('trix-editor');
        const imageInput = document.getElementById('imagem-noticia');
        const imagePreview = document.getElementById('image-preview');
        const btnSubmit = document.getElementById('btn-submit-news');

        newsForm.reset();
        trixEditor.value = '';
        document.getElementById('noticia-id').value = '';
        btnSubmit.textContent = 'Adicionar Notícia';
        imageInput.style.display = 'block';
        imagePreview.innerHTML = '';
    }

    const preencherFormularioCurriculo = (periodo) => {
        const form = document.getElementById('curriculo-form');
        document.getElementById('periodo-id').value = periodo.id;
        document.getElementById('periodo-nome').value = periodo.nome;
        document.getElementById('periodo-disciplinas').value = periodo.disciplinas.join('\n');
        document.getElementById('btn-submit-curriculo').textContent = 'Salvar Edição';
    };

    const setupShareButtons = (noticia) => {
        const shareButtons = document.getElementById('share-buttons');

        if (!shareButtons) return;

        const noticiaUrl = window.location.href;
        const noticiaTitle = encodeURIComponent(noticia.titulo);

        shareButtons.addEventListener('click', (e) => {
            e.preventDefault();
            const button = e.target.closest('a, button');
            const platform = button?.dataset.sharePlatform;
            let shareLink = '';

            switch (platform) {
                case 'whatsapp':
                    shareLink = `https://api.whatsapp.com/send?text=${noticiaTitle}%0A${encodeURIComponent(noticiaUrl)}`;
                    window.open(shareLink, '_blank', 'noopener,noreferrer');
                    break;
                case 'facebook':
                    shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(noticiaUrl)}`;
                    window.open(shareLink, '_blank', 'noopener,noreferrer');
                    break;
                case 'linkedin':
                    shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(noticiaUrl)}`;
                    window.open(shareLink, '_blank', 'noopener,noreferrer');
                    break;
                case 'instagram':
                    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
                    if (isMobile) {
                        navigator.clipboard.writeText(noticiaUrl)
                            .then(() => {
                                showMessage('Link copiado! Cole-o na sua postagem ou Stories no Instagram.', 'info');
                                window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
                            })
                            .catch(err => {
                                console.error('Falha ao copiar o link:', err);
                                showMessage('Erro ao copiar o link. Por favor, tente novamente.', 'error');
                            });
                    } else {
                        showMessage('Para compartilhar no Instagram, copie o link e cole na sua postagem ou Stories.', 'info');
                        navigator.clipboard.writeText(noticiaUrl)
                            .catch(err => console.error('Falha ao copiar o link:', err));
                    }
                    break;
                case 'copy':
                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(noticiaUrl)
                            .then(() => {
                                showMessage('Link copiado para a área de transferência!', 'success');
                            })
                            .catch(err => {
                                console.error('Falha ao copiar o link:', err);
                                showMessage('Erro ao copiar o link.', 'error');
                            });
                    } else {
                        const textarea = document.createElement('textarea');
                        textarea.value = noticiaUrl;
                        textarea.style.position = 'fixed';
                        document.body.appendChild(textarea);
                        textarea.focus();
                        textarea.select();
                        try {
                            const successful = document.execCommand('copy');
                            showMessage(successful ? 'Link copiado para a área de transferência!' : 'Erro ao copiar o link.', successful ? 'success' : 'error');
                        } catch (err) {
                            console.error('Falha ao copiar o link (execCommand):', err);
                            showMessage('Erro ao copiar o link.', 'error');
                        }
                        document.body.removeChild(textarea);
                    }
                    break;
                default:
                    return;
            }
        });
    };

    if (document.getElementById('noticias-container')) {
        carregarNoticiasDoBackend().then(noticias => {
            if (noticias.length > 0) {
                renderizarNoticias('noticias-container', noticias.slice(0, 3));
            }
        });
    }

    if (document.getElementById('noticias-todas-container')) {
        carregarNoticiasDoBackend().then(noticias => {
            renderizarNoticias('noticias-todas-container', noticias);
        });
    }

    if (document.getElementById('noticia-completa-container')) {
        const urlParams = new URLSearchParams(window.location.search);
        const noticiaId = urlParams.get('id');

        if (noticiaId) {
            carregarNoticiaPorId(noticiaId).then(noticia => {
                if (noticia) {
                    const container = document.getElementById('noticia-completa-container');
                    const imagemHtml = noticia.imagem ? `<img src="http://localhost:8080${noticia.imagem}" class="img-fluid rounded mb-4" alt="Imagem da notícia" >` : '';

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = noticia.texto;
                    
                    const captions = tempDiv.querySelectorAll('.attachment__caption');
                    captions.forEach(caption => {
                        caption.remove();
                    });

                    const figures = tempDiv.querySelectorAll('figure');
                    if (figures.length === 1 && !figures[0].classList.contains('attachment-gallery')) {
                        figures[0].classList.add('single-image');
                    }

                    const trixImages = tempDiv.querySelectorAll('img');
                    trixImages.forEach(img => {
                        const url = img.getAttribute('src');
                        if (url && !url.startsWith('http')) {
                            img.src = `http://localhost:8080${url}`;
                        }
                    });

                    const htmlTextoModificado = tempDiv.innerHTML;

                    container.innerHTML = `
                        <button onclick="window.history.back()" class="btn btn-primary mb-4">
                            <i class="fas fa-arrow-left"></i> Voltar
                        </button>
                        <div class="row">
                            <div class="col-12 text-center">
                                ${imagemHtml}
                            </div>
                            <div class="col-12">
                                <h1 class="display-4">${noticia.titulo}</h1>
                                <p class="text-muted">Publicado por ${noticia.autor} em ${new Date(noticia.data).toLocaleDateString()}</p>
                                
                                <div id="share-buttons" class="mb-4 d-flex flex-wrap align-items-center gap-2">
                                    <p class="m-0 align-self-center me-2">Compartilhe:</p>
                                    <a href="#" class="btn btn-success" data-share-platform="whatsapp"><i class="fab fa-whatsapp"></i></a>
                                    <a href="#" class="btn btn-primary" data-share-platform="facebook"><i class="fab fa-facebook-f"></i></a>
                                    <a href="#" class="btn btn-primary" data-share-platform="linkedin"><i class="fab fa-linkedin-in"></i></a>
                                    <a href="#" class="btn btn-danger" data-share-platform="instagram"><i class="fab fa-instagram"></i></a>
                                    <button class="btn btn-secondary" data-share-platform="copy"><i class="fas fa-link"></i></button>
                                </div>
                                <div class="lead">${htmlTextoModificado}</div>
                            </div>
                        </div>
                    `;
                    
                    const galleryContainer = document.querySelector('.lead');
                    if (galleryContainer) {
                        galleryContainer.addEventListener('click', (event) => {
                            const target = event.target;
                            if (target.tagName === 'IMG' && target.closest('.attachment-gallery')) {
                                const imageUrl = target.src;
                                createModal(imageUrl);
                            }
                        });
                    }

                    carregarNoticiasDoBackend().then(todasNoticias => {
                        const noticiasRelacionadas = todasNoticias.filter(n => n.id != noticiaId).slice(0, 3);
                        renderizarNoticias('noticias-relacionadas-container', noticiasRelacionadas);
                    });

                    setupShareButtons(noticia);
                } else {
                    container.innerHTML = `<div class="alert alert-danger text-center">Notícia não encontrada.</div>`;
                }
            });
        } else {
            document.getElementById('noticia-completa-container').innerHTML = `<div class="alert alert-danger text-center">ID da notícia não fornecido.</div>`;
        }
    }

    if (document.getElementById('curriculo-tabela-corpo')) {
        carregarCurriculoDoBackend().then(curriculo => {
            renderizarTabelaCurriculo(curriculo);
        });
    }

    // Declaração de variáveis
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const loginContainer = document.getElementById('login-container');
    const newsForm = document.getElementById('news-form');
    const curriculoForm = document.getElementById('curriculo-form');
    const keyForm = document.getElementById('key-form');
    const btnRequestKey = document.getElementById('request-key-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const changePasswordForm = document.getElementById('change-password-form');
    const deleteAccountForm = document.getElementById('delete-account-form');


    // Funções do Admin Panel
    const loadAdminPanelContent = async () => {
        const noticiasParaAdmin = await carregarNoticiasDoBackend();
        renderizarNoticiasAdmin(noticiasParaAdmin);
        const curriculoParaAdmin = await carregarCurriculoDoBackend();
        renderizarCurriculoAdmin(curriculoParaAdmin);
        
        const adminName = localStorage.getItem('adminName');
        if (adminName) {
            document.getElementById('admin-name').textContent = adminName;
        }

        if (adminPanel) {
            adminPanel.classList.remove('d-none');
        }
    };

    const checkAuthAndRedirect = () => {
        const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';
        const currentPage = window.location.pathname.split('/').pop();

        if (currentPage === 'admin.html' && !isLoggedIn) {
            window.location.href = 'admin-login.html';
        } else if (currentPage === 'admin.html' && isLoggedIn) {
            loadAdminPanelContent();
        } else if (currentPage === 'admin-login.html' && isLoggedIn) {
            window.location.href = 'admin.html';
        }
    };
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (response.status === 401) {
                    showMessage('Credenciais inválidas!', 'error');
                } else if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        localStorage.setItem('isAuthenticated', 'true');
                        localStorage.setItem('adminName', data.adminName);
                        localStorage.setItem('adminEmail', username);
                        showMessage('Login realizado com sucesso!', 'success');
                        setTimeout(() => window.location.href = 'admin.html', 1500);
                    }
                } else {
                    showMessage('Erro no servidor. Tente novamente.', 'error');
                }
            } catch (error) {
                console.error('Erro no login:', error);
                showMessage('Não foi possível conectar ao servidor.', 'error');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('adminName');
            localStorage.removeItem('adminEmail');
            window.location.href = 'admin-login.html';
        });
    }
    
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            const adminEmail = localStorage.getItem('adminEmail');
            if (!adminEmail) {
                showMessage("Você precisa estar logado para alterar a senha.", "error");
                return;
            }
            const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
            changePasswordModal.show();
        });
    }

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            const adminEmail = localStorage.getItem('adminEmail');
            if (!adminEmail) {
                showMessage("Você precisa estar logado para excluir a conta.", "error");
                return;
            }
            const deleteAccountModal = new bootstrap.Modal(document.getElementById('deleteAccountModal'));
            deleteAccountModal.show();
        });
    }

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            if (newPassword !== confirmNewPassword) {
                showMessage("As novas senhas não coincidem.", "error");
                return;
            }

            const adminEmail = localStorage.getItem('adminEmail');
            if (!adminEmail) {
                showMessage("E-mail do administrador não encontrado. Faça o login novamente.", "error");
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/auth/change-password', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: adminEmail, currentPassword, newPassword })
                });

                if (response.ok) {
                    showMessage('Senha alterada com sucesso!', 'success');
                    document.getElementById('changePasswordModal').querySelector('.btn-close').click();
                    logoutBtn.click();
                } else if (response.status === 401) {
                    showMessage('Senha atual incorreta.', 'error');
                } else {
                    const error = await response.json();
                    showMessage(error.error || 'Falha ao alterar a senha.', 'error');
                }
            } catch (error) {
                showMessage('Não foi possível conectar ao servidor.', 'error');
            }
        });
    }
    
    if (deleteAccountForm) {
        deleteAccountForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('delete-password').value;

            const confirmed = await showConfirmation('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.');
            if (confirmed) {
                const adminEmail = localStorage.getItem('adminEmail');
                if (!adminEmail) {
                    showMessage("E-mail do administrador não encontrado. Faça o login novamente.", "error");
                    return;
                }
                try {
                    const response = await fetch('http://localhost:8080/api/auth/delete-account', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: adminEmail, password })
                    });

                    if (response.ok) {
                        showMessage('Conta excluída com sucesso!', 'success');
                        document.getElementById('deleteAccountModal').querySelector('.btn-close').click();
                        logoutBtn.click();
                    } else if (response.status === 401) {
                        showMessage('Senha incorreta.', 'error');
                    } else {
                        const error = await response.json();
                        showMessage(error.error || 'Falha ao excluir a conta.', 'error');
                    }
                } catch (error) {
                    showMessage('Não foi possível conectar ao servidor.', 'error');
                }
            }
        });
    }

    if (btnRequestKey) {
        btnRequestKey.addEventListener('click', async () => {
            const solicitanteEmail = document.getElementById('email-cad-admin').value;
            
            if (!solicitanteEmail) {
                showMessage('Por favor, insira o seu e-mail para solicitar a chave.', 'error');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/auth/request-key', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: solicitanteEmail })
                });
                
                const data = await response.json();
                if (response.ok) {
                    showMessage(data.message, 'success');
                } else {
                    showMessage(data.error || 'Erro ao solicitar a chave.', 'error');
                }
            } catch (error) {
                console.error('Erro ao solicitar a chave:', error);
                showMessage('Não foi possível conectar ao servidor.', 'error');
            }
        });
    }

    if (keyForm) {
        keyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email-cad-admin').value;
            const key = document.getElementById('key-admin').value;
            const nome = document.getElementById('nome-cad-admin').value;
            const sobrenome = document.getElementById('sobrenome-cad-admin').value;
            const password = document.getElementById('password-cad-admin').value;
            const confirmPassword = document.getElementById('confirm-password-cad-admin').value;

            if (password !== confirmPassword) {
                showMessage('As senhas não coincidem!', 'error');
                return;
            }
            
            try {
                const response = await fetch('http://localhost:8080/api/auth/register-admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, key, nome, sobrenome, password })
                });

                if (response.ok) {
                    showMessage('Administrador cadastrado com sucesso!', 'success');
                    setTimeout(() => window.location.href = 'admin-login.html', 2500);
                } else {
                    const error = await response.json();
                    showMessage(error.error || 'Erro ao cadastrar administrador.', 'error');
                }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                showMessage('Não foi possível conectar ao servidor.', 'error');
            }
        });
    }

    if (newsForm) {
        newsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const trixEditor = document.querySelector('trix-editor');
            const noticiaId = document.getElementById('noticia-id').value;
            const titulo = document.getElementById('titulo-noticia').value;
            const texto = trixEditor.value;
            const file = document.getElementById('imagem-noticia').files[0];
            const btnSubmit = document.getElementById('btn-submit-news');
            const autor = localStorage.getItem('adminName');

            if (!autor) {
                showMessage("Não foi possível identificar o autor da notícia. Faça o login novamente.", "error");
                return;
            }

            let imagemUrl = '';
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                try {
                    const uploadResponse = await fetch('http://localhost:8080/api/upload', {
                        method: 'POST',
                        body: formData,
                    });
                    if (!uploadResponse.ok) {
                        const errorBody = await uploadResponse.json();
                        throw new Error(errorBody.error || 'Falha no upload da imagem.');
                    }
                    const uploadData = await uploadResponse.json();
                    imagemUrl = uploadData.url;
                } catch (error) {
                    console.error('Erro no upload da imagem:', error);
                    showMessage(`Erro ao fazer o upload da imagem: ${error.message}`, 'error');
                    return;
                }
            } else if (noticiaId) {
                const noticiaExistente = await carregarNoticiaPorId(noticiaId);
                imagemUrl = noticiaExistente.imagem;
            }

            const novaNoticia = { id: noticiaId || null, titulo, imagem: imagemUrl, texto, autor: autor };
            const method = noticiaId ? 'PUT' : 'POST';
            const url = noticiaId ? `http://localhost:8080/api/noticias/${noticiaId}` : 'http://localhost:8080/api/noticias';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novaNoticia),
                });
                if (response.ok) {
                    showMessage('Notícia salva com sucesso!', 'success');
                    resetNewsForm();
                    const noticiasAtualizadas = await carregarNoticiasDoBackend();
                    renderizarNoticiasAdmin(noticiasAtualizadas);
                } else {
                    const errorBody = await response.json();
                    throw new Error(errorBody.error || 'Falha ao adicionar a notícia.');
                }
            } catch (error) {
                showMessage(`Erro ao adicionar notícia: ${error.message}`, 'error');
                console.error('Erro na requisição:', error);
            }
        });
    }

    if (curriculoForm) {
        curriculoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const periodoId = document.getElementById('periodo-id').value;
            const nome = document.getElementById('periodo-nome').value;
            const disciplinas = document.getElementById('periodo-disciplinas').value
                .split('\n')
                .map(d => d.trim())
                .filter(d => d);
            const btnSubmit = document.getElementById('btn-submit-curriculo');

            const novoPeriodo = { id: periodoId || null, nome, disciplinas };
            const method = periodoId ? 'PUT' : 'POST';
            const url = periodoId ? `http://localhost:8080/api/curriculo/${periodoId}` : 'http://localhost:8080/api/curriculo';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novoPeriodo),
                });
                if (response.ok) {
                    showMessage('Grade Curricular salva com sucesso!', 'success');
                    curriculoForm.reset();
                    document.getElementById('periodo-id').value = '';
                    btnSubmit.textContent = 'Adicionar Período';
                    const curriculoAtualizado = await carregarCurriculoDoBackend();
                    renderizarCurriculoAdmin(curriculoAtualizado);
                    renderizarTabelaCurriculo(curriculoAtualizado);
                } else {
                    const errorBody = await response.json();
                    throw new Error(errorBody.error || 'Falha ao salvar a grade curricular.');
                }
            } catch (error) {
                showMessage(`Erro ao salvar grade: ${error.message}`, 'error');
                console.error('Erro na requisição:', error);
            }
        });
    }

    if (document.getElementById('curriculo-toolbar')) {
        document.getElementById('curriculo-toolbar').addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.format === 'list') {
                const textarea = document.getElementById('periodo-disciplinas');
                const start = textarea.selectionStart;
                const newText = '• ';
                textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(start);
                textarea.focus();
                textarea.selectionEnd = start + newText.length;
            }
        });
    }

    const inicializarTrixUploader = () => {
        document.removeEventListener('trix-attachment-add', handleTrixAttachment);
        document.addEventListener('trix-attachment-add', handleTrixAttachment);
    };

    const handleTrixAttachment = async (event) => {
        const attachment = event.attachment;
        const file = attachment.file;
    
        if (file && file.type.startsWith('image/')) {
            const formData = new FormData();
            formData.append('file', file);
    
            try {
                const response = await fetch('http://localhost:8080/api/upload', {
                    method: 'POST',
                    body: formData,
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Falha no upload da imagem.');
                }
    
                const uploadResult = await response.json();
                const imageUrl = `http://localhost:8080${uploadResult.url}`;
    
                attachment.setAttributes({
                    url: imageUrl,
                    href: imageUrl
                });
    
            } catch (error) {
                console.error('Erro ao fazer upload do anexo:', error);
                showMessage(`Erro ao anexar a imagem: ${error.message}`, 'error');
                attachment.remove();
            }
        }
    };
    
    inicializarTrixUploader();
    
    function createModal(imageUrl) {
        const modalOverlay = document.createElement('div');
        modalOverlay.classList.add('modal-overlay');
        document.body.appendChild(modalOverlay);

        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal-container');
        modalOverlay.appendChild(modalContainer);

        const modalImage = document.createElement('img');
        modalImage.src = imageUrl;
        modalImage.classList.add('modal-image');
        modalContainer.appendChild(modalImage);

        const closeButton = document.createElement('button');
        closeButton.classList.add('modal-close-button');
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        modalContainer.appendChild(closeButton);

        modalOverlay.addEventListener('click', closeModal);
        closeButton.addEventListener('click', closeModal);

        function closeModal() {
            modalOverlay.remove();
        }
    }
    
    checkAuthAndRedirect();
});