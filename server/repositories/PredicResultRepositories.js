//DB와 server의 소통 
//PredicResult
// DB와 서버의 소통 - PredicResult Repository
const pool = require('../pgConnect.js'); // PostgreSQL 연결

const FireInformation = async () => {
  const query = `
    SELECT *
    FROM fire_incident 
    ORDER BY id DESC 
    LIMIT 1
  `;
  try {
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      console.error('No data found in the database.');
      return null; // 데이터가 없을 경우 null 반환
    }

    console.log('Latest fire incident data:', result.rows[0]); // 로그 추가
    return result.rows[0];
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error; // 에러를 호출자에게 전달
  }
};



// 최신 데이터 가져오기
const getLatestInput = async () => {
  const query = `
    SELECT weather,traffic_condition,fire_type,fire_size
    FROM fire_incident 
    ORDER BY id DESC 
    LIMIT 1
  `;

  try {
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      throw new Error('No data found in the database.');
    }

    return result.rows[0]; // 최신 데이터 반환
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error; // 에러를 호출자에게 전달
  }
};

const savePredictionResult = async (data) => {
  const query = `
    INSERT INTO history (firefighter, ambulance, water, ladder, pumper)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [
    data.firefighter,
    data.ambulance,
    data.water,
    data.ladder,
    data.pumper,
  ];

  try {
    await pool.query(query, values);
    console.log('Prediction result saved to database.');
  } catch (error) {
    console.error('Error saving prediction result to database:', error.message);
    throw error;
  }
};

const insertModify = async (data) => {
  const query = `
    INSERT INTO modify (firefighter, ambulance, water, ladder, pumper, input)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [
    data.firefighter,
    data.ambulance,
    data.water,
    data.ladder,
    data.pumper,
    data.input || null, // input이 null이어도 허용
  ];

  try {
    await pool.query(query, values);
    console.log('modify result saved to database.');
  } catch (error) {
    console.error('Error saving modify result to database:', error.message);
    throw error;
  }
};




const predictSave = async (predictionResult) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');  // 트랜잭션 시작

    // 두 테이블에 예측 결과 저장
    await savePredictionResult(predictionResult, client);  // history 테이블에 저장
    await insertModify(predictionResult, client);          // modify 테이블에 저장

    await client.query('COMMIT'); // 트랜잭션 커밋

    console.log('Prediction result saved to both tables.');
    return predictionResult;  // 예측 결과 반환
  } catch (error) {
    await client.query('ROLLBACK'); // 오류가 발생하면 롤백
    console.error('Error in saving prediction result:', error);
    throw error;  // 에러를 호출자에게 전달
  } finally {
    client.release(); // 클라이언트 연결 해제
  }
};


module.exports = {
	FireInformation,
  getLatestInput,
  savePredictionResult,
	insertModify,
	predictSave
};