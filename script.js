let carrinho = [];
function adicionarAoCarrinho(produto, preco) {
  carrinho.push({ produto, preco });
  atualizarCarrinho();
}
function atualizarCarrinho() {
  const lista = document.getElementById("itens-carrinho");
  const total = document.getElementById("total");
  lista.innerHTML = "";
  let soma = 0;
  carrinho.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.produto} - R$ ${item.preco.toFixed(2)}`;
    lista.appendChild(li);
    soma += item.preco;
  });
  total.textContent = "Total: R$ " + soma.toFixed(2);
}
function abrirCarrinho() {
  document.getElementById("carrinho").style.display = "block";
}
function finalizarCompra() {
  const mensagem = encodeURIComponent("Pedido: " + carrinho.map(i => i.produto).join(", "));
  window.open(`https://wa.me/5511999999999?text=${mensagem}`);
}
