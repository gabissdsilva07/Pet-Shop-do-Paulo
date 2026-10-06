(function () {
    var CHAVE = "petdobem-a11y";
    var raiz = document.documentElement;
  
    // Opções liga/desliga: [id, classe aplicada no <html>, texto do botão]
    var opcoes = [
      ["contraste", "a11y-contraste", "Alto contraste"],
      ["sublinhar", "a11y-sublinhar", "Sublinhar links"],
      ["fonte", "a11y-fonte-legivel", "Fonte legível"],
      ["animacao", "a11y-sem-animacao", "Parar animações"],
      ["cinza", "a11y-cinza", "Tons de cinza"]
    ];
  
    var estado = { tamanho: 100, ativos: {} };
  
    // ---------- salvar / carregar ----------
    function salvar() {
      try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
    }
  
    function carregar() {
      try {
        var s = JSON.parse(localStorage.getItem(CHAVE));
        if (s) estado = s;
      } catch (e) {}
    }
  
    // ---------- aplicar ----------
    function aplicar() {
      raiz.style.fontSize = estado.tamanho + "%";
      opcoes.forEach(function (o) {
        raiz.classList.toggle(o[1], !!estado.ativos[o[0]]);
      });
    }
  
    carregar();
    aplicar(); // aplica antes de montar o painel, para não "piscar"
  
    document.addEventListener("DOMContentLoaded", function () {
      // Link "pular para o conteúdo"
      var main = document.querySelector("main");
      if (main) {
        if (!main.id) main.id = "conteudo-principal";
        main.setAttribute("tabindex", "-1");
        var pular = document.createElement("a");
        pular.className = "a11y-pular";
        pular.href = "#" + main.id;
        pular.textContent = "Pular para o conteúdo";
        document.body.insertBefore(pular, document.body.firstChild);
      }
  
      // Botão que abre o painel
      var abrir = document.createElement("button");
      abrir.className = "a11y-abrir";
      abrir.type = "button";
      abrir.setAttribute("aria-label", "Abrir opções de acessibilidade");
      abrir.setAttribute("aria-expanded", "false");
      abrir.setAttribute("aria-controls", "a11y-painel");
      abrir.textContent = "♿";
  
      // Painel
      var painel = document.createElement("div");
      painel.className = "a11y-painel";
      painel.id = "a11y-painel";
      painel.setAttribute("role", "region");
      painel.setAttribute("aria-label", "Opções de acessibilidade");
      painel.hidden = true;
  
      var titulo = document.createElement("h2");
      titulo.textContent = "Acessibilidade";
      painel.appendChild(titulo);
  
      // Tamanho da fonte
      var grupoFonte = document.createElement("div");
      grupoFonte.className = "a11y-grupo";
      grupoFonte.appendChild(criarBotao("A−", "Diminuir texto", function () {
        estado.tamanho = Math.max(80, estado.tamanho - 10);
        atualizar();
      }));
      grupoFonte.appendChild(criarBotao("A+", "Aumentar texto", function () {
        estado.tamanho = Math.min(160, estado.tamanho + 10);
        atualizar();
      }));
      painel.appendChild(grupoFonte);
  
      // Opções liga/desliga
      var grupo = document.createElement("div");
      grupo.className = "a11y-grupo";
      opcoes.forEach(function (o) {
        var b = criarBotao(o[2], null, function () {
          estado.ativos[o[0]] = !estado.ativos[o[0]];
          atualizar();
        });
        b.classList.add("a11y-largo");
        b.setAttribute("aria-pressed", String(!!estado.ativos[o[0]]));
        b.dataset.id = o[0];
        grupo.appendChild(b);
      });
      painel.appendChild(grupo);
  
      // Restaurar
      var limpar = criarBotao("Restaurar padrão", null, function () {
        estado = { tamanho: 100, ativos: {} };
        atualizar();
      });
      limpar.classList.add("a11y-limpar");
      painel.appendChild(limpar);
  
      function atualizar() {
        aplicar();
        salvar();
        painel.querySelectorAll("[data-id]").forEach(function (b) {
          b.setAttribute("aria-pressed", String(!!estado.ativos[b.dataset.id]));
        });
      }
  
      function alternar(mostrar) {
        painel.hidden = !mostrar;
        abrir.setAttribute("aria-expanded", String(mostrar));
        if (mostrar) painel.querySelector("button").focus();
        else abrir.focus();
      }
  
      abrir.addEventListener("click", function () { alternar(painel.hidden); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !painel.hidden) alternar(false);
      });
  
      document.body.appendChild(painel);
      document.body.appendChild(abrir);
    });
  
    function criarBotao(texto, rotulo, aoClicar) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = texto;
      if (rotulo) b.setAttribute("aria-label", rotulo);
      b.addEventListener("click", aoClicar);
      return b;
    }
  })();