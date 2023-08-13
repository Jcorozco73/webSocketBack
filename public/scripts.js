

  const socket = io();

  
  document.getElementById('productoForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const productName = event.target.productName.value;

    const product = { name: productName };

    socket.emit('createProduct', product);

    event.target.productName.value = '';
  });

  socket.on('updateProducts', (products) => {

    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach((product) => {
      const listItem = document.createElement('li');
      listItem.textContent = product.name;
      productList.appendChild(listItem);
    });
  });
