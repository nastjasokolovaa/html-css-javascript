'use strict'

const shoppingCart = {
    state: {
        items: {
            1: {id: 1, name: 'Гитара', price: 15000, quantity: 1},
            12: {id: 12, name: 'Микрофон', price: 1800, quantity: 1},
            45: {id: 45, name: 'Батарейки', price: 200, quantity: 3},
            79: {id: 79, name: 'Футляр для гитары', price: 3000, quantity: 1},
        },
    },

    renderSum() {
        let sum = 0
        for (const key in this.state.items) {
            const {price, quantity} = this.state.items[key]
            sum += price * quantity
        }
        const tr = document.createElement('tr')

        const sumTd = document.createElement('td')
        sumTd.innerText = 'Цена товаров в корзине: ' + String(sum)
        tr.appendChild(sumTd)

        return tr
    },

    renderClearButton(onChange) {
        const tr = document.createElement('tr')
        const td = document.createElement('td')
        const clearButton = document.createElement('input')
        clearButton.type = 'button'
        clearButton.value = 'Очистить корзину'
        clearButton.onclick = () => {
            this.state.items = {}
            onChange()
        }

        td.appendChild(clearButton)
        tr.appendChild(td)

        return tr
    },

    renderRow(item, onChange) {
        const tr = document.createElement('tr')

        const nameTd = document.createElement('td')
        nameTd.innerText = item.name

        const quantityTd = document.createElement('td')
        const quantityInput = document.createElement('input')
        quantityInput.type = 'number'
        quantityInput.value = item.quantity
        quantityTd.appendChild(quantityInput)

        const priceTd = document.createElement('td')
        priceTd.innerText = String(item.price * item.quantity)

        quantityInput.onchange = (e) => {
            item.quantity = +e.target.value
            if (item.quantity === 0) {
                delete this.state.items[item.id]
            }
            onChange()
        }

        const deleteTd = document.createElement('td')
        const deleteButton = document.createElement('input')
        deleteButton.type = 'button'
        deleteButton.value = '[x]'
        deleteButton.onclick = () => {
            delete this.state.items[item.id]
            onChange()
        }
        deleteTd.appendChild(deleteButton)

        tr.appendChild(nameTd)
        tr.appendChild(quantityTd)
        tr.appendChild(priceTd)
        tr.appendChild(deleteTd)

        return tr
    },

    render(shoppingCartContainer) {
        if (Object.keys(this.state.items).length === 0) {
            shoppingCartContainer.innerHTML = 'Корзина пуста'
            return
        }
        const table = document.createElement('table')
        const onChange = () => {
            shoppingCartContainer.removeChild(table)
            this.render(shoppingCartContainer)
        }
        for (const id in this.state.items) {
            const row = this.renderRow(this.state.items[id], onChange)
            table.appendChild(row)
        }
        table.appendChild(this.renderSum())
        table.appendChild(this.renderClearButton(onChange))

        shoppingCartContainer.appendChild(table)
    },
}

shoppingCart.render(document.getElementById('shoppingCartMain'))
