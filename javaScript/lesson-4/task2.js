// Продолжить работу с интернет-магазином:
// 2.1. В прошлом домашнем задании вы реализовали корзину на базе массивов.
//Какими объектами можно заменить их элементы?
//     2.2. Реализуйте такие объекты.
// 2.3. Перенести функционал подсчета корзины на объектно-ориентированную базу.

const basketObj = {
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
}


function countBasketPrice(obj) {
    let sum = 0
    let keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++){
        sum += ((obj[(keys[i])]).price * (obj[(keys[i])]).quantity)
    }
    console.log(sum)
}

countBasketPrice(basketObj)
