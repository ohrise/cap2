var bcrypt = require('bcrypt')
var signupRepository =require("../repositories/singupRepositories.js");  // 사용자 데이터 저장하는 repository

// 회원가입
async function signUp(userData) {
    const { user_id, user_name, user_password , user_email, user_mobile } = userData;


    const existingUser = await signupRepository.findById(user_id);
    if (existingUser) {
        const error = new Error('이미 존재하는 ID입니다.');
        error.code = 409; 
        throw error;
    }


    if (user_password !== password_confirm) {
        const error = new Error('비밀번호가 일치하지 않습니다.');
        error.code = 400;  
        throw error;
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = await signupRepository.createUser({
        user_id,
        user_name,
        user_password: hashedPassword,
        user_email,
        user_mobile
    });

    return newUser;  
}


function filterSensitiveData(user) {
    const { password, ...rest } = user;
    return rest;
}


module.exports = {
	signUp,
	filterSensitiveData
};

