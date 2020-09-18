// ************************************************
// Shopping Cart API
// ************************************************

var shoppingCart = (function() {
    // =============================
    // Private methods and propeties
    // =============================
    cart = [];
    
    // Constructor
    function Item(name, price, count) {
      this.name = name;
      this.price = price;
      this.count = count;
    }
    
    // Save cart
    function saveCart() {
      sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
    
      // Load cart
    function loadCart() {
      cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
      loadCart();
    }
    
  
    // =============================
    // Public methods and propeties
    // =============================
    var obj = {};
    
    // Add to cart
    obj.addItemToCart = function(name, price, count) {

    console.log("i am at line 40 and count is :",count)

  
              for(var item in cart) {
                if(cart[item].name === name) {
                  // console.log("I am at line 74 and count is:", count," and cart item count is :", cart[item].count, "product stock is:", data[i].product.stock)
                  // var sumCount = count + cart[item].count;
                  // var testStock = data[i].product.stock
                  // console.log("sum count is :")
                  // console.log(sumCount)
                  // if(sumCount > data[i].product.stock) {
                  //   console.log("There are not enough items in inventory!")
                  // } else {
                  cart[item].count ++;
                  // console.log("number of items in cart is:" )
                  // console.log(cart[item].count)
                  saveCart();
                  return;
                }
              }
              // }
              
              // if(sumCount <= data[indexFor].product.stock) {

              var item = new Item(name, price, count);
              cart.push(item);
              saveCart();
              // } 
            }

            // console.log("i am at test stock and it is: ", testStock)

          // }
      //   }

      // })
      // }

    //  let temp = getProductInfo(1)

      console.log("i am at temp")
      // console.log(temp)


    // }
    // Set count from item
    obj.setCountForItem = function(name, count) {
      for(var i in cart) {
        if (cart[i].name === name) {
          cart[i].count = count;
          break;
        }
      }
    };
    // Remove item from cart
    obj.removeItemFromCart = function(name) {
        for(var item in cart) {
          if(cart[item].name === name) {
            cart[item].count --;
            if(cart[item].count === 0) {
              cart.splice(item, 1);
            }
            break;
          }
      }
      saveCart();
    }
  
    // Remove all items from cart
    obj.removeItemFromCartAll = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart.splice(item, 1);
          break;
        }
      }
      saveCart();
    }
  
    // Clear cart
    obj.clearCart = function() {
      cart = [];
      saveCart();
    }
  
    // Count cart 
    obj.totalCount = function() {
      var totalCount = 0;
      for(var item in cart) {
        totalCount += cart[item].count;
      }
      return totalCount;
    }
  
    // Total cart
    obj.totalCart = function() {
      var totalCart = 0;
      for(var item in cart) {
        totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
    }
  
    // List cart
    obj.listCart = function() {
      var cartCopy = [];
      for(i in cart) {
        item = cart[i];
        itemCopy = {};
        for(p in item) {
          itemCopy[p] = item[p];
  
        }
        itemCopy.total = Number(item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy)
      }
      return cartCopy;
    }
  
    // cart : Array
    // Item : Object/Class
    // addItemToCart : Function
    // removeItemFromCart : Function
    // removeItemFromCartAll : Function
    // clearCart : Function
    // countCart : Function
    // totalCart : Function
    // listCart : Function
    // saveCart : Function
    // loadCart : Function
    return obj;
  })();
  
  
  // *****************************************
  // Triggers / Events
  // ***************************************** 
  // Add item
  $('.add-to-cart').click(function(event) {
    event.preventDefault();
    var name = $(this).data('name');
    var price = Number($(this).data('price'));

    async function getProductInfo() {
      // await fetch(`/api/products/${id}`, {
        // await fetch(`/api/profits/${id}`, {
        await fetch(`/api/profits`, {
          method: 'GET',
          // body: JSON.stringify({
          
          // }),
          // headers: {
          //   'Content-Type': 'application/json'
          // }
        }).then((response) => response.json())
          .then((data)=> {
            // console.log("data is...", data);
            // console.log("number in inventory is...", data.product.stock)
            console.log("count is :")
            // console.log(count)
            console.log("data is :")
            console.log(data)
            for(var item in cart) {
              if(cart[item].name === name) {
            console.log("cart item count is : ", cart[item].count)
            var sumTotCart = 1 + cart[item].count
              }}
            // console.log("sumCount is :", sumCount)
            console.log("stock is :",data[0].product.stock )
            // for(var product in data) {
            for(let i = 0; i < data.length; i++){
              console.log("product is :")
              console.log(data[i].product.product_name)
              if(name === data[i].product.product_name){
                var indexFor = i
              }
            }
                // if(count > data[i].product.stock){
    
                //   console.log("There are not enough items in inventory!")
                  
                // } else {
                  if(sumTotCart > data[indexFor].product.stock) {
                    console.log("Not enough items in inventory!")
                    $("#myModal").modal()
                  } else {
                  shoppingCart.addItemToCart(name, price, 1);
                  displayCart();
                  }
                })}
           
                  getProductInfo()

 });
  
  // Clear items
  $('.clear-cart').click(function() {
    shoppingCart.clearCart();
    displayCart();
  });
  
  
  function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for(var i in cartArray) {
      output += "<tr>"
        + "<td>" + cartArray[i].name + "</td>" 
        + "<td>(" + cartArray[i].price + ")</td>"
        + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name= '" + cartArray[i].name + "'>-</button>"
        + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
        + "<button class='plus-item btn btn-primary input-group-addon' data-name= '" + cartArray[i].name + "'>+</button></div></td>"
        + "<td><button class='delete-item btn btn-danger' data-name='" + cartArray[i].name + "'>X</button></td>"
        + " = " 
        + "<td>" + cartArray[i].total + "</td>" 
        +  "</tr>";
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
  }
  
  // Delete item button
  
  $('.show-cart').on("click", ".delete-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
  })
  
  
  // -1
  $('.show-cart').on("click", ".minus-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCart(name);
    displayCart();
  })
  // +1
  $('.show-cart').on("click", ".plus-item", function(event) {
    var name = $(this).data('name')
    shoppingCart.addItemToCart(name);
    displayCart();
  })
  
  // Item count input
  $('.show-cart').on("change", ".item-count", function(event) {
     var name = $(this).data('name');
     var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
  });
  
  displayCart();
  
// listen for click of checkout button, as long as cart contains items
async function checkout() {
  if (sessionStorage.shoppingCart != null) {
    document.location.replace('/checkout');
  }
}

document.querySelector('#checkout').addEventListener('click', checkout);