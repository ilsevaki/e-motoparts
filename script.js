// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Funções do carrinho
function atualizarCarrinho() {
  const lista = document.getElementById("itens-carrinho");
  const totalElement = document.getElementById("total");
  const contador = document.querySelector('.cart-count');
  
  lista.innerHTML = "";
  let soma = 0;
  let totalItens = 0;

  // Atualiza contador
  if (carrinho.length > 0) {
    totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    contador.textContent = totalItens;
    contador.classList.add('ativo');
  } else {
    contador.classList.remove('ativo');
  }

  // Preenche itens do carrinho
  carrinho.forEach(item => {
    const li = document.createElement("li");
    li.className = "item-carrinho";
    li.innerHTML = `
      <span>${item.produto} (${item.quantidade}x)</span>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      <button onclick="removerItemCompletamente('${item.id}')">Remover</button>
    `;
    lista.appendChild(li);
    soma += item.preco * item.quantidade;
  });

  totalElement.innerHTML = `Total: R$ ${soma.toFixed(2)}`;
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
}

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}


// Menu Hamburguer
const menuHamburguer = document.querySelector('.menu-hamburguer');
const menuMobile = document.querySelector('.menu-mobile');

menuHamburguer.addEventListener('click', function() {
  this.classList.toggle('active');
  menuMobile.classList.toggle('active');
  
  // Fecha todos os dropdowns ao abrir/fechar o menu
  document.querySelectorAll('.dropdown-mobile').forEach(dropdown => {
    dropdown.classList.remove('active');
  });
});

// Dropdown Mobile
document.querySelectorAll('.dropdown-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const parent = this.parentElement;
    
    // Fecha outros dropdowns abertos
    document.querySelectorAll('.dropdown-mobile').forEach(item => {
      if (item !== parent) {
        item.classList.remove('active');
      }
    });
    
    // Abre/fecha o dropdown clicado
    parent.classList.toggle('active');
  });
});

// Fecha o menu ao clicar fora
document.addEventListener('click', function(e) {
  if (!menuMobile.contains(e.target) && !menuHamburguer.contains(e.target)) {
    menuMobile.classList.remove('active');
    menuHamburguer.classList.remove('active');
    document.querySelectorAll('.dropdown-mobile').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }
});
// Carrossel
let currentSlide = 0;
const slides = document.querySelector('.carrossel-container');
const totalSlides = document.querySelectorAll('.carrossel-item').length;

function moveSlide(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  slides.style.transform = `translateX(-${currentSlide * 320}px)`;
}

// Modal do Carrinho
function toggleCarrinho() {
  const modal = document.getElementById("carrinho-modal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";
}

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
document.addEventListener('DOMContentLoaded', () => {
  atualizarCarrinho();
  
  // Menu
  document.querySelector('.menu-hamburguer')?.addEventListener('click', toggleMenu);
  
  // Dropdown mobile
  document.querySelector('.dropdown-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    this.classList.toggle('active');
    this.nextElementSibling.classList.toggle('active');
  });

  // Carrossel
  document.querySelector('.carrossel-anterior')?.addEventListener('click', () => moveSlide(-1));
  document.querySelector('.carrossel-proximo')?.addEventListener('click', () => moveSlide(1));

  // Carrinho
  document.getElementById('abrir-carrinho')?.addEventListener('click', toggleCarrinho);
  document.querySelector('.fechar-modal')?.addEventListener('click', toggleCarrinho);
  document.getElementById('finalizar-compra')?.addEventListener('click', () => {
    alert('Compra finalizada! Redirecionando para o pagamento...');
  });
});
