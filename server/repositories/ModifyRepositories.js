const pool = require('../pgConnect.js'); // PostgreSQL 연결


// FireInformation 가져오기
const getFireInformation = async (postId) => {
  const fireQuery = `
    SELECT *
    FROM fire_incident
    WHERE id = $1;
  `;

  try {
    const fireResult = await pool.query(fireQuery, [postId]);
    return fireResult.rows[0]; // fire_incident 테이블의 첫 번째 행 반환
  } catch (error) {
    console.error(`Error fetching fire information for id ${postId}:`, error.message);
    throw error;
  }
};

const getPrediction = async (postId) => {
  const predictionQuery = `
    SELECT *
    FROM history
    WHERE id = $1;
  `;

  try {
    const predictionResult = await pool.query(predictionQuery, [postId]);
    return predictionResult.rows[0]; // history 테이블의 첫 번째 행 반환
  } catch (error) {
    console.error(`Error fetching prediction for id ${postId}:`, error.message);
    throw error;
  }
};

const getModify = async (postId) => {
  const modifyQuery = `
    SELECT *
    FROM modify
    WHERE id = $1;
  `;

  try {
    const modifyResult = await pool.query(modifyQuery, [postId]);
    return modifyResult.rows[0] || null; // modify 데이터가 없으면 null 반환
  } catch (error) {
    console.error(`Error fetching modify information for postId ${postId}:`, error.message);
    throw error;
  }
};



// Modify 데이터 삽입
const insertModify = async (firefighter, ambulance, water, ladder, pumper, input) => {
  const query = `
    INSERT INTO modify (firefighter, ambulance, water, ladder, pumper, input)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [firefighter, ambulance, water, ladder, pumper, input];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting data into modify table:', error.message);
    throw error;
  }
};

// Modify 데이터 수정
const updateModify = async (firefighter, ambulance, water, ladder, pumper, input) => {
  const query = `
    UPDATE modify
    SET firefighter = $1,
        ambulance = $2,
        water = $3,
        ladder = $4,
        pumper = $5,
        input = $6
    WHERE id = $7
    RETURNING *;
  `;
  const values = [firefighter, ambulance, water, ladder, pumper, input, postId];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error(`Error updating data in modify table for report_id ${postId}:`, error.message);
    throw error;
  }
};

module.exports = {
  getFireInformation,
	getModify,
	getPrediction,
  insertModify,
  updateModify,
};
