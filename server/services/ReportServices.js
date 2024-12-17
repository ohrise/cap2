// services/ReportServices.js
var { getAllPosts } = require('../repositories/ReportRepositories.js');  // 경로 수정


const fetchAllPosts = async () => {
  try {
    // Repository의 getAllPosts 호출
    const posts = await getAllPosts();
    return posts; 
  } catch (error) {
    console.error('Error in fetchAllPosts service:', error.message);
    throw error; 
  }
};

module.exports = {
  fetchAllPosts
};
