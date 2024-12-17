const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../pgConnect.js'); 
const SignupService = require('../services/SignupService.js'); 


const Singuprouter = express.Router(); 

Singuprouter.post('/signup', async (req, res) => {
    const { 
        user_id, 
        user_name, 
        user_password,  
        user_email, 
        user_mobile
    } = req.body;

    // 입력값 검증
    if (!user_id || !user_name || !user_password || !user_email || !user_mobile ) {
        return res.status(400).json({ message: '모든 필드를 입력하세요.' });
    }

    try {
        // 비밀번호 암호화 및 회원가입 처리
        const hashedPassword = await bcrypt.hash(user_password, 10);

        const sql = `
            INSERT INTO user_table (user_id, user_name, user_password, user_email, user_mobile)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(sql, [user_id, user_name, hashedPassword, user_email, user_mobile]);

        res.status(201).json({ message: '회원가입 성공!' });
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ message: '서버 오류. 다시 시도하세요.' });
    }
});

module.exports = Singuprouter;
