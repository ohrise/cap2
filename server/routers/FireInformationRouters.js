var express = require('express');
const path = require('path');
const { getWeatherInfo, insertFireInformation } = require(path.join(__dirname, '../repositories/FireinformationRepositories.js'));

const FireinformaionRouter = express.Router();

FireinformaionRouter.post('/fireinformation', async (req, res) => {
	const { 
    fire_date, 
    fire_time, 
    city,
    district,
    traffic_condition, 
    fire_type,
    fire_size 
  } = req.body;

  // 입력값 검증
  if (!fire_date || !fire_time || !city || !district || !traffic_condition || !fire_type || !fire_size) {
    return res.status(400).json({ message: '모든 필드를 입력하세요.' });
  }


  // 날짜와 시간 검증
  const dateRegex = /^\d{8}$/; // YYYYMMDD
  const timeRegex = /^\d{4}$/; // HHMM
  if (!dateRegex.test(fire_date) || !timeRegex.test(fire_time)) {
    return res.status(400).json({ message: '날짜 또는 시간이 올바른 형식이 아닙니다1.' });
  }

  try {
    // 날씨 정보 추출
    const weatherDescription = await getWeatherInfo(city, district, fire_date, fire_time);
    console.log('날씨 정보:', weather);

    // DB에 화재 정보 저장
    await insertFireInformation({ fire_date, fire_time, city, district, traffic_condition, fire_type, fire_size }, weather);
    console.log('화재 정보 저장 완료');

    // 응답 반환
    res.status(201).json({ message: '화재 정보와 날씨가 성공적으로 저장되었습니다.' });
  } catch (error) {
    console.error('오류 발생:', error);
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
});

module.exports = FireinformaionRouter;
