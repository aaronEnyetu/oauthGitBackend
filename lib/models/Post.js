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
}





module.exports = Post;
