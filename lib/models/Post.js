const pool = require('../utils/pool');


class Post {
  id;
  message;
  created_at;


  constructor(row) {
    this.id = row.id;
    this.message = row.message;
    this.created_at = row.created_at;
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
            SELECT *
            FROM posts`
    );

    return rows.map((row) => new Post(row));
  }


  static async insert({ message }) {
    const { rows } = await pool.query(
      `
      INSERT INTO posts (message)
      VALUES ($1)
      RETURNING *`,
      [message]
    );
    return new Post(rows[0]);
  }

}



module.exports = Post;
