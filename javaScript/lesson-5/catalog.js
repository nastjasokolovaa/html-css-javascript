'use strict'

const catalog = {

    catalog: {
        items: {
            1: {id: 1, name: 'Гитара', description: '', price: 15000},
            2: {id: 2, name: 'Гитара', description: '', price: 36000},
            3: {id: 3, name: 'Фортепиано', description: '', price: 180000},
            4: {id: 4, name: 'Синтезатор', description: '', price: 8000},
            5: {id: 5, name: 'Синтезатор', description: '', price: 30000},
            6: {id: 6, name: 'Колонка', description: '', price: 9000},
            7: {id: 7, name: 'Колонка', description: '', price: 21000},
            8: {id: 8, name: 'Гитара', description: '', price: 15000},
            9: {id: 9, name: 'Гитара', description: '', price: 15000},
            12: {id: 12, name: 'Микрофон', description: '', price: 1800},
            25: {id: 25, name: 'Батарейки', description: '', price: 200},
            29: {id: 29, name: 'Футляр для гитары', description: '', price: 3000},
        },
    },

    renderRowName(item) {
        const tr = document.createElement('tr')
        const nameTd = document.createElement('td')
        nameTd.innerText = item.name

        tr.appendChild(nameTd)
        return tr
    },

    renderRowDescription(item) {
        const tr = document.createElement('tr')
        const descriptionTd = document.createElement('td')
        descriptionTd.innerText = item.description

        tr.appendChild(descriptionTd)
        return tr
    },

    renderRowPrice(item) {
        const tr = document.createElement('tr')
        const priceTd = document.createElement('td')
        const priceButton = document.createElement('input')
        priceButton.type = 'button'
        priceButton.value = String(item.price)
        priceButton.className = 'priceButton'
        priceButton.onclick = () => {
            shoppingCart.addToCart(item)
        }

        priceTd.appendChild(priceButton)

        tr.appendChild(priceButton)
        return tr
    },

    renderOneGoodTable(table, catalog) {
        const rowName = this.renderRowName(catalog)
        table.appendChild(rowName)
        const rowDescription = this.renderRowDescription(catalog)
        table.appendChild(rowDescription)
        const rowPrice = this.renderRowPrice(catalog)
        table.appendChild(rowPrice)
    },

    renderTable(catalogContainerLeft, catalogContainerRight) {
        const leftTable = document.createElement('table')
        const rightTable = document.createElement('table')

        for (const id in this.catalog.items) {
            if (id % 2 === 0) {
                this.renderOneGoodTable(leftTable, this.catalog.items[id])
            } else {
                this.renderOneGoodTable(rightTable, this.catalog.items[id])
            }
        }
        catalogContainerLeft.appendChild(leftTable)
        catalogContainerRight.appendChild(rightTable)
    },

}

catalog.renderTable(document.getElementById('tableLeft'), document.getElementById('tableRight'))
