// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para atualizar o carrinho
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
      <span class="nome-produto">${item.produto}</span>
      <div class="controles-quantidade">
        <button class="btn-quantidade" onclick="removerDoCarrinho('${item.id}')">−</button>
        <span class="quantidade">${item.quantidade}</span>
        <button class="btn-quantidade" onclick="adicionarAoCarrinho('${item.produto}', ${item.preco}, '${item.id}')">+</button>
      </div>
      <span class="preco">R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
      <button class="btn-remover" onclick="removerItemCompletamente('${item.id}')">×</button>
    `;
    lista.appendChild(li);
    soma += item.preco * item.quantidade;
  });

  // Atualiza total
  totalElement.innerHTML = `
    <span>Total:</span>
    <span class="valor-total">R$ ${soma.toFixed(2)}</span>
  `;
}

// Funções do carrinho
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

function removerDoCarrinho(idProduto) {
  const index = carrinho.findIndex(item => item.id === idProduto);
  
  if (index !== -1) {
    if (carrinho[index].quantidade > 1) {
      carrinho[index].quantidade -= 1;
    } else {
      carrinho.splice(index, 1);
    }
    salvarCarrinho();
    atualizarCarrinho();
  }
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
function toggleMenu() {
  const hamburguer = document.querySelector('.menu-hamburguer');
  const menuMobile = document.querySelector('.menu-mobile');
  
  hamburguer.classList.toggle('active');
  menuMobile.classList.toggle('active');
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
  
  // Eventos do menu
  document.querySelector('.menu-hamburguer')?.addEventListener('click', toggleMenu);
  
  // Eventos do dropdown mobile
  document.querySelector('.dropdown-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    this.classList.toggle('active');
    this.nextElementSibling.classList.toggle('active');
  });
});
