document.addEventListener("DOMContentLoaded", () => {
    const productosContainer = document.querySelector("#productos-container");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");
    const carritoItems = document.getElementById("carrito-items");
    const totalElement = document.getElementById("total");
    const limpiarCarritoBtn = document.getElementById("limpiar-carrito");
    const finalizarCompraBtn = document.getElementById("finalizar-compra");

    if (!productosContainer || !prevBtn || !nextBtn || !pageInfo || !carritoItems || !totalElement || !limpiarCarritoBtn || !finalizarCompraBtn) {
        console.error("Uno o más elementos necesarios no se encontraron en el DOM.");
        return;
    }

    let currentPage = 1;
    const limit = 3;
    let totalProductos = 0;
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Función para renderizar el carrito
    function renderCarrito() {
        carritoItems.innerHTML = '';
        let total = 0;
        carrito.forEach(producto => {
            total += producto.subtotal;
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${producto.title}</td>
                <td>$${producto.price}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.subtotal.toFixed(2)}</td>
            `;
            carritoItems.appendChild(tr);
        });
        totalElement.textContent = total.toFixed(2);
    }

    // Función para añadir un producto al carrito
    function agregarAlCarrito(producto) {
        const existingProduct = carrito.find(item => item.id === producto.id);
        if (existingProduct) {
            existingProduct.cantidad += 1;
            existingProduct.subtotal = existingProduct.cantidad * existingProduct.price;
        } else {
            carrito.push({
                ...producto,
                cantidad: 1,
                subtotal: producto.price
            });
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderCarrito();
    }

    // Función para traer productos desde la API
    function fetchProductos(page = 1) {
        const skip = (page - 1) * limit;
        fetch(`https://dummyjson.com/products?skip=${skip}&limit=${limit}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                totalProductos = data.total;
                productosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos

                data.products.forEach(product => {
                    const cardDiv = document.createElement('div');
                    cardDiv.classList.add('col-md-4', 'mb-4');
                    cardDiv.innerHTML = `
                        <div class="card">
                            <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <p class="card-text">${product.description}</p>
                                <p class="card-text fw-bold">Precio: $${product.price}</p>
                                <button class="btn btn-primary">Agregar al carrito</button>
                            </div>
                        </div>
                    `;
                    cardDiv.querySelector("button").addEventListener("click", () => agregarAlCarrito(product));
                    productosContainer.appendChild(cardDiv);
                });

                pageInfo.textContent = `Página ${currentPage}`;
                prevBtn.disabled = currentPage === 1;
                nextBtn.disabled = (currentPage * limit) >= totalProductos;
            })
            .catch((error) => console.error("Error fetching products:", error));
    }

    // Manejadores para los botones de navegación
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProductos(currentPage);
        }
    });

    nextBtn.addEventListener("click", () => {
        if ((currentPage * limit) < totalProductos) {
            currentPage++;
            fetchProductos(currentPage);
        }
    });

    // Manejadores para el carrito
    limpiarCarritoBtn.addEventListener("click", () => {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        renderCarrito();
    });

    finalizarCompraBtn.addEventListener("click", () => {
        Swal.fire(
            '¡Compra Finalizada!',
            'Gracias por tu compra.',
            'success'
        ).then(() => {
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderCarrito();
        });
    });

    // Carga inicial de productos y carrito
    fetchProductos(currentPage);
    renderCarrito();
});

// Validación del formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Previene el envío del formulario para validarlo
    const email = document.getElementById('emailInput').value;
    const evento = document.getElementById('raceChoice').value;
    const experiencia = document.getElementById('experienceTextarea').value;

    if (email && evento && experiencia) {
        Swal.fire(
            '¡Mensaje enviado!',
            'Todos los campos están completos.',
            'success'
        ).then(() => {
            // Limpiar el formulario después de cerrar la alerta
            document.getElementById('contactForm').reset();
        });
    } else {
        Swal.fire(
            'Error',
            'Por favor, completa todos los campos del formulario.',
            'error'
        );
    }
});



       