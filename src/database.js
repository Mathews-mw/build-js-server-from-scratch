import fs from 'node:fs/promises';

// import.meta.url -> indica o caminho atual para esse arquivo. No caso, mostra o exato caminho onde o arquivo database.js se encontra
// new URL() -> é um método para indexar caminho para um arquivo. O primeiro argumento é o caminho a ser definido, o segundo parâmentro é a referência do caminho;
const databasePath = new URL('../db.json', import.meta.url);

export class Database {
  #database = {} // O # indica que essa instância database será privada e somente a própria classe pode acessa-la;

  constructor() {
    fs.readFile(databasePath, 'utf-8')
    .then((data) => {
      this.#database = JSON.parse(data);
    }).catch(() => {
      this.#persist
    });
  }
  
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        })
      }) 
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist()
    return data;
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}