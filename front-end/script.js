const productList = document.getElementById('product-list');
const form = document.getElementById('product-form');

// Função para exibir a lista de produtos
async function fetchProducts() {
  const response = await fetch('http://localhost:3001/products');
  const products = await response.json();
  renderProducts(products);
}

// Função para renderizar os produtos na interface
function renderProducts(products) {
  productList.innerHTML = '';

  products.forEach((product) => {
    const item = document.createElement('div');
    item.classList.add('product-item'); // Adiciona a classe 'product-item' ao elemento div

    item.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>Preço: $${parseFloat(product.price).toFixed(2)}</p>
      <button class="edit-button" onclick="editProduct(${product.id})">Editar</button>
      <button class="delete-button" onclick="deleteProduct(${product.id})">Deletar</button>
    `;
    productList.appendChild(item);
  });
}

// Função para exibir o formulário de criação de produto
function showCreateForm() {
  form.innerHTML = `
    <h2>Criação de Produto</h2>
    <input type="text" id="name-input" placeholder="Nome" required />
    <input type="text" id="description-input" placeholder="Descrição" required />
    <input type="number" id="price-input" placeholder="Preço" required />
    <button onclick="createProduct()">Criar</button>
  `;
}

// Função para criar um novo produto
async function createProduct() {
  const nameInput = document.getElementById('name-input');
  const descriptionInput = document.getElementById('description-input');
  const priceInput = document.getElementById('price-input');

  const product = {
    name: nameInput.value,
    description: descriptionInput.value,
    price: parseFloat(priceInput.value),
  };

  try {
    const response = await fetch('http://localhost:3001/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      fetchProducts();
      nameInput.value = '';
      descriptionInput.value = '';
      priceInput.value = '';
    } else {
      throw new Error('Failed to create product');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Função para exibir o formulário de edição de produto
async function editProduct(id) {
  const response = await fetch(`http://localhost:3001/products/${id}`);
  const product = await response.json();

  form.innerHTML = `
    <h2>Editar Produto</h2>
    <input type="text" id="name-input" placeholder="Nome" value="${product.name}" required />
    <input type="text" id="description-input" placeholder="Descrição" value="${product.description}" required />
    <input type="number" id="price-input" placeholder="Preço" value="${product.price}" required />
    <button onclick="updateProduct(${product.id})">Atualizar</button>
  `;
}

// Função para atualizar um produto
async function updateProduct(id) {
  const nameInput = document.getElementById('name-input');
  const descriptionInput = document.getElementById('description-input');
  const priceInput = document.getElementById('price-input');

  const product = {
    name: nameInput.value,
    description: descriptionInput.value,
    price: parseFloat(priceInput.value),
  };

  const response = await fetch(`http://localhost:3001/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (response.ok) {
    fetchProducts()
    showCreateForm()
  }
}

// Função para excluir um produto
async function deleteProduct(id) {
  const response = await fetch(`http://localhost:3001/products/${id}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    fetchProducts();
    reloadPage(); // Recarrega a página após a exclusão do produto
  }
}

// Função para recarregar a página
function reloadPage() {
  window.location.reload();
}

// Evento para exibir o formulário de criação ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  showCreateForm();
  fetchProducts();
});
