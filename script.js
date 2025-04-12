let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function adicionarAoCarrinho(produto, preco, idProduto) {
  // Verifica se o produto já está no carrinho
  const itemExistente = carrinho.find(item => item.id === idProduto);
  
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ 
      id: idProduto,
      produto, 
      preco, 
      quantidade: 1 
    });
  }
  
  atualizarCarrinho();
  salvarCarrinho();
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
    
    atualizarCarrinho();
    salvarCarrinho();
  }
}

function salvarCarrinho() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarCarrinho() {
  const lista = document.getElementById("itens-carrinho");
  const totalElement = document.getElementById("total");
  const contador = document.querySelector(".cart-count");
  
  lista.innerHTML = "";
  
  let soma = 0;
  let totalItens = 0;
  
  if (carrinho.length === 0) {
    lista.innerHTML = "<li class='carrinho-vazio'>Seu carrinho está vazio</li>";
    contador.style.display = "none";
  } else {
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
      totalItens += item.quantidade;
    });
    
    contador.textContent = totalItens;
    contador.style.display = "flex";
  }
  
  totalElement.innerHTML = `
    <span>Total:</span>
    <span class="valor-total">R$ ${soma.toFixed(2)}</span>
  `;
}

function removerItemCompletamente(idProduto) {
  carrinho = carrinho.filter(item => item.id !== idProduto);
  atualizarCarrinho();
  salvarCarrinho();
}

function abrirCarrinho() {
  document.getElementById("carrinho").classList.add("aberto");
  document.body.style.overflow = "hidden";
}

function fecharCarrinho() {
  document.getElementById("carrinho").classList.remove("aberto");
  document.body.style.overflow = "auto";
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }
  
  const itensFormatados = carrinho.map(item => 
    `${item.produto} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2)}`
  ).join("%0A");
  
  const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
  
  const mensagem = `Olá, gostaria de fazer o pedido:%0A%0A${itensFormatados}%0A%0ATotal: R$ ${total.toFixed(2)}%0A%0AInformações de entrega:`;
  
  window.open(`https://wa.me/5511962727074?text=${mensagem}`, '_blank');
}

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

// Inicializa o carrinho quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  atualizarCarrinho();
  
  // Fecha o carrinho ao clicar fora
  document.getElementById("carrinho").addEventListener('click', (e) => {
    if (e.target.id === "carrinho") {
      fecharCarrinho();
    }
  });
});
