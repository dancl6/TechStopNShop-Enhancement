const router = require('express').Router();
const sequelize = require('../config/connection');
const { Op } = require('sequelize');

const {
    Product,
    User,
    Category,
    Product_Profit
} = require('../models');
const isAuth = require('../utils/middleware/isAuth');

//Profit page
router.get('/profit', isAuth, (req, res) => {
    Category.findAll({
        attributes: ['id', 'category_name'],
        include:
        {
            model: Product,
            attributes: ['product_name', 'price', 'stock'],
            include: {
                model: Product_Profit,
                attributes: ['num_sold','cost']
              }
        },
    })
  .then(dbPostData => {
    let test2 = JSON.stringify(dbPostData);
    let parsePost =JSON.parse(JSON.stringify(dbPostData));
    console.log(parsePost);
    let test = parsePost[1].products[0].product_profits[0].num_sold;
    console.log('WE GET HERE 2');
    let lengthTest = parsePost.length;
    console.log(`lengthTest is : ${lengthTest}`);
    console.log(test)
    var soldTimesCost = 0
    var inventTimesCost = 0
    var soldTimesPrice = 0
    var soldArray = []
    var inventArray = []
    var sum = 0
    var objArray = []
    var productItem
    var soldItem
    var inventItem
    var objSold = {}

    for (let i = 0; i < parsePost.length; i++) {

        for (let j = 0; j < parsePost[i].products.length; j++) {
            // run through equations to calculate the total profit of the company
            soldTimesCost = soldTimesCost + parsePost[i].products[j].product_profits[0].num_sold*parsePost[i].products[j].product_profits[0].cost;
            inventTimesCost = inventTimesCost + parsePost[i].products[j].stock*parsePost[i].products[j].product_profits[0].cost;
            soldTimesPrice = soldTimesPrice + parsePost[i].products[j].product_profits[0].num_sold*parsePost[i].products[j].price;

            productItem = parsePost[i].products[j].product_name
            soldItem = parsePost[i].products[j].product_profits[0].num_sold
            inventItem = parsePost[i].products[j].stock
            costItem = parsePost[i].products[j].product_profits[0].cost
            priceItem = parsePost[i].products[j].price
            sum = sum +1
        
            console.log("product item is :" + productItem)
            console.log("num sold is : " + soldItem)
            console.log("inventItem is : " + inventItem)

            // create objects to append to array to build array of product name, number sold and number in inventory
            var objName = "obj" + sum
            var objName = new Object();
            objName.product = productItem
            objName.num_sold = soldItem
            objName.num_invent = inventItem
            objName.cost = costItem
            objName.price = priceItem
            objArray.push(objName)
            console.log("objNew is : ")
            console.log(objName)
      
        }

    }

    console.log("obj new is : ")
    console.log(objArray)

    let debtTotal = soldTimesCost + inventTimesCost
    let incomeTotal = soldTimesPrice;
    let profitTotal = incomeTotal - debtTotal;
    // set profit flag determining whether it is green for positive profit or red for negative profit
    if (profitTotal > 0){
        var profitFlag = true;
    } else {
        var profitFlag = false;
    }
    console.log(debtTotal)
    console.log(incomeTotal)
    console.log(parsePost)

    let loginStatus;
    if (typeof req.session.passport != 'undefined') {
        loginStatus = req.session.passport.user.id;
    } else {
        loginStatus = false;
    }

    console.log('WE GET HERE 4');
    res.render('profit', {
        parsePost, 
        profitTotal, 
        objArray, 
        profitFlag, 
        test2, 
        loggedIn: loginStatus, 
        soldArray, 
        inventArray
    });
  })
  .catch(err => res.status(500).json(err));
});


//Inventory Page
router.get('/product-inventory', isAuth, (req, res) => {
    Product.findAll({
        attributes: ['id', 'product_name'],
    })
  .then(dbPostData => {
    // convert data string to readable json format
    let parsePost =JSON.parse(JSON.stringify(dbPostData));
    let loginStatus;
    if (typeof req.session.passport != 'undefined') {
        loginStatus = req.session.passport.user.id;
    } else {
        loginStatus = false;
    }
    res.render('product-inventory', {parsePost,  loggedIn: loginStatus});
  })
  .catch(err => res.status(500).json(err));
});

//Update inventory
router.get('/products-update/:id', (req, res) => {
    Product.findOne({
        
            where: {
              id: req.params.id
            }
        })  .then(dbUserData => {
            let loginStatus;
            if (typeof req.session.passport != 'undefined') {
                loginStatus = req.session.passport.user.id;
            } else {
                loginStatus = false;
            }
            res.render("products-update",{  loggedIn: loginStatus});
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
        });


//Homepage/Featured items
router.get('/', (req, res) => {
    Product.findAll({
        where: {
            featured: true
        },
            attributes: [
                'id',
                'product_name',
                'price',
                'stock',
                'image'
            ],
        })
        .then(dbPostData => {
            const products = dbPostData.map(products => products.get({
                plain: true
            }));
            
            let loginStatus;
            if (typeof req.session.passport != 'undefined') {
                loginStatus = req.session.passport.user.id;
            } else {
                loginStatus = false;
            }

            res.render('homepage', {
                products,
                loggedIn: loginStatus
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get localStorage value for question 1
router.get('/localStorage/:value', (req,res) => {    
    res.render('question2', {
        value
    })
})

//Update inventory page render
router.get('/update-inventory', isAuth, (req, res) => {
    res.render('update-inventory')
   })

//Checkout page render
router.get('/checkout', (req, res) => {
    let loginStatus;
    if (typeof req.session.passport != 'undefined') {
        loginStatus = req.session.passport.user.id;
    } else {
        loginStatus = false;
    }
    res.render('checkout', {
        loggedIn: loginStatus
    });
});

//Search 
router.get('/search/:query', (req, res) => {
    Product.findAll({
        attributes: ['id', 'product_name', 'price', 'stock', 'image', 'category_id'],
        // Use Sequelize like operator. More operators here: https://sequelize.org/master/manual/model-querying-basics.html
        where: {
            product_name: {
                [Op.like]: '%' + req.params.query + '%'
            }
        },
        include:
            [
                {
                    model: Category,
                    attributes: ['id', 'category_name']
                },
                {
                    model: Product_Profit,
                    attributes: ['id', 'num_sold', 'cost', 'product_id']
                }
            ]
    })
        .then(dbProductData => {
            const products = dbProductData.map(products => products.get({
                plain: true
            }));

            // make sure to pass in correct login status. If no passport object exists, it has not been created, i.e. user not logged in
            let loginStatus;
            if (typeof req.session.passport != 'undefined') {
                loginStatus = req.session.passport.user.id;
            } else {
                loginStatus = false;
            }

            res.render('search', {
                products: products,
                loggedIn: loginStatus
            });
        })
        .catch(err => res.status(500).json(err));
});


//Login route/render
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

//Sign-up page
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

//Products page
router.get('/products', (req, res) => {
    Product.findAll({
        attributes: ['id', 'product_name', 'price', 'stock', 'image', 'category_id'],
        include: {
            model: Category,
            attributes: ['id', 'category_name']
        }
    })
    .then(dbPostData => {
        const products = dbPostData.map(products => products.get({ plain: true }));

        console.log(products)

        let loginStatus;

        if (typeof req.session.passport != 'undefined') {
            loginStatus = req.session.passport.user.id;
        } else {
            loginStatus = false;
        }

        res.render('product-list', {
            products, 
            loggedIn: loginStatus
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

module.exports = router;