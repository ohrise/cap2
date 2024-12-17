const express = require('express');
const ModifyServices = require('../services/ModifyServices.js');
const pool = require('../pgConnect.js'); // PostgreSQL 연결
const ModifyController = express.Router();

// 특정 게시글 정보 가져오기 (GET 요청)
ModifyController.get('/reports/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const { fireResult, predictionResult, modifyResult } = await ModifyServices.getFireInformationAndPrediction(postId);

    res.status(200).json({
      success: true,
      fireResult,
      predictionResult,
      modifyResult, // modifyResult 추가
    });
  } catch (error) {
    console.error('Error in ModifyController:', error);
    res.status(500).json({
      success: false,
      error: '서버에서 데이터를 가져오는 중 오류가 발생했습니다.',
    });
  }
});



ModifyController.patch('/reports/:id', async (req, res) => {
  const postId = req.params.id;
  const { firefighter, ambulance, water, ladder, pumper, input } = req.body;

  console.log("Controller - Received data:", { postId, firefighter, ambulance, water, ladder, pumper, input });

  try {
    const updatedData = await ModifyServices.updateModify(
      postId, firefighter, ambulance, water, ladder, pumper, input // 정확한 순서로 전달
    );

    res.status(200).json({
      success: true,
      message: "Modify 정보가 성공적으로 수정되었습니다.",
      updatedData,
    });
  } catch (error) {
    console.error("Error updating modify data:", error.message);
    res.status(500).json({
      success: false,
      error: "Modify 정보를 수정하는 중 오류가 발생했습니다.",
    });
  }
});



module.exports = ModifyController;