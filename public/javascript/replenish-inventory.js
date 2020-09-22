async function editFormHandler2(event) {
// async function getProductInfo() {
      await fetch(`/api/profits`, {
        method: 'GET',
        }).then((response) => response.json())
        .then((data)=> {
           for(let i = 0; i < data.length; i++){
               console.log("i am at replenish",data[i].product.stock)
            if(data[i].product.stock < 3 ) {
                let id = data[i].id
                let stock = 5
                fetch(`/api/products/${id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                      stock
                    }),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });

            } else {}

           }
      })  
      document.location.replace('/profit');
}

// getProductInfo()
document.querySelector('#replenish-inventory').addEventListener('click', editFormHandler2);