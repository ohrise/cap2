const pool = require('../pgConnect.js'); // PostgreSQL 연결

async function insertFireInformation(fireInfo) {
  const { fire_date, fire_time, city, district, traffic_condition, fire_type, fire_size, weather } = fireInfo;

  const sql = `
    INSERT INTO fire_incident (fire_date, fire_time, city, district, traffic_condition, fire_type, fire_size, weather)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;

  try {
    console.log('DB 저장 시작:', { 
      fire_date, 
      fire_time, 
      city, 
      district, 
      traffic_condition, 
      fire_type, 
      fire_size, 
      weather 
    });

    const result = await pool.query(sql, [
      fire_date,
      fire_time,
      city,
      district,
      traffic_condition,
      fire_type,
      fire_size,
      weather
    ]);

    console.log('DB 저장 완료:', result.rowCount, '행이 삽입되었습니다.');
  } catch (error) {
    console.error('DB 저장 오류:', error.message, {
      fire_date,
      fire_time,
      city,
      district,
      traffic_condition,
      fire_type,
      fire_size,
      weather
    });
    throw new Error('DB 저장 오류: ' + error.message);
  }
}

module.exports = {
  insertFireInformation
};
