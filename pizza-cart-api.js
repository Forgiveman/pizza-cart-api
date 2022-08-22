
document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            init() {
                axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                    .then((result) => {
                        this.pizzas = result.data.pizzas
                    })
                    .then(() => {
                        return this.createCart();
                    })
                    .then((result) => {
                        this.cartId = result.data.cart_code;
                    });
            },
            showFeatured(){
                axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
                    .then((result) => {
                        this.pizzas = result.data.pizzas
                    });
            },
            createCart() {
                return axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
            },
            showCart() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`
                axios
                    .get(url)
                    .then((result) => {
                        this.cart = result.data;
                    });
            },
            pizzaImage(pizza) {
                return `/img/${pizza.size}.png`
            },
            message: 'Eating pizzas',
            username: '',
            pizzas: [],
            cartId: '',
            cart: {
                total: 0
            },
            paymentMessage: '',
            paymentAmount: '',
            BuyNum : false,
            buy(pizza) {
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }
                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => {
                        this.message = "Pizza added to the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));
            },
            makePayment(){
                if(this.paymentAmount == 0){
                    this.paymentMessage = 'No amount entered!'
                }
                if(this.paymentAmount >= this.cart.total){
                    this.paymentMessage = 'Payment successeful';
                      setTimeout(()=>{
                        this.clearMessage()
                        this.BuyNum = false
                      }, 2000);
                     }
                else{
                    this.paymentMessage = 'Error'
                }
            },
            add(pizza) {
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }
                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => {
                        this.message = "Pizza added to the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));
            },


            sub(pizza) {
                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }
                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                    .then(() => {
                        this.message = "Pizza removed from the cart"
                        this.showCart();
                    })
                    .catch(err => alert(err));
            },
            clearMessage(){
                this.cart={};
                this.paymentMessage='';
                this.paymentAmount='';
            }

        }
    })
})