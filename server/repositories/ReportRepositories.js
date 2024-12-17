const pool = require('../pgConnect.js'); 


const getAllPosts = async () => {
  const query = `
    SELECT id, fire_date, city, district
    FROM fire_incident
    ORDER BY id DESC
  `;

  try {
    const result = await pool.query(query);
    console.log(result.rows); 
    return result.rows; 
  } catch (error) {
    console.error('Error fetching posts from database:', error.message);
    throw error;
  }
};





module.exports = {
  getAllPosts
};
