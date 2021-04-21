// Продолжить работу с интернет-магазином:
// 2.1. В прошлом домашнем задании вы реализовали корзину на базе массивов.
//Какими объектами можно заменить их элементы?
//     2.2. Реализуйте такие объекты.
// 2.3. Перенести функционал подсчета корзины на объектно-ориентированную базу.

const basketObj = {
    sum: 0,

    basketList: {
        струны: {
            price: 1000,
            quantity: 1
        },
        гитара: {
            price: 15000,
            quantity: 1
        },
        'набор канифоли': {
            price: 500,
            quantity: 1
        },
        'нотная тетрадь': {
            price: 90,
            quantity: 1
        },
        балалайка: {
            price: 42000,
            quantity: 1
        }
    },

    countBasketPrice() {
        for (let key in this.basketList) {
            this.sum += this.basketList[key].price * this.basketList[key].quantity
        }
        console.log(this.sum)
    },
}

basketObj.countBasketPrice()
