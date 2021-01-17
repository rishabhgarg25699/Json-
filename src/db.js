const fs = require("fs/promises");


class DB {

  static #data = "";

  constructor() {
    this.#data = "";
  }

  static async init() {
    DB.#data = await fs.readFile(__dirname + "/../data/store.json", { encoding: "utf-8" });
  }

  static read() {
    return JSON.parse(DB.#data);
  }

  static async save(data) {
    DB.#data = JSON.stringify(data);
    console.log(DB.#data);
    await fs.writeFile(__dirname + "/../data/store.json", this.#data)
  }

}



module.exports = DB;
