document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica de Temas ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;
    const logoImg = document.getElementById('logo-img');

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
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
            if (logoImg) {
                logoImg.src = 'img/1.png';
            }
        } else {
            body.classList.remove('dark-theme');
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
            if (logoImg) {
                logoImg.src = 'img/2.png';
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


    // --- Funções de Comunicação com o Backend ---

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
            return null;
        }
    };

    const excluirNoticia = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/noticias/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Notícia excluída com sucesso!');
                const noticiasAtualizadas = await carregarNoticiasDoBackend();
                renderizarNoticiasAdmin(noticiasAtualizadas);
            } else {
                throw new Error('Falha ao excluir a notícia.');
            }
        } catch (error) {
            console.error('Erro na requisição DELETE:', error);
            alert('Erro ao excluir a notícia.');
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
            return [];
        }
    };

    const excluirPeriodo = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/curriculo/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Período excluído com sucesso!');
                const curriculoAtualizado = await carregarCurriculoDoBackend();
                renderizarCurriculoAdmin(curriculoAtualizado);
                renderizarTabelaCurriculo(curriculoAtualizado);
            } else {
                throw new Error('Falha ao excluir o período.');
            }
        } catch (error) {
            console.error('Erro na requisição DELETE de período:', error);
            alert('Erro ao excluir o período.');
        }
    };

    // --- Funções de Renderização de Conteúdo ---

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
                
                container.innerHTML += `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            ${imagemHtml}
                            <div class="card-body">
                                <h5 class="card-title">${noticia.titulo}</h5>
                                <p class="card-text">${textoCurto}</p>
                                <a href="noticia.html?id=${noticia.id}" class="btn btn-primary mt-2">Ler mais</a>
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
                    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
                        excluirNoticia(id);
                    }
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
                    if (confirm('Tem certeza que deseja excluir este período?')) {
                        excluirPeriodo(id);
                    }
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

        // Lógica de UI para a imagem de destaque
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


    // --- Funções de Compartilhamento ---
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
                case 'twitter':
                    shareLink = `https://twitter.com/intent/tweet?text=${noticiaTitle}&url=${encodeURIComponent(noticiaUrl)}`;
                    window.open(shareLink, '_blank', 'noopener,noreferrer');
                    break;
                case 'linkedin':
                    shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(noticiaUrl)}`;
                    window.open(shareLink, '_blank', 'noopener,noreferrer');
                    break;
                case 'copy':
                    // Verifica se a API de Clipboard está disponível e é segura
                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(noticiaUrl)
                            .then(() => {
                                alert('Link copiado para a área de transferência!');
                            })
                            .catch(err => {
                                console.error('Falha ao copiar o link:', err);
                                alert('Erro ao copiar o link.');
                            });
                    } else {
                        // Solução de fallback para navegadores mais antigos
                        const textarea = document.createElement('textarea');
                        textarea.value = noticiaUrl;
                        textarea.style.position = 'fixed'; // Evita que a textarea afete o layout
                        document.body.appendChild(textarea);
                        textarea.focus();
                        textarea.select();
                        try {
                            const successful = document.execCommand('copy');
                            alert(successful ? 'Link copiado para a área de transferência!' : 'Erro ao copiar o link.');
                        } catch (err) {
                            console.error('Falha ao copiar o link (execCommand):', err);
                            alert('Erro ao copiar o link.');
                        }
                        document.body.removeChild(textarea);
                    }
                    break;
                default:
                    return;
            }
        });
    };


    // --- Lógica de Páginas ---

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
                                <p class="text-muted">Publicado em: ${new Date(noticia.data).toLocaleDateString()}</p>
                                
                                <div id="share-buttons" class="mb-4 d-flex flex-wrap align-items-center gap-2">
                                    <p class="m-0 align-self-center me-2">Compartilhe:</p>
                                    <a href="#" class="btn btn-success" data-share-platform="whatsapp"><i class="fab fa-whatsapp"></i></a>
                                    <a href="#" class="btn btn-primary" data-share-platform="facebook"><i class="fab fa-facebook-f"></i></a>
                                    <a href="#" class="btn btn-info" data-share-platform="twitter"><i class="fab fa-twitter"></i></a>
                                    <a href="#" class="btn btn-secondary" data-share-platform="linkedin"><i class="fab fa-linkedin-in"></i></a>
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

    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const loginContainer = document.getElementById('login-container');
    const newsForm = document.getElementById('news-form');
    const curriculoForm = document.getElementById('curriculo-form');

    if (loginForm && loginContainer && adminPanel) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (username === 'admin' && password === '123') {
                if (loginContainer && adminPanel) {
                    loginContainer.classList.add('d-none');
                    adminPanel.classList.remove('d-none');
                    
                    const noticiasParaAdmin = await carregarNoticiasDoBackend();
                    renderizarNoticiasAdmin(noticiasParaAdmin);

                    const curriculoParaAdmin = await carregarCurriculoDoBackend();
                    renderizarCurriculoAdmin(curriculoParaAdmin);
                }
            } else {
                alert('Credenciais inválidas!');
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
                    alert(`Erro ao fazer o upload da imagem: ${error.message}`);
                    return;
                }
            } else if (noticiaId) {
                const noticiaExistente = await carregarNoticiaPorId(noticiaId);
                imagemUrl = noticiaExistente.imagem;
            }

            const novaNoticia = { id: noticiaId || null, titulo, imagem: imagemUrl, texto };
            const method = noticiaId ? 'PUT' : 'POST';
            const url = noticiaId ? `http://localhost:8080/api/noticias/${noticiaId}` : 'http://localhost:8080/api/noticias';

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novaNoticia),
                });
                if (response.ok) {
                    alert('Notícia salva com sucesso!');
                    resetNewsForm();
                    const noticiasAtualizadas = await carregarNoticiasDoBackend();
                    renderizarNoticiasAdmin(noticiasAtualizadas);
                } else {
                    const errorBody = await response.json();
                    throw new Error(errorBody.error || 'Falha ao adicionar a notícia.');
                }
            } catch (error) {
                alert(`Erro ao adicionar notícia: ${error.message}`);
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
                    alert('Grade Curricular salva com sucesso!');
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
                alert(`Erro ao salvar grade: ${error.message}`);
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

    // --- Lógica para upload de imagens no Trix Editor ---
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
                alert(`Erro ao anexar a imagem: ${error.message}`);
                attachment.remove();
            }
        }
    };

    // --- Nova lógica para aplicar estilos dinâmicos ---
    const trixEditor = document.querySelector('trix-editor');
    if (trixEditor) {
        trixEditor.addEventListener('trix-change', (event) => {
            const editorElement = event.target;
            const figures = editorElement.querySelectorAll('figure');

            figures.forEach(figure => {
                figure.classList.remove('single-image');
            });
            
            if (figures.length === 1 && !figures[0].classList.contains('attachment-gallery')) {
                figures[0].classList.add('single-image');
            }
        });
    }

    inicializarTrixUploader();
    
    // Funções do Modal
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
});