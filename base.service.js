const client = require("./dbConnection");
class BaseService {
  constructor(client) {
    console.log("base service conmstructor called");
    //DB connection
    client.connect((err, client, done) => {
      if (err) {
        console.error("Error durring DB connection", err);
        return res.status(500).json({ error: "Error durring DB Connection" });
      }
      if (client) {
        console.log(
          `Connection estblished with "${client?.database}" on Port ${client?.port}`
        );
      }
    });
  }

  async createRecord(tableName, data) {
    try {
      const result = await this.database.query(
        `INSERT INTO ${tableName} VALUES ($1, $2, $3)`,
        [data.field1, data.field2, data.field3]
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getRecords(tableName) {
    try {
      console.log(tableName);
      const result = await client.query(`SELECT * FROM ${tableName} `);
      return result?.rows;
    } catch (error) {
      console.log("error aty baseService:", error);
      throw error;
    }
  }

  async getRecordById(tableName, id) {
    try {
      console.log(tableName, "------", id);
      const result = await client.query(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id]
      );
      return result?.rows[0];
    } catch (error) {
      console.log("error aty baseService:", error);
      throw error;
    }
  }

  async updateRecord(tableName, data) {
    const { name, email, gender, id } = data;
    const query = `UPDATE ${tableName} SET name = $1, email = $2, gender = $3 WHERE id = $4 RETURNING *`;
    const values = [name, email, gender, id];

    try {
      const result = await client.query(query, values);
      return result?.rows[0];
    } catch (error) {
      console.log("error aty baseService:", error);

      throw error;
    }

    // try {
    //   const result = await client.query(
    //     `INSERT INTO ${tableName} VALUES ($1, $2, $3)`,
    //     [data.field1, data.field2, data.field3]
    //   );
    //   return result;
    // } catch (error) {
    //   throw error;
    // }
  }

  async deleteRecord(tableName, id) {
    try {
      console.log(tableName, "------", id);
      const result = await client.query(
        `DELETE  FROM ${tableName} WHERE id = $1`,
        [id]
      );
      return result?.rowCount;
    } catch (error) {
      console.log("error aty baseService:", error);
      throw error;
    }
  }
}
module.exports = BaseService;
