let cardContainer = document.querySelector(".card-container");
let searchInput = document.querySelector("#campo-busca"); // Corrigido para usar o ID do HTML
let clearButton = document.querySelector("#clear-search-btn");
let backToTopButton = document.getElementById("back-to-top-btn");
let header = document.querySelector("header"); // Seleciona o cabeçalho
let dados = [];
let fuse; // Variável para guardar a instância do Fuse.js

// Executa a função para carregar os dados assim que a página carregar
document.addEventListener("DOMContentLoaded", iniciar);

async function iniciarBusca() {
    buscarCards(); // A função do botão agora é apenas buscar
}

async function iniciar() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();

        // Configura o Fuse.js com os dados e as opções de busca
        const options = {
            keys: ['tópico', 'subtópico', 'explicação'], // Campos onde a busca será feita
            includeScore: true, // Inclui a pontuação de relevância
            threshold: 0.3, // Nível de tolerância (0 = exato, 1 = qualquer coisa). 0.3 é mais preciso.
            ignoreLocation: true, // Busca em todo o texto, não apenas no início
        };

        // Remove o card de introdução dos dados que serão indexados para a busca
        const dadosParaBusca = dados.filter(dado => dado.tópico !== "Introdução");

        // Cria a instância do Fuse
        fuse = new Fuse(dadosParaBusca, options);

        renderizarCards(dados);

        // Adiciona a busca com a tecla "Enter"
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                buscarCards();
            }
        });

        // Adiciona um ouvinte para restaurar os cards quando a busca é limpa
        searchInput.addEventListener("input", () => {
            // Mostra ou esconde o botão de limpar
            if (searchInput.value.length > 0) {
                clearButton.classList.add('visible');
            } else {
                clearButton.classList.remove('visible');
            }

            if (searchInput.value === "") {
                renderizarCards(dados);
            }
        });

        // Adiciona a funcionalidade de limpar ao botão 'X'
        clearButton.addEventListener("click", () => {
            limparBusca();
        });
    } catch (error) {
        console.error("Falha ao buscar os dados:", error);
    }

    typePlaceholder(); // Inicia o efeito de digitação do placeholder
}

function renderizarCards(dados, termoBusca = "") {
    cardContainer.innerHTML = ""; // Limpa o container antes de renderizar novos cards

    // Função auxiliar para destacar o texto
    const highlightText = (text, highlight) => {
        if (!highlight.trim()) {
            return text;
        }
        // Cria uma expressão regular para encontrar todas as ocorrências do termo de busca, ignorando maiúsculas/minúsculas
        const regex = new RegExp(`(${highlight})`, 'gi');
        // Substitui o termo encontrado por ele mesmo, mas envolvido em um span com a classe 'highlight'
        return text.replace(regex, '<span class="highlight">$1</span>');
    };

    dados.forEach((dado, index) => {
        let article = document.createElement("article");
        article.classList.add("card");

        if (dado.tópico === "Introdução") {
            article.classList.add("introducao-card");
        }

        // Adiciona a imagem apenas se ela existir E não houver uma busca ativa
        if (dado.imagem && !termoBusca) {
            const img = document.createElement('img');
            img.src = dado.imagem;
            img.alt = `Imagem sobre ${dado.tópico}`; // Texto alternativo para acessibilidade
            img.className = 'card-image';
            // A imagem é adicionada primeiro
            article.appendChild(img); // Adiciona a imagem ao card
        }

        // Aplica o destaque nos campos de texto
        const topicoDestacado = highlightText(dado.tópico, termoBusca);
        const subtopicoDestacado = dado.subtópico ? highlightText(dado.subtópico, termoBusca) : '';
        const explicacaoDestacada = highlightText(dado.explicação, termoBusca);

        // Cria um container para o conteúdo de texto
        const textContent = document.createElement('div');
        
        // Cria o título com o ícone, se existir
        let conteudo = '<h2>';
         if (dado.icone_topico) {
             conteudo += `<i class="${dado.icone_topico}"></i> `;
         }
         conteudo += `${topicoDestacado}</h2>`;
        if (dado.subtópico) {
            conteudo += `<h4>${subtopicoDestacado}</h4>`;
        }
        conteudo += `<p>${explicacaoDestacada}</p>`;
        if (dado.link) {
            // Verifica se um ícone foi especificado no JSON
            if (dado.icone) {
                conteudo += `<a href="${dado.link}" target="_blank" rel="noopener noreferrer"><i class="${dado.icone}"></i> Documento de apoio</a>`;
            } else {
                conteudo += `<a href="${dado.link}" target="_blank" rel="noopener noreferrer">Documento de apoio</a>`;
            }
        }

        // Adiciona o conteúdo de texto ao container
        textContent.innerHTML = conteudo;
        // Adiciona o container de texto ao card, depois da imagem
        article.appendChild(textContent);
        cardContainer.appendChild(article);

        // Adiciona a classe de animação com um pequeno atraso para garantir que ela seja re-executada
        setTimeout(() => {
            // O atraso da transição é aplicado aqui
            article.style.transitionDelay = `${index * 0.1}s`;
            article.classList.add('card-animate');
        }, 10);
    });
}

// Nova função para filtrar e renderizar os cards com base na busca
function buscarCards() {
    const termoBusca = searchInput.value.toLowerCase();

    if (!termoBusca.trim()) {
        renderizarCards(dados);
        return;
    }

    // Usa o Fuse.js para buscar
    const resultados = fuse.search(termoBusca);
    // O resultado do Fuse é uma lista de objetos com a propriedade 'item'
    const dadosFiltrados = resultados.map(resultado => resultado.item);

    if (dadosFiltrados.length > 0) {
        renderizarCards(dadosFiltrados, termoBusca);
    } else {
        cardContainer.innerHTML = `
            <div class="no-results" style="text-align: center; padding: 40px 20px;">
                <p style="font-size: 1.5em; color: #666;">Nenhum resultado encontrado :(</p>
            </div>
        `;
    }
}

// Nova função para limpar o campo de busca e restaurar os cards
function limparBusca() {
    searchInput.value = "";
    clearButton.classList.remove('visible');
    renderizarCards(dados);
    searchInput.focus(); // Devolve o foco para a barra de pesquisa
}

// --- LÓGICA PARA HEADER E BOTÃO VOLTAR AO TOPO ---

window.addEventListener('scroll', () => {
    // Adiciona/remove a classe 'header-scrolled' ao cabeçalho
    if (window.scrollY > 50) { // 50px de rolagem para ativar
        header.classList.add('header-scrolled');
        backToTopButton.style.opacity = '1';
        backToTopButton.style.pointerEvents = 'auto';
    } else {
        header.classList.remove('header-scrolled');
        backToTopButton.style.opacity = '0';
        backToTopButton.style.pointerEvents = 'none';
    }
});

// Adiciona o evento de clique ao botão "Voltar ao Topo"
backToTopButton.addEventListener('click', () => {
    scrollToTop();
});

// --- LÓGICA PARA O BOTÃO VOLTAR AO TOPO ---

// Função para rolar a página suavemente para o topo
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- LÓGICA PARA EFEITO DE DIGITAÇÃO NO PLACEHOLDER ---

const staticPlaceholder = "Procure por uma palavra-chave. Ex: ";
const dynamicTexts = [
    "composição",
    "teoria das cores",
    "iluminação"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false; // Controla se está digitando ou apagando

function typePlaceholder() {
    const currentText = dynamicTexts[textIndex];
    // Velocidades ajustadas para serem mais lentas
    const typingSpeed = isDeleting ? 50 : 100; 

    if (isDeleting) {
        // Apagando o texto dinâmico
        searchInput.placeholder = staticPlaceholder + currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Digitando o texto dinâmico
        searchInput.placeholder = staticPlaceholder + currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    // Se a palavra dinâmica terminou de ser digitada, espera 2s e começa a apagar
    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => { isDeleting = true; }, 1500); // Diminui a pausa antes de apagar
    } 
    // Se a palavra dinâmica terminou de ser apagada, vai para a próxima e começa a digitar
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % dynamicTexts.length;
    }

    // Chama a função recursivamente para continuar a animação
    setTimeout(typePlaceholder, typingSpeed);
}

// --- LÓGICA PARA O QUIZ ---

const startQuizBtn = document.getElementById('start-quiz-btn');
const quizModal = document.getElementById('quiz-modal');
const closeQuizBtn = document.getElementById('close-quiz-btn');
const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const nextQuestionBtn = document.getElementById('next-question-btn');
const confirmAnswerBtn = document.getElementById('confirm-answer-btn');
const quizResultsEl = document.getElementById('quiz-results');
const scoreTextEl = document.getElementById('score-text');
const scoreFeedbackEl = document.getElementById('score-feedback');
const highScoreTextEl = document.getElementById('high-score-text'); // Novo elemento
const restartQuizBtn = document.getElementById('restart-quiz-btn');
const quizContainer = document.getElementById('quiz-container');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let currentCorrectIndex; // Armazena o índice correto da pergunta atual após o embaralhamento
let selectedAnswer = { index: null, button: null }; // Armazena a resposta selecionada pelo usuário
let previousCorrectIndex = -1; // Armazena o índice correto da questão anterior para evitar repetição

// Pré-carrega os sons para uma resposta mais rápida
const correctSound = new Audio('assets/sounds/correct.mp3');
const incorrectSound = new Audio('assets/sounds/incorrect.mp3');
correctSound.volume = 0.7; // Define o volume para 70%
incorrectSound.volume = 0.3; // Define o volume para 50% (0.0 a 1.0)

async function loadQuizData() {
    if (quizData.length === 0) {
        try {
            const res = await fetch('quiz.json');
            quizData = await res.json();
        } catch (error) {
            console.error("Falha ao carregar os dados do quiz:", error);
            feedbackContainer.innerText = "Não foi possível carregar o quiz. Tente novamente mais tarde.";
        }
    }
}

// Função para embaralhar um array (algoritmo Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Troca de elementos
    }
}

async function startQuiz() {
    await loadQuizData(); // Garante que os dados estão carregados

    currentQuestionIndex = 0;
    score = 0;
    shuffleArray(quizData); // Embaralha as perguntas a cada novo quiz
    quizModal.classList.add('show');
    // quizModal.style.display = 'flex'; // A classe 'show' já cuida disso
    quizResultsEl.style.display = 'none';
    quizContainer.style.display = 'block';
    confirmAnswerBtn.classList.remove('visible'); // Garante que o botão de confirmar não apareça inicialmente
    nextQuestionBtn.classList.remove('visible');
    progressContainer.style.display = 'block';
    feedbackContainer.innerHTML = '';

    // Remove classes de animação para garantir um estado limpo
    questionEl.classList.remove('quiz-fade-out', 'quiz-fade-in');
    optionsContainer.classList.remove('quiz-fade-out', 'quiz-fade-in');

    showQuestion();
}

function showQuestion() {
    updateProgressBar();

    feedbackContainer.innerHTML = '';    

    confirmAnswerBtn.style.display = 'none';
    selectedAnswer = { index: null, button: null }; // Reseta a seleção
    nextQuestionBtn.style.display = 'none';

    const currentQuestion = quizData[currentQuestionIndex];

    const correctAnswerText = currentQuestion.options[currentQuestion.answer];
    
    // Cria uma cópia das opções e as embaralha
    const shuffledOptions = [...currentQuestion.options];
    shuffleArray(shuffledOptions);
    
    // Encontra o novo índice da resposta correta no array embaralhado
    currentCorrectIndex = shuffledOptions.indexOf(correctAnswerText);
    
    questionEl.innerText = currentQuestion.question;
    optionsContainer.innerHTML = '';

    shuffledOptions.forEach((option, index) => {
        const button = document.createElement('button');
        const prefix = String.fromCharCode(65 + index); // Gera 'A', 'B', 'C', 'D'
        button.innerText = `${prefix}) ${option}`;
        button.classList.add('option-btn');
        button.addEventListener('click', () => handleOptionClick(index, button));
        optionsContainer.appendChild(button);
    });

    // Cria e adiciona o container de ações se ele não existir
    if (!document.getElementById('quiz-actions-container')) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'quiz-actions';
        actionsContainer.id = 'quiz-actions-container';
        quizContainer.appendChild(actionsContainer);
    }
}

function handleOptionClick(selectedIndex, selectedButton) {
    // Remove a classe 'selected' de qualquer outro botão
    Array.from(optionsContainer.children).forEach(btn => {
        btn.classList.remove('selected');
    });

    // Adiciona a classe 'selected' ao botão clicado
    selectedButton.classList.add('selected');

    // Armazena a resposta selecionada
    selectedAnswer = { index: selectedIndex, button: selectedButton };

    // Mostra o botão de confirmar
    const actionsContainer = document.getElementById('quiz-actions-container');
    actionsContainer.innerHTML = ''; // Limpa ações anteriores
    actionsContainer.appendChild(confirmAnswerBtn);
    confirmAnswerBtn.style.display = 'inline-block'; // Garante que ele seja exibido
}

function confirmAndCheckAnswer() {
    const currentQuestion = quizData[currentQuestionIndex];
    const correctIndex = currentCorrectIndex; // Usa o índice correto atualizado
    const { index: selectedIndex, button: selectedButton } = selectedAnswer;
    confirmAnswerBtn.style.display = 'none'; // Esconde o botão de confirmar
    // Desabilita todos os botões após uma resposta
    Array.from(optionsContainer.children).forEach(btn => {
        btn.disabled = true;
    });

    if (selectedIndex === correctIndex) {
        score += 100; // Cada acerto vale 100 pontos
        correctSound.play(); // Toca o som de acerto
        selectedButton.classList.add('correct');

        // Lança o confete a partir do botão da resposta correta
        const rect = selectedButton.getBoundingClientRect();
        const origin = {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight
        };

        confetti({
            particleCount: 100,
            spread: 70,
            origin: origin,
            colors: ['#28a745', '#ffffff'], // Verde do acerto e branco
            zIndex: 1002 // Garante que o confete fique sobre o modal e outros elementos
        });





        // Cria e exibe o popup de pontuação
        const scorePopup = document.createElement('div');
        scorePopup.innerText = '+100';
        scorePopup.className = 'score-popup';
        quizContainer.appendChild(scorePopup);

        // Remove o elemento do DOM após a animação terminar
        setTimeout(() => scorePopup.remove(), 1500);

        feedbackContainer.innerHTML = `<p class="correct-feedback">Correto! ${currentQuestion.explanation}</p>`;
    } else {
        incorrectSound.play(); // Toca o som de erro
        selectedButton.classList.add('incorrect');
        optionsContainer.children[correctIndex].classList.add('correct'); // Mostra a resposta correta em verde
        feedbackContainer.innerHTML = `<p class="incorrect-feedback">Incorreto. ${currentQuestion.explanation}</p>`;
    }

    const actionsContainer = document.getElementById('quiz-actions-container');
    actionsContainer.appendChild(nextQuestionBtn);
    nextQuestionBtn.style.display = 'inline-block'; // Garante que ele seja exibido
}

function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        // 1. Remove a classe de 'fade-in' e adiciona a de 'fade-out'
        questionEl.classList.remove('quiz-fade-in');
        optionsContainer.classList.remove('quiz-fade-in');
        questionEl.classList.add('quiz-fade-out');
        optionsContainer.classList.add('quiz-fade-out');

        // 2. Aguarda a animação de fade-out terminar (300ms, conforme CSS)
        setTimeout(() => {
            // 3. Atualiza o conteúdo da questão
            showQuestion();
            // 4. Remove a classe 'fade-out' e adiciona a 'fade-in' para a nova questão aparecer
            questionEl.classList.remove('quiz-fade-out');
            optionsContainer.classList.remove('quiz-fade-out');
            questionEl.classList.add('quiz-fade-in');
            optionsContainer.classList.add('quiz-fade-in');
        }, 300);
    } else {
        // Se for a última questão, espera o fade-out antes de mostrar os resultados
        setTimeout(showResults, 300);
    }
}

function showResults() {
    progressContainer.style.display = 'none';
    quizContainer.style.display = 'none';
    quizResultsEl.style.display = 'block';

    // Lógica do High Score
    const highScore = parseInt(localStorage.getItem('quizHighScore')) || 0;
    let isNewHighScore = false;

    if (score > highScore) {
        localStorage.setItem('quizHighScore', score);
        isNewHighScore = true;
    }

    // Atualiza o texto do recorde para mostrar o valor mais alto (o novo ou o antigo)
    highScoreTextEl.innerHTML = `Seu recorde: <strong>${isNewHighScore ? score : highScore}</strong>`;
    if (isNewHighScore) {
        highScoreTextEl.innerHTML += ' <span style="color: #ffd700;">(NOVO RECORDE!)</span>';

        // Lança confetes dourados para celebrar o novo recorde
        const duration = 2 * 1000; // Duração da animação em milissegundos
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1002 };
        const goldenColors = ['#ffd700', '#ffc400', '#ffec7eff', '#ffffff'];

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: goldenColors });
        }, 250);
    }

    const acertos = score / 100;
    const totalPerguntas = quizData.length;
    
    scoreTextEl.innerHTML = `Sua pontuação: <strong>${score}</strong><br><small>(${acertos} de ${totalPerguntas} acertos)</small>`;

    let feedbackMessage = '';

    // --- Lógica de celebração ---

    // Define as faixas de pontuação, mensagens e animações correspondentes
    if (score === 1000) { // Pontuação máxima
        feedbackMessage = "PERFEITO! Você domina o assunto. Parabéns por gabaritar o quiz!";
        // Animação de comemoração maior, com confetes saindo das laterais
        confetti({
            particleCount: 200,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ffec7eff', '#ffffff', '#ffd700'],
            zIndex: 1002
        });
        confetti({
            particleCount: 200,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ffec7eff', '#ffffff', '#ffd700'],
            zIndex: 1002
        });
    } else if (score >= 800) { // Pontuação alta
        feedbackMessage = "Excelente! Você tem um ótimo conhecimento sobre produção visual. Seu olhar está afiado!";        if (!isNewHighScore) { // Só lança confete se NÃO for um novo recorde (pois o recorde já tem sua própria animação)
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 1002, colors: ['#ffd700', '#ffffff'] });
        }
    } else if (score >= 500) { // Pontuação intermediária
        feedbackMessage = "Bom trabalho! Você está no caminho certo. Para aprimorar ainda mais, que tal reler alguns tópicos da Base de Conhecimento?";
    } else { // Pontuação baixa
        feedbackMessage = "Não desanime! O aprendizado é um processo contínuo. Recomendamos explorar a Base de Conhecimento novamente para fortalecer seus conceitos. Você consegue!";
    }
    scoreFeedbackEl.innerText = feedbackMessage;
}

function closeQuiz() {
    quizModal.classList.remove('show');
    // quizModal.style.display = 'none'; // A classe 'show' já cuida disso
}

function updateProgressBar() {
    const progressPercent = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressText.innerText = `Questão ${currentQuestionIndex + 1} de ${quizData.length}`;
}

// Event Listeners do Quiz
startQuizBtn.addEventListener('click', startQuiz);

closeQuizBtn.addEventListener('click', closeQuiz);
nextQuestionBtn.addEventListener('click', showNextQuestion);
confirmAnswerBtn.addEventListener('click', confirmAndCheckAnswer);

// O botão de reiniciar agora também chama a função async startQuiz
restartQuizBtn.addEventListener('click', startQuiz);

// Fecha o modal se clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target === quizModal) {
        closeQuiz();
    }
});