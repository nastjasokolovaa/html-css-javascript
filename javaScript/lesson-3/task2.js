<!--Товары в корзине хранятся в массиве. Задачи:-->
<!--a) Организовать такой массив для хранения товаров в корзине;-->
<!--b) Организовать функцию countBasketPrice, которая будет считать стоимость корзины.-->

const basket = [['Струны', 1000], ['Гитара', 15000], ['Набор канифоли', 500], ['Нотная тетрадь', 90],
    ['Балалайка', 42000]]

function countBasketPrice(arr) {
    let sum = 0
    for (let i = 0; i < arr.length; i++){
        sum += arr[i][1]
    }
    console.log(sum)
}

countBasketPrice(basket)
