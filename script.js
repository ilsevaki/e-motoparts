// Carrinho de compras
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função principal para atualizar o carrinho
function atualizarCarrinho() {
  const lista = document.getElementById("itens-carrinho");
  const totalElement = document.getElementById("total");
  const contador = document.querySelector('.cart-count');
  
  lista.innerHTML = "";
  let soma = 0;
  
  // Atualiza contador (agora com regra do vermelho)
  if (carrinho.length > 0) {
    contador.textContent = carrinho.length;
    contador.style.display = "flex";
    contador.style.backgroundColor = "#ff0000"; // Vermelho
  } else {
    contador.style.display = "none";
  }

  // Restante da lógica do carrinho...
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

  totalElement.innerHTML = `
    <span>Total:</span>
    <span class="valor-total">R$ ${soma.toFixed(2)}</span>
  `;
}

// Funções modificadas para atualizar o contador
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
    carrinho[index].quantidade > 1 
      ? carrinho[index].quantidade -= 1 
      : carrinho.splice(index, 1);
    
    salvarCarrinho();
    atualizarCarrinho();
  }
}

// Funções auxiliares (mantenha essas)
function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  atualizarCarrinho();
  
  // Menu Hamburguer (seu código existente)
  const hamburguer = document.querySelector('.menu-hamburguer');
  if (hamburguer) {
    hamburguer.addEventListener('click', () => {
      document.querySelector('.menu-mobile').classList.toggle('active');
    });
  }
});
