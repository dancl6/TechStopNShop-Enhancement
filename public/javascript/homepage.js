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
            cart[item].count ++;
            saveCart();
            return;
          }
        }
        var item = new Item(name, price, count);
        cart.push(item);
        saveCart();
  
    }


      console.log("i am at temp")
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
        await fetch(`/api/profits`, {
          method: 'GET',
        }).then((response) => response.json())
          .then((data)=> {
            for(var item in cart) {
              if(cart[item].name === name) {
                var sumTotCart = 1 + cart[item].count
              }}
            // console.log("sumCount is :", sumCount)
            console.log("stock is :",data[0].product.stock )
            // for(var product in data) {
            for(let i = 0; i < data.length; i++){
              if(name === data[i].product.product_name){
                var indexFor = i
              }
            }
            console.log("sum tot cart is :", sumTotCart)

            if(sumTotCart > data[indexFor].product.stock || data[indexFor].product.stock === 0) {
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
        + "<td><div class='input-group'><div class='minus-item input-group-addon  btn-primary' data-name= '" + cartArray[i].name + "'></div>"
        + "<div type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
        + "<div>"+cartArray[i].count+"</div>"
        + "<div class='plus-item  btn-primary input-group-addon' data-name= '" + cartArray[i].name + "'></div></div></td>"
        + "<td><div class='delete-item  btn-danger' data-name='" + cartArray[i].name + "'></div></td>"
        + " = " 
        + "<td>" + cartArray[i].total + "</td>" 
        +  "</tr>";
    }
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart());
    $('.total-count').html(shoppingCart.totalCount());
  }
  

  
  displayCart();
  
// listen for click of checkout button, as long as cart contains items
async function checkout() {
  if (sessionStorage.shoppingCart != null) {
    document.location.replace('/checkout');
  }
}

document.querySelector('#checkout').addEventListener('click', checkout);