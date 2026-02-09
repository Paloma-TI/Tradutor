/* Logica de programção - Falar a lingua do computador
Algoritmo
    - Receita de bolo. Os passos na sequencia certa

JavaScript
    - Variáveis - pedacinho na memória do computador
        que voce pode guardar o que voce quiser

    - Funcoes
        pedacinho de código que, só executa quando
        eu chamo
        
    - Como se comunicar com o HTML
        Manipular a DOM

    console.log() mostra o que eu quiser na tela

    [x] Saber quando o botão foi clicado
    [ ] Pegar o texto que o usário digitou
    [ ] Mando para o servidor traduzir
    [ ] Receber a resposta do servidor (traducao)  
    [ ] Colocar o texto na tela   

    // JavaScript - scripts
    // HTML - document
    querySelector - procurar alguem no HTML
    value = valor - o texto que tem nele

   padrao =  https://api.mymemory.translated.net/get?q=
   traduzir =  Hello World!
   idioma = &langpair=pt-BR|en

   fetch / ferramenta do javascript para entrar em contato com um servidor
   await (Espere) - assincrono (assincrono & await)
   json (formato mais amigavel)
*/
// 1. Seleção de elementos
// Selecionando os elementos
const inputTexto = document.querySelector(".input-texto");
const traducaoTexto = document.querySelector(".traducao");
const idioma = document.querySelector(".idioma");

async function traduzir() {
    const texto = inputTexto.value.trim();
    if (!texto) return;

    // Pega apenas as 2 letras (ex: 'en') e garante que seja minúsculo
    const destino = idioma.value.split('-')[0].toLowerCase();
    
    // Monta o par de idiomas de forma ultra simples
    const parIdiomas = `pt|${destino}`;

    console.log("Tentando traduzir para:", destino); // Isso aparece no F12

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${parIdiomas}`;

    try {
        traducaoTexto.textContent = "Traduzindo...";
        const resposta = await fetch(url);
        const dados = await resposta.json();
        
        if (dados.responseData) {
            traducaoTexto.textContent = dados.responseData.translatedText;
        }
    } catch (erro) {
        traducaoTexto.textContent = "Erro de conexão.";
    }
}

function falar() {
    const textoParaLer = traducaoTexto.textContent;
    if (textoParaLer && textoParaLer !== "A Tradução aparecerá aqui...") {
        window.speechSynthesis.cancel();
        const mensagem = new SpeechSynthesisUtterance(textoParaLer);
        mensagem.lang = idioma.value; 
        mensagem.rate = 0.9;
        window.speechSynthesis.speak(mensagem);
    }
}

function ouvirVoz() {
    const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Reconhecimento) return alert("Microfone não suportado");
    const reconhecimentoVoz = new Reconhecimento();
    reconhecimentoVoz.lang = "pt-BR";
    reconhecimentoVoz.onresult = (evento) => {
        inputTexto.value = evento.results[0][0].transcript;
        traduzir();
    };
    reconhecimentoVoz.start();
}

function copiarTexto() {
    const textoParaCopiar = traducaoTexto.textContent;
    
    if (textoParaCopiar && textoParaCopiar !== "A Tradução aparecerá aqui...") {
        // Usa a API de área de transferência do navegador
        navigator.clipboard.writeText(textoParaCopiar).then(() => {
            alert("Tradução copiada para a área de transferência!");
        }).catch(err => {
            console.error("Erro ao copiar: ", err);
        });
    }
}