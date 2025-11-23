# Base de Conhecimento sobre Produção Visual

Bem-vindo! Este é um projeto de front-end que funciona como uma base de conhecimento interativa sobre os fundamentos da produção visual. A aplicação foi desenvolvida para ser uma ferramenta de aprendizado e consulta rápida, apresentando conceitos de forma clara e organizada, com um quiz dinâmico para testar seus conhecimentos.

![Demonstração do Projeto] https://paulo-bragantini.github.io/Base-Producao-Visual/



## ✨ Diferenciais e Funcionalidades

Este projeto vai além de uma simples exibição de conteúdo, focando na experiência do usuário e na interatividade.

*   **Busca Inteligente (Fuzzy Search)**: Utilizando a biblioteca **Fuse.js**, a barra de pesquisa é tolerante a erros de digitação e busca por relevância em títulos, subtópicos e explicações, garantindo que o usuário encontre o que precisa mesmo que não digite o termo exato.

*   **Quiz Interativo com Gamificação**:
    *   **Perguntas e Opções Aleatórias**: As perguntas e a ordem das respostas são embaralhadas a cada novo quiz, garantindo uma experiência única a cada tentativa.
    *   **Feedback Imediato**: O usuário recebe retorno instantâneo (visual e sonoro) se a resposta está correta ou incorreta, junto com uma explicação para reforçar o aprendizado.
    *   **Sistema de Pontuação e Recorde**: O progresso é recompensado com pontos, e o sistema salva a maior pontuação (`High Score`) no navegador usando `localStorage`.
    *   **Animações e Efeitos**: A biblioteca **Confetti.js** é usada para celebrar acertos, novos recordes e pontuações perfeitas, tornando a experiência mais divertida.

*   **Interface Dinâmica e Moderna**:
    *   **Renderização a partir de JSON**: Todo o conteúdo dos cards e do quiz é carregado de forma assíncrona a partir de arquivos `data.json` e `quiz.json`, facilitando a manutenção e expansão.
    *   **Animações de UI**: Efeitos sutis, como o placeholder animado na busca, cards que surgem suavemente na tela e um cabeçalho que se adapta ao scroll, criam uma navegação fluida.
    *   **Destaque de Termos Buscados**: O termo pesquisado é destacado nos resultados para facilitar a visualização.



## 🛠️ Tecnologias Utilizadas

O projeto foi construído com tecnologias web modernas e foco em performance e manutenibilidade.

*   **HTML5**: Estrutura semântica do conteúdo.
*   **CSS3**: Estilização, animações e responsividade.
*   **JavaScript (ES6+)**:
    *   Manipulação do DOM e interatividade.
    *   **Assincronicidade (`async/await`)** para carregar os dados do JSON sem travar a página.
    *   Lógica completa do quiz e da busca.
*   **JSON**: Utilizado como banco de dados para armazenar o conteúdo da base de conhecimento e as perguntas do quiz.

### Bibliotecas

*   **Fuse.js**: Para a funcionalidade de busca inteligente e tolerante a erros (fuzzy search).
*   **Confetti.js**: Para criar as animações de confetes no quiz.



## 🚀 Como Utilizar

Como este é um projeto de front-end puro, não há necessidade de um processo complexo de build ou instalação de dependências.

1.  **Faça o download ou clone o repositório:**
    *   Você pode baixar os arquivos como um arquivo ZIP diretamente do GitHub.
    *   Ou, se tiver o Git instalado, pode clonar o repositório em sua máquina local.

2.  **Abra o arquivo `index.html` no seu navegador.**

    *   Para uma melhor experiência e para garantir que a funcionalidade de `fetch` (que carrega os arquivos JSON) funcione corretamente, **é altamente recomendado usar um servidor local**. Uma maneira fácil de fazer isso é com a extensão **Live Server** do Visual Studio Code.
  


## 🏛️ Estrutura do Projeto

```
/
├── assets/
│   ├── images/       # Imagens dos cards
│   └── sounds/       # Efeitos sonoros do quiz
├── index.html        # Arquivo principal da aplicação
├── style.css         # Folha de estilos
├── script.js         # Lógica principal da aplicação (busca, renderização, quiz)
├── data.json         # Base de conhecimento (conteúdo dos cards)
├── quiz.json         # Perguntas, respostas e explicações do quiz
└── README.md         # Este arquivo
```

---

Feito por Paulo Henrique Medeiros Cabral Bragantini :)
---
