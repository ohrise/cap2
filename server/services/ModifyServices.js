const ModifyRepositories = require('../repositories/ModifyRepositories.js');

// Fire 정보와 Prediction 정보를 함께 가져오기
const getFireInformationAndPrediction = async (postId) => {
  try {
    const fireResult = await ModifyRepositories.getFireInformation(postId);
    const predictionResult = await ModifyRepositories.getPrediction(postId);
    const modifyResult = await ModifyRepositories.getModify(postId); // modify 데이터 추가

    if (!fireResult) throw new Error("fire_incident 데이터가 존재하지 않습니다.");
    if (!predictionResult) throw new Error("history 데이터가 존재하지 않습니다.");
		if (!modifyResult) throw new Error("history 데이터가 존재하지 않습니다.");
		
    return { fireResult, predictionResult, modifyResult }; // modifyResult도 반환
  } catch (error) {
    console.error(`Error in ModifyServices for postId ${postId}:`, error.message);
    throw error;
  }
};




// Modify 데이터 수정
const updateModify = async (postId, firefighter, ambulance, water, ladder, pumper, input) => {
  try {
    const updatedData = await ModifyRepositories.updateModify(postId, firefighter, ambulance, water, ladder, pumper, input);
    return updatedData;
  } catch (error) {
    console.error(`Error updating data in modify service for report_id ${postId}:`, error.message);
    throw error;
  }
};

module.exports = {
  getFireInformationAndPrediction,
  updateModify
};
