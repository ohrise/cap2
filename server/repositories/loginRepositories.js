//DB와 server의 소통 
//login

const pool = require('../pgConnect.js'); // PostgreSQL 연결
const bcrypt = require('bcrypt');

/**

 * @param {string} user_id 
 * @returns {Object|null}
 */
async function findUserById(user_id) {
  const sql = 'SELECT * FROM user_table WHERE user_id = $1';
  
  try {
    // DB 조회
    const result = await pool.query(sql, [user_id]);
		console.log('DB Result:', result);
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    return null;
  } catch (error) {
    console.error('DB 조회 오류:', error);
    throw error;
  }
}

/**
 
 * @param {string} inputPassword 
 * @param {string} storedPassword 
 * @returns {boolean} - 비밀번호가 일치하면 true, 아니면 false.
 */
async function verifyPassword(inputPassword, storedPassword) {
  try {
    console.log('Input Password:', inputPassword);  
    console.log('Stored Password:', storedPassword); 
    const match = await bcrypt.compare(inputPassword, storedPassword);
    console.log('Password Match:', match); 
    return match;
  } catch (error) {
    console.error('비밀번호 비교 오류:', error);
    throw error;
  }
}

module.exports = {
  findUserById,
  verifyPassword,
};
