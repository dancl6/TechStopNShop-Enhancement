function init () {
  confirmationNum();
  displayPurchase();
  sessionStorage.clear();
}

function confirmationNum () {
  let num = Math.floor((Math.random() * 10000) + 10000); 
  let numarea = document.querySelector('#confirmationNum');

  numarea.textContent = `#${num}`;
}

function displayPurchase () {
  let purchase = JSON.parse(sessionStorage.getItem('shoppingCart'));
  console.log(purchase);

  let output = "";
  let total = [];
  for(var i in purchase) {
    total.push(purchase[i].count * purchase[i].price);
    output += `
    <tr>
      <th scope="row">${purchase[i].count}</th>
      <td>$${purchase[i].price}</td>
      <td>${purchase[i].name}</td>
      <td>$${purchase[i].count * purchase[i].price}</td>
      </tr>
    `;
  }

  async function getProductInfo(purchaseName, purchaseCount) {
    await fetch(`/api/profits`, {
      method: 'GET',
    }).then((response) => response.json())
    .then((data)=> {
      // for(var item in data) {
        // if(purchaseName === data) {
          console.log("i am at data in checkout")
          console.log(data)
          for(var j = 0; j < data.length; j++) {
            console.log("product name is :", data[j].product.product_name)
            console.log("purchase name is :", purchaseName)
            console.log("data id is:", data[j].id)
            if(data[j].product.product_name === purchaseName) {
              var idProduct = data[j].id

              fetch(`/api/profits`, {
                method: 'GET',
              }).then((response) => response.json())
              .then((data)=> {
                for(var j = 0; j < data.length; j++) {
                  console.log("product name is :", data[j].product.product_name)
                  console.log("purchase name is :", purchaseName)
                  console.log("data id is:", data[j].id)
                  console.log("i am at sold for")
                  if(data[j].product.product_name === purchaseName) {
                    var idProduct = data[j].id
                    var numberSold = data[j].num_sold
                    console.log("i am at num sold", data)
               
                    var num_sold = numberSold + purchaseCount
                    
                fetch(`/api/products/sold/${idProduct}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    num_sold
                  }),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                })
                
              }};


              })


          // var sumTotCart = 1 + cart[item].count
            }}
      // console.log("cart item count is : ", cart[item].count)
      // var sumTotCart = 1 + cart[item].count
        // }}
      })
}

  for(var i in purchase) {
    getProductInfo(purchase[i].name, purchase[i].count)
}

  let grandTotal = 0;
  for (let i = 0; i < total.length; i ++) {
    grandTotal += total[i];
    console.log(total[i]);
  }

  $('#items').html(output);
  $('#total').html(`$${grandTotal}`);
}

init();