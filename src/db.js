const fs = require("fs/promises");


class DB {

  static #data = "";
  
  constructor() {
    this.#data = "";
  }

  static async init() {
    DB.#data = await fs.readFile("/home/onbit-syn/onbit/Json-/data/store.json", { encoding: "utf-8" });
  }

  static read() {
    return JSON.parse(DB.#data);
  }

  static save(data) {
    // saves data back to file
  }

}



module.exports = DB;
