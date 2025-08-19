const turmaCuriosidadesPerguntaEl = document.getElementById('turma-curiosidades-pergunta');
const turmaCuriosidadesRespostaEl = document.getElementById('turma-curiosidades-resposta');
const turmaCuriosidadesAnteriorBotao = document.getElementById('turma-curiosidades-anterior');
const turmaCuriosidadesProximoBotao = document.getElementById('turma-curiosidades-proximo');

// Lista de curiosidades sobre programação, tecnologia e história da computação
const curiosidadesProgramacao = [
    {
        pergunta: "Você sabe o que é um 'bug' na programação?",
        resposta: "Um bug é um erro, falha ou falha em um programa que faz com que ele se comporte de maneira inesperada. O nome surgiu de um inseto de verdade que causou um erro em um dos primeiros computadores!"
    },
    {
        pergunta: "O que significa o termo 'linguagem de programação'?",
        resposta: "É como um idioma que usamos para dar instruções a um computador. Cada linguagem tem suas próprias regras e sintaxe, como o Português ou o Inglês, só que para máquinas."
    },
    {
        pergunta: "Você já ouviu falar de 'Inteligência Artificial' (IA)?",
        resposta: "A IA não é algo que pensa como nós, mas sim um sistema que consegue aprender e tomar decisões baseadas em dados. É o que faz o Netflix sugerir filmes e o Google traduzir textos."
    },
    {
        pergunta: "Como um aplicativo de celular funciona?",
        resposta: "Ele é um programa que usa uma linguagem de programação para se comunicar com o sistema operacional do celular. O código diz ao aparelho o que fazer, como mostrar uma imagem ou tocar uma música."
    },
    {
        pergunta: "O que é 'código fonte'?",
        resposta: "É a versão original de um programa escrita por um programador. É o 'roteiro' que um computador precisa seguir para executar uma tarefa."
    },
    {
        pergunta: "Você sabia que a primeira 'programadora' foi uma mulher?",
        resposta: "Sim! Ada Lovelace, no século XIX, é considerada a primeira programadora da história. Ela escreveu um algoritmo para uma máquina analítica, muito antes dos computadores existirem."
    },
    {
        pergunta: "O que significa 'programar'?",
        resposta: "Programar é basicamente resolver problemas, mas usando um computador. Você 'quebra' um problema grande em pequenas partes e escreve o passo a passo para o computador resolver."
    },
    {
        pergunta: "O que é 'backend' e 'frontend'?",
        resposta: "Pense em um site. O 'frontend' é a parte que você vê e interage (botões, imagens, texto). O 'backend' é tudo o que está por trás, nos servidores, que gerencia os dados e o funcionamento do site."
    },
    {
        pergunta: "O termo 'algoritmo' é usado em programação, mas o que ele significa?",
        resposta: "Um algoritmo é uma sequência de passos para realizar uma tarefa. Por exemplo, uma receita de bolo é um algoritmo: ela tem um passo a passo para você seguir e obter um resultado final."
    },
    {
        pergunta: "O que é 'HTML'?",
        resposta: "HTML é uma linguagem de marcação usada para estruturar a 'espinha dorsal' de uma página da web, como títulos, parágrafos e links. Pense nele como o esqueleto de um site."
    },
    {
        pergunta: "O que é 'CSS'?",
        resposta: "O CSS é como se fosse a 'roupa' do HTML. Ele é a linguagem usada para estilizar uma página, definindo cores, fontes, layouts e animações para que o site fique bonito e organizado."
    },
    {
        pergunta: "O que é 'JavaScript'?",
        resposta: "O JavaScript é a linguagem que dá vida a um site. Ele adiciona interatividade e dinamismo, como mostrar mensagens de alerta, fazer animações ou responder a cliques de botões."
    },
    {
        pergunta: "O que é um 'framework'?",
        resposta: "É como um 'kit de ferramentas' que ajuda programadores a construírem software de forma mais rápida e eficiente. Por exemplo, React e Angular são frameworks populares para construir sites."
    },
    {
        pergunta: "O 'código binário' é a única coisa que um computador realmente entende.",
        resposta: "O código binário é composto apenas por zeros e uns (0s e 1s). Todo o texto, imagem ou vídeo que você vê no computador é, no fundo, uma sequência gigantesca desses dois números."
    },
    {
        pergunta: "O primeiro vírus de computador da história foi criado em 1983.",
        resposta: "O vírus se chamava 'Elk Cloner' e afetava computadores Apple II. Ele se espalhava através de disquetes e exibia um poema na tela do usuário."
    },
    {
        pergunta: "O primeiro e-mail foi enviado em 1971.",
        resposta: "O desenvolvedor Ray Tomlinson enviou o primeiro e-mail de um computador para outro, usando o símbolo '@' para separar o nome do usuário e o nome do computador."
    },
    {
        pergunta: "Você sabe qual é a principal diferença entre um 'site' e uma 'aplicação web'?",
        resposta: "Um site geralmente tem conteúdo estático (páginas de texto, imagens), enquanto uma aplicação web é dinâmica e interativa, permitindo que o usuário realize tarefas complexas, como em um e-commerce ou rede social."
    },
    {
        pergunta: "O conceito de 'nuvem' (cloud) não é algo que está no céu.",
        resposta: "A computação em nuvem se refere a serviços de computação (servidores, armazenamento, bancos de dados) acessíveis pela internet. Isso permite que empresas usem recursos de computadores sem ter que comprar e manter sua própria infraestrutura física."
    }
];

let curiosidadesEmbaralhadas = [];
let indiceCuriosidadeAtual = 0;

// Função para embaralhar o array
function embaralhar(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Nova função para aplicar a animação e mudar o conteúdo
function mudarCuriosidade() {
    // Adiciona a classe de fade-out para iniciar a animação de saída
    turmaCuriosidadesPerguntaEl.classList.add('fade-out');
    turmaCuriosidadesRespostaEl.classList.add('fade-out');

    // Espera a animação de fade-out terminar (0.5s) antes de mudar o conteúdo
    setTimeout(() => {
        const curiosidade = curiosidadesEmbaralhadas[indiceCuriosidadeAtual];

        // Altera o conteúdo de texto
        turmaCuriosidadesPerguntaEl.textContent = curiosidade.pergunta;
        turmaCuriosidadesRespostaEl.textContent = curiosidade.resposta;
        turmaCuriosidadesRespostaEl.classList.remove('turma-curiosidades-escondida');

        // Remove a classe de fade-out e adiciona a de fade-in para a animação de entrada
        turmaCuriosidadesPerguntaEl.classList.remove('fade-out');
        turmaCuriosidadesRespostaEl.classList.remove('fade-out');
        turmaCuriosidadesPerguntaEl.classList.add('fade-in');
        turmaCuriosidadesRespostaEl.classList.add('fade-in');
    }, 500); // O tempo do setTimeout deve ser igual ou um pouco maior que a duração da animação no CSS
}

// Botão "Próximo": avança para a próxima curiosidade na ordem embaralhada
turmaCuriosidadesProximoBotao.addEventListener('click', () => {
    indiceCuriosidadeAtual = (indiceCuriosidadeAtual + 1) % curiosidadesEmbaralhadas.length;
    mudarCuriosidade();
});

// Botão "Anterior": volta para a curiosidade anterior na ordem embaralhada
turmaCuriosidadesAnteriorBotao.addEventListener('click', () => {
    indiceCuriosidadeAtual = (indiceCuriosidadeAtual - 1 + curiosidadesEmbaralhadas.length) % curiosidadesEmbaralhadas.length;
    mudarCuriosidade();
});

// A primeira curiosidade é exibida quando a página carrega
window.addEventListener('load', () => {
    curiosidadesEmbaralhadas = embaralhar([...curiosidadesProgramacao]);
    indiceCuriosidadeAtual = 0;
    // O primeiro carregamento não precisa da animação de saída
    const curiosidade = curiosidadesEmbaralhadas[indiceCuriosidadeAtual];
    turmaCuriosidadesPerguntaEl.textContent = curiosidade.pergunta;
    turmaCuriosidadesRespostaEl.textContent = curiosidade.resposta;
    turmaCuriosidadesRespostaEl.classList.remove('turma-curiosidades-escondida');
    turmaCuriosidadesPerguntaEl.classList.add('fade-in');
    turmaCuriosidadesRespostaEl.classList.add('fade-in');
});