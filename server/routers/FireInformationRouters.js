const express = require('express');
const { insertFireInformation } = require('../repositories/FireinformationRepositories.js');

const FireinformationRouter = express.Router();

FireinformationRouter.post('/fireinformation', async (req, res) => {
  const { 
    fire_date, 
    fire_time, 
    city, 
    district, 
    traffic_condition, 
    fire_type, 
    fire_size, 
    weather 
  } = req.body;

  // 필수 필드 검증
  if (!fire_date || !fire_time || !city || !district || !traffic_condition || !fire_type || !fire_size || !weather) {
    return res.status(400).json({ message: '모든 필드를 입력하세요.' });
  }

  // 날짜와 시간 검증
  const dateRegex = /^\d{8}$/; // YYYYMMDD
  const timeRegex = /^\d{4}$/; // HHMM
  if (!dateRegex.test(fire_date) || !timeRegex.test(fire_time)) {
    return res.status(400).json({ message: '날짜 또는 시간이 올바른 형식이 아닙니다.' });
  }

  try {
    // DB에 화재 정보 저장
    await insertFireInformation({
      fire_date,
      fire_time,
      city,
      district,
      traffic_condition,
      fire_type,
      fire_size,
      weather
    });

    console.log('화재 정보 저장 완료');
    res.status(201).json({ message: '화재 정보와 날씨가 성공적으로 저장되었습니다.' });
  } catch (error) {
    console.error('오류 발생:', error);
    res.status(500).json({ message: '서버 오류', error: error.message });
  }
});

module.exports = FireinformationRouter;
