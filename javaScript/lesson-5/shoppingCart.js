'use strict'

const shoppingCart = {
    container: document.getElementById('shoppingCartRight'),

    state: {
        items: {},
    },

    addToCart(item) {
        if (item.id in this.state.items){
            this.state.items[item.id].quantity++
        } else {
            this.state.items[item.id] = {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1,
            }
        }
        this.render()
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

    render() {
        if (Object.keys(this.state.items).length === 0) {
            this.container.innerHTML = 'Корзина пуста'
            return
        }
        this.container.innerHTML = ''

        const table = document.createElement('table')
        const onChange = () => {
            this.render(this.container)
        }
        for (const id in this.state.items) {
            const row = this.renderRow(this.state.items[id], onChange)
            table.appendChild(row)
        }
        table.appendChild(this.renderSum())
        table.appendChild(this.renderClearButton(onChange))

        this.container.appendChild(table)
    },
}

shoppingCart.render()
