'use strict'

class ChessGame {
    constructor(table) {
        this.table = table
    }

    renderCell(row, value) {
        const cell = document.createElement('td')
        row.appendChild(cell)
        const cellValue = document.createElement('div')
        cellValue.innerText = value
        cell.appendChild(cellValue)
    }

    renderHeaderOrFooter() {
        const row = document.createElement('tr')
        this.renderCell(row, '')
        for (let letter of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
            this.renderCell(row, letter)
        }
        this.renderCell(row, '')
        this.table.appendChild(row)
    }

    renderRow(header) {
        const row = document.createElement('tr')
        this.renderCell(row, header)
        for (let i = 0; i < 8; i++) {
            this.renderCell(row, '')
        }
        this.renderCell(row, header)
        this.table.appendChild(row)
    }

    renderColors() {
        for (let i = 1; i < 9; i++) {
            for (let j = 1; j < 9; j++) {
                ((i + j) % 2 === 0) && (this.table.childNodes[i].childNodes[j].style.backgroundColor = 'grey')
            }
        }
    }

    render() {
        this.renderHeaderOrFooter()
        for (let number = 8; number > 0; number--) {
            this.renderRow(String(number))
        }
        this.renderHeaderOrFooter()
        this.renderColors()
    }
}

const game = new ChessGame(document.getElementById('chess'))
game.render()
