
var FeedbackinformationRepository = require("/Users/oseli/Desktop/캡스톤 2/코드/finalcap2/server/repositories/FeedbackinformationRepository.js"); // 사용자 데이터 저장하는 repository
var pool = require('/Users/oseli/Desktop/캡스톤 2/코드/finalcap2/server/pgConnect.js'); // PostgreSQL 연결
// 로그인
async function login(userData) {
    const { user_id, password } = userData;

    // 1. 사용자 ID 확인
    const existingUser = await loginRepository.findById(user_id);
    if (!existingUser) {
        const error = new Error('존재하지 않는 ID입니다.');
        error.code = 404; // 사용자 없음
        throw error;
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        const error = new Error('비밀번호가 일치하지 않습니다.');
        error.code = 403; // 인증 실패
        throw error;
    }

    // 3. 성공적으로 로그인한 사용자 데이터 반환
    return filterSensitiveData(existingUser);
}

// 민감한 데이터 필터링
function filterSensitiveData(user) {
    const { password, ...rest } = user; // 비밀번호는 반환하지 않음
    return rest;
}

module.exports = {
    login,
    filterSensitiveData,
};
