const fireinformationRepository = require('../repositories/fireinformationRepository.js');

// 화재 정보와 날씨 정보를 저장하는 서비스
async function saveFireInformation(fireInfo) {
  const { fire_date, fire_time, city, district, traffic_condition, fire_type, fire_size, weather } = fireInfo;

  // 필수 필드 검증
  if (!fire_date || !fire_time || !city || !district || !traffic_condition || !fire_type || !fire_size || !weather) {
    throw new Error('모든 필드를 입력해야 합니다.');
  }

  // 날짜와 시간 형식 검증
  const dateRegex = /^\d{8}$/; // YYYYMMDD
  const timeRegex = /^\d{4}$/; // HHMM
  if (!dateRegex.test(fire_date) || !timeRegex.test(fire_time)) {
    throw new Error('날짜 또는 시간이 올바른 형식이 아닙니다.');
  }

  try {
    // 데이터 저장 요청
    await fireinformationRepository.insertFireInformation({
      fire_date,
      fire_time,
      city,
      district,
      traffic_condition,
      fire_type,
      fire_size,
      weather
    });

    console.log('화재 정보와 날씨 저장 완료');
  } catch (error) {
    console.error('서비스 오류:', error.message);
    throw new Error('화재 정보를 저장하는 데 실패했습니다.');
  }
}

module.exports = {
  saveFireInformation
};
