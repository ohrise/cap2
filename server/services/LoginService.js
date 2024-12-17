var bcrypt = require('bcrypt');
var loginRepository = require("../repositories/loginRepositories.js"); // 사용자 데이터 저장하는 repository
var pgConnect = require('../pgConnect');
// 로그인
async function login(userData) {
    const { user_id, password } = userData;

 
    const existingUser = await loginRepository.findById(user_id);
    if (!existingUser) {
        const error = new Error('존재하지 않는 ID입니다.');
        error.code = 404; // 사용자 없음
        throw error;
    }


    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        const error = new Error('비밀번호가 일치하지 않습니다.');
        error.code = 403;
        throw error;
    }

    
    return filterSensitiveData(existingUser);
}

// 민감한 데이터 필터링
function filterSensitiveData(user) {
    const { password, ...rest } = user; 
    return rest;
}

module.exports = {
    login,
    filterSensitiveData,
};
