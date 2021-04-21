// Написать функцию, преобразующую число в объект.
//Передавая на вход число от 0 до 999, мы должны получить на выходе объект, в котором в соответствующих
//свойствах описаны единицы, десятки и сотни. Например, для числа 245 мы должны получить следующий объект:
//{‘единицы’: 5, ‘десятки’: 4, ‘сотни’: 2}. Если число превышает 999, необходимо выдать соответствующее
//сообщение с помощью console.log и вернуть пустой объект.

let numWithHundreds = 346
let numWithTens = 15
let numWithUnits = 5
let numWithThousand = 1050

function numInObj(num) {
    let obj = {}
    let units
    let hundreds
    let tens
    if (num > 999) {
        console.log(obj)
    } else if (100 <= num <= 999) {
        units = num % 10
        num = (num - (num % 10)) / 10
        tens = num % 10
        hundreds = (num - (num % 10)) / 10
        obj = {
            единицы: units,
            десятки: tens,
            сотни: hundreds
        }
        console.log(obj)
    } else if (10 <= num <= 99) {
        units = num % 10
        tens = (num - (num % 10)) / 10
        obj = {
            единицы: units,
            десятки: tens,
            сотни: 0
        }
        console.log(obj)
    } else {
        obj = {
            единицы: num,
            десятки: 0,
            сотни: 0
        }
        console.log(obj)
    }
}

numInObj(numWithHundreds)
numInObj(numWithTens)
numInObj(numWithUnits)
numInObj(numWithThousand)
