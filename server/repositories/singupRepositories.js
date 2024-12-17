//DB와 server의 소통 
//signup

var pool = require('../pgConnect.js'); 
var bcrypt = require('bcrypt')

const SignupRepository = {
    /**
    
     * @param {Object} user - 사용자 정보 객체.
     * @returns {Promise<void>}
     */
    async insertUser(user) {
        const sql = `
            INSERT INTO user_table (user_id, user_name, user_password, user_email, user_mobile)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const { user_id, user_name, user_password, user_email, user_mobile } = user;

        try {
            await pool.query(sql, [user_id, user_name, user_password, user_email, user_mobile]);
        } catch (error) {
            console.error('회원 데이터 삽입 오류:', error);
            throw error;
        }
    },

    /**
    
     * @param {string} user_id - 중복 확인할 사용자 ID.
     * @returns {Promise<boolean>} - 존재하면 true, 아니면 false.
     */
    async isUserIdExists(user_id) {
        const sql = `SELECT COUNT(*) AS count FROM user_table WHERE user_id = $1`;

        try {
            const result = await pool.query(sql, [user_id]);
            return parseInt(result.rows[0].count, 10) > 0;
        } catch (error) {
            console.error('사용자 ID 확인 중 오류:', error);
            throw error;
        }
    }
};

module.exports = SignupRepository;
