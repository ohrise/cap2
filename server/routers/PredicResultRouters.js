var express = require('express');
var FeedbackService = require('../services/PredicResultService.js'); // 피드백 서비스

const PredicResultController = express.Router();

PredicResultController.get('/predicresult', async (req, res) => {
  try {
    const prediction = await FeedbackService.predictFireAnalysisAndSave();
    const fireInformation = await FeedbackService.UserFireInformation();

		console.log('Prediction:', prediction);
   console.log('Fire Information:', fireInformation);
 
    // data1로 감싸지 않고 데이터를 바로 반환
    res.status(200).json({ 
      success: true, 
      prediction: prediction, 
      fireInformation: fireInformation
    });
  } catch (error) {
    console.error('Error in PredicResultController:', error);
    res.status(500).json({ 
      success: false, 
      error: '서버에서 예측을 처리하지 못했습니다.' 
    });
  }
});


module.exports = PredicResultController;
