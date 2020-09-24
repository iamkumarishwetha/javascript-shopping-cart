"use strict";
(function () {
    let carts = document.querySelectorAll(".add-cart");
    let cartNo = document.querySelector('[data-cart]');
    let productContainer = document.querySelector('.products');

    let cart = [];

    let products = [
        {
            id: 1,
            name: 'Grey Shoulder Bag',
            tag: 'greyshoulderbag',
            price: 500,
            inCart: 0
        },
        {
            id: 2,
            name: 'Black Shoulder Bag',
            tag: 'blackshoulderbag',
            price: 1000,
            inCart: 0
        },
        {
            id: 3,
            name: 'Grey Hand Bag',
            tag: 'greyhandbag',
            price: 700,
            inCart: 0
        },
        {
            id: 4,
            name: 'Black Hand Bag',
            tag: 'blackhandbag',
            price: 750,
            inCart: 0
        }
    ]
    let cartArray = Array.from(carts);



    function getLSContent(key) {
        // get contents from local storage.
        const lsContent = JSON.parse(localStorage.getItem(key));
        return lsContent;
    }

    function setLsContent(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    function totalCartItems() {
        let cartItems = getLSContent('productsInCart');
        if (cartItems && cartNo != null){
            let totalItems = cartItems.reduce((acc, item) => {
                return acc = acc + item.inCart;
            }, 0)
            setLsContent('cartNumbers', totalItems);
            cartNo.textContent = totalItems;
        }
    }
    function setItems(product) {
        let isProductInCart = false;
        let cartItems = getLSContent('productsInCart');
        if (cartItems !== null) {
            cart = cartItems.map((item, index) => {
                if (item.tag == product.tag) {
                    isProductInCart = true;
                    item.inCart += 1;
                }
                return item;
            })

            if (!isProductInCart) {
                product.inCart = 1;
                cart.push(product);
            }
        } else {
            product.inCart = 1;
            cart.push(product);
        }

        setLsContent('productsInCart', cart)
    }

    function removeProduct(productId) {
        // remove product from cart (and from local storage)

        // retrieve list of products from LS
        const lsContent = getLSContent('productsInCart');

        // get the product item to remove
        // inside the local storage content array
        let productToRemove = lsContent.filter(function (product, i) {
            if (product.id === parseInt(productId)) {
                product['index'] = i;
                return product;
            }
        });
        lsContent.splice(productToRemove[0].index, 1);
        setLsContent('productsInCart', lsContent);
        totalCartItems();
        totalCost();
        displayCart();

    }

    function updateCart(id, option) {

        const lsContent = getLSContent('productsInCart');
        lsContent.forEach((item, index) => {
            if (item.id == id) {
                if (option === 'add') {
                    if (item.inCart >= 0) {
                        item.inCart++;
                    }
                } else if (option === 'remove') {
                    if (item.inCart > 0) {
                        item.inCart--;
                    }
                }
            }
        })
        setLsContent('productsInCart', lsContent);
        totalCartItems()
        totalCost();
        displayCart();
    }

    function totalCost() {
        let products = getLSContent("productsInCart");
        if (products !== null) {
            let cartCost = products.reduce((acc, item) => {
                return acc = acc + (item.price * item.inCart)
            }, 0)
            setLsContent("totalCost", cartCost)
        }
    }
    function clickFun(e) {
        e.preventDefault();
        e.stopImmediatePropagation()
        e.preventDefault();
        // identify the button that was clicked
        const clickedBtn = e.target;
        // if it's a remove button
        if (e.target.classList.contains("remove")) {
            // get the value of the data-id property, which contains the
            // id of the selected product
            const productId = clickedBtn.getAttribute("data-id");
            // use the id to remove the selected product
            removeProduct(productId);
        }
        else if (e.target.classList.contains("plus-cart")) {
            const productId = clickedBtn.getAttribute("data-id");
            updateCart(productId, 'add');
        }

        else if (e.target.classList.contains("minus-cart")) {
            const productId = clickedBtn.getAttribute("data-id");
            updateCart(productId, 'remove');
        }
    }

    function displayCart() {
        let cartItems = getLSContent('productsInCart')
        let cartCost = getLSContent('totalCost')
        if (productContainer !== null) {// to check cart page
            if (cartItems !== null) {
                // console.log(cartItems);
                productContainer.innerHTML = '';
                cartItems.forEach((item, index) => {
                    productContainer.innerHTML += `
            <div class="product-list">
                <div class="product">
                    <i class="icon fas fa-times-circle remove" data-id="${item.id}"></i>
                    <img src="img/product/${item.tag}.jpg" />
                    <span>${item.name}</span>
                </div>
                <div class="price"><i class="fas fa-rupee-sign"></i>${item.price}</div>
                <div class="quantity">
                    <i class="icon fas fa-caret-left minus-cart" data-id="${item.id}"></i>
                    <span>${item.inCart}</span>
                    <i class="icon fas fa-caret-right plus-cart" data-id="${item.id}"></i>
                </div>
                <div class="total">
                    <i class="fas 2x fa-rupee-sign"></i>
                    ${item.inCart * item.price}
                </div>
            </div>
            `;
                });

                if (cartItems.length > 0) {
                    productContainer.innerHTML += `
                <div class="basketTotalContainer">
                    <h4 class="basketTotalTitle">
                        Basket Total
                    </h4>
                    <h4 class="basketTotal">
                        <i class="fas 2x fa-rupee-sign"></i>
                        ${cartCost}
                    </h4>
                </div>
                `;
                }
                else {

                    productContainer.innerHTML += `<h3>No items in cart..!!!</h3>`;
                }

                //to remove items
                productContainer.addEventListener('click', function (e) {
                    clickFun(e)
                });
            }
            else {
                productContainer.innerHTML += `<h3>No items in cart..!!!</h3>`;
            }
        }
    }

    // Page load:
    document.addEventListener("DOMContentLoaded", function (e) {
        // display list of products in cart, if any, on page load
        displayCart();
        // display cart total items
        totalCartItems();
    });

    //to add item to cart
    cartArray.forEach(function (item, index) {
        item.addEventListener('click', () => {
            //console.log("Added To CART");
            //to update products in cart
            setItems(products[index]);
             //to update cart item qunatity
            totalCartItems();
            //to calculate total cost of product you have added to cart
            totalCost();
        })
    })

})();
