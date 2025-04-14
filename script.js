// Carrinho de Compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Elementos DOM
const elementos = {
  carrinhoIcon: document.querySelector('.carrinho-icon'),
  cartCount: document.querySelector('.cart-count'),
  modalCarrinho: document.getElementById('carrinho-modal'),
  listaCarrinho: document.getElementById('itens-carrinho'),
  totalElement: document.getElementById('total')
};

// Funções do Carrinho
function atualizarCarrinho() {
  elementos.listaCarrinho.innerHTML = '';
  let total = 0;
  
  carrinho.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.nome} (${item.quantidade}x)</span>
      <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      <button onclick="removerItem('${item.id}')">×</button>
    `;
    elementos.listaCarrinho.appendChild(li);
    total += item.preco * item.quantidade;
  });
  
  elementos.totalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
  elementos.cartCount.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  elementos.cartCount.style.display = carrinho.length > 0 ? 'flex' : 'none';
}

function adicionarAoCarrinho(nome, preco, id) {
  const itemExistente = carrinho.find(item => item.id === id);
  
  if (itemExistente) {
    itemExistente.quantidade++;
  } else {
    carrinho.push({ id, nome, preco, quantidade: 1 });
  }
  
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function removerItem(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  atualizarCarrinho();
}

// Event Listeners
elementos.carrinhoIcon.addEventListener('click', () => {
  elementos.modalCarrinho.style.display = 'block';
});

document.querySelector('.fechar-modal').addEventListener('click', () => {
  elementos.modalCarrinho.style.display = 'none';
});

// Carrossel
let currentSlide = 0;
const slides = document.querySelectorAll('.carrossel-item');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(-${index * 100}%)`;
  });
}

document.querySelector('.carrossel-proximo').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

document.querySelector('.carrossel-anterior').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

// Menu Mobile
document.querySelector('.menu-mobile').addEventListener('click', () => {
  document.querySelector('.menu-principal').classList.toggle('ativo');
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  atualizarCarrinho();
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 3000);
});
