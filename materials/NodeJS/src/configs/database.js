const mysql = require('mysql2')

const { DB_PORT, DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_CONNECTION_LIMIT } = process.env

const pool = mysql.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_DATABASE,
	port: DB_PORT, // Mặc định PORT chọn 3306
	connectionLimit: DB_CONNECTION_LIMIT,
	waitForConnections: true,
	queueLimit: 0,
})

// Test database connection
pool.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
	if (error) throw error
	console.log('The solution is: ', results[0].solution, ' => Database connection is established')
})

/*
	('SELECT * FROM users WHERE username = ? AND password = ?', ['admin', '123456'])
*/

const prepareStatement = async (sql, args) => {
	return await new Promise((resolve, reject) => {
		pool.query(sql, args, (err, rows) => {
			if (err) return reject(err)
			resolve(rows)
		})
	})
}

/* 
[
	{
		"sql": "SELECT * FROM users WHERE username = ? AND password = ?",
		"args": ["admin", "123456"],
	},
	{
		"sql": "SELECT * FROM users WHERE username = ? AND password = ?",
		"args": ["admin", "123456"],
	}
]
*/
// Khoan dùng vì chưa hoàn thiện
const prepareStatements = async (statements) => {
	return await new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if (err) return reject(err)
			statements.forEach((statement) => {
				conn.query(statement.sql, statement.args, (err, rows) => {
					if (err) return reject(err)
				})
			})
			pool.releaseConnection(conn)
			resolve()
		})
	})
}

module.exports = {
	prepareStatement,
	prepareStatements,
	pool,
}

// Cách Query
// Cách 1 Dùng khi 1 connection query nhiều lần:
// For pool initialization, see above
// pool.getConnection(function(err, conn) {
//     // Do something with the connection
//     conn.query(/* ... */);
//     // Don't forget to release the connection when finished!
//     pool.releaseConnection(conn);
//  })

// Cách 2 Dùng khi chỉ cần 1 lần query => Connection tự động đóng:
// For pool initialization, see above
// pool.query("SELECT field FROM atable", function(err, rows, fields) {
//     // Connection is automatically released when query resolves
//  })

// Dùng promise

// async function main() {
//     // get the client
//     const mysql = require('mysql2');
//     // create the pool
//     const pool = mysql.createPool({host:'localhost', user: 'root', database: 'test'});
//     // now get a Promise wrapped instance of that pool
//     const promisePool = pool.promise();
//     // query database using promises
//     const [rows,fields] = await promisePool.query("SELECT 1");
// }
