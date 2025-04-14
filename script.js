// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Elementos DOM
const elementos = {
  listaCarrinho: document.getElementById("itens-carrinho"),
  totalElement: document.getElementById("total"),
  contador: document.querySelector('.cart-count'),
  menuHamburguer: document.querySelector('.menu-hamburguer'),
  menuPrincipal: document.querySelector('.menu-principal'),
  slides: document.querySelector('.carrossel-container'),
  modalCarrinho: document.getElementById("carrinho-modal"),
  dropdowns: document.querySelectorAll('.dropdown')
};

// Funções do carrinho
function atualizarCarrinho() {
  elementos.listaCarrinho.innerHTML = "";
  let soma = 0;
  let totalItens = 0;

  if (carrinho.length > 0) {
    totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    elementos.contador.textContent = totalItens;
    elementos.contador.classList.add('ativo');
  } else {
    elementos.contador.textContent = "0";
    elementos.contador.classList.remove('ativo');
  }

  carrinho.forEach(item => {
    const li = document.createElement("li");
    li.className = "item-carrinho";
    li.innerHTML = `
      <span>${item.produto}</span>
      <div class="quantidade-controle">
        <button onclick="alterarQuantidade('${item.id}', -1)">−</button>
        <span>${item.quantidade}x</span>
        <button onclick="alterarQuantidade('${item.id}', 1)">+</button>
      </div>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      <button class="btn-remover" onclick="removerItemCompletamente('${item.id}')">×</button>
    `;
    elementos.listaCarrinho.appendChild(li);
    soma += item.preco * item.quantidade;
  });

  elementos.totalElement.innerHTML = `Total: R$ ${soma.toFixed(2)}`;
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find(item => item.id === id);
  if (item) {
    item.quantidade = Math.max(1, item.quantidade + delta);
    salvarCarrinho();
    atualizarCarrinho();
  }
}

function adicionarAoCarrinho(produto, preco, idProduto) {
  const itemExistente = carrinho.find(item => item.id === idProduto);
  
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ id: idProduto, produto, preco, quantidade: 1 });
  }
  
  salvarCarrinho();
  atualizarCarrinho();
  mostrarNotificacao(`${produto} adicionado ao carrinho!`);
}

function removerItemCompletamente(idProduto) {
  carrinho = carrinho.filter(item => item.id !== idProduto);
  salvarCarrinho();
  atualizarCarrinho();
  mostrarNotificacao('Item removido do carrinho!');
}

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Menu Mobile
if (elementos.menuHamburguer && elementos.menuPrincipal) {
  elementos.menuHamburguer.addEventListener('click', function(e) {
    e.stopPropagation();
    this.classList.toggle('active');
    elementos.menuPrincipal.classList.toggle('active');
  });

  // Fecha o menu ao clicar fora
  document.addEventListener('click', function(e) {
    if (!elementos.menuPrincipal.contains(e.target) && 
        !elementos.menuHamburguer.contains(e.target)) {
      elementos.menuPrincipal.classList.remove('active');
      elementos.menuHamburguer.classList.remove('active');
    }
  });
}

// Dropdowns
elementos.dropdowns.forEach(dropdown => {
  const link = dropdown.querySelector('a');
  
  link.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      elementos.dropdowns.forEach(d => {
        if (d !== dropdown) d.classList.remove('active');
      });
      dropdown.classList.toggle('active');
    }
  });

  dropdown.addEventListener('mouseenter', function() {
    if (window.innerWidth > 768) {
      this.classList.add('active');
    }
  });

  dropdown.addEventListener('mouseleave', function() {
    if (window.innerWidth > 768) {
      this.classList.remove('active');
    }
  });
});

// Carrossel
let currentSlide = 0;
const totalSlides = document.querySelectorAll('.carrossel-item').length;

function moveSlide(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  if (elementos.slides) {
    elementos.slides.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
}

// Modal do Carrinho
function toggleCarrinho() {
  if (elementos.modalCarrinho) {
    elementos.modalCarrinho.style.display = 
      elementos.modalCarrinho.style.display === "block" ? "none" : "block";
  }
}

elementos.modalCarrinho?.addEventListener('click', function(e) {
  if (e.target === this) toggleCarrinho();
});

// Notificação
function mostrarNotificacao(mensagem) {
  const notificacao = document.createElement("div");
  notificacao.className = "notificacao";
  notificacao.textContent = mensagem;
  document.body.appendChild(notificacao);
  
  setTimeout(() => {
    notificacao.classList.add("fade-out");
    setTimeout(() => notificacao.remove(), 500);
  }, 3000);
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  atualizarCarrinho();
  
  // Carrossel
  document.querySelector('.carrossel-anterior')?.addEventListener('click', () => moveSlide(-1));
  document.querySelector('.carrossel-proximo')?.addEventListener('click', () => moveSlide(1));

  // Carrinho
  document.getElementById('abrir-carrinho')?.addEventListener('click', toggleCarrinho);
  document.querySelector('.fechar-modal')?.addEventListener('click', toggleCarrinho);
  document.getElementById('finalizar-compra')?.addEventListener('click', function() {
    if (carrinho.length === 0) {
      mostrarNotificacao("Seu carrinho está vazio!");
      return;
    }
    alert('Compra finalizada! Redirecionando para o pagamento...');
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    toggleCarrinho();
  });
});
