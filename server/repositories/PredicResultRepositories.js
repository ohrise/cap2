//DB와 server의 소통 
//PredicResult
// DB와 서버의 소통 - PredicResult Repository
const pool = require('../pgConnect.js'); 
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
      return null; 
    }

    console.log('Latest fire incident data:', result.rows[0]); 
    return result.rows[0];
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error; 
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

    return result.rows[0]; 
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error; 
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
    data.input || null, 
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
    await client.query('BEGIN');  
    
    await savePredictionResult(predictionResult, client);  
    await insertModify(predictionResult, client);         

    await client.query('COMMIT');

    console.log('Prediction result saved to both tables.');
    return predictionResult; 
  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error('Error in saving prediction result:', error);
    throw error;  
  } finally {
    client.release(); 
  }
};


module.exports = {
	FireInformation,
  getLatestInput,
  savePredictionResult,
	insertModify,
	predictSave
};