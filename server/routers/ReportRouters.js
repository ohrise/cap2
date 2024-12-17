var express = require('express');
var ReportServices= require('../services/ReportServices.js'); // 피드백 서비스

const ReportController = express.Router();

ReportController.get('/report', async (req, res) => {
  try {
    const posts = await ReportServices.fetchAllPosts(); // 모든 게시글 가져오기

    res.status(200).json({ 
      success: true, 
      posts: posts // 게시글 리스트 반환
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      success: false, 
      error: '게시글을 가져오는 중 오류가 발생했습니다.' 
    });
  }
});

ReportController.post('/api/report/:id/view', async (req, res) => {
	const { id } = req.params;
	try {
			const report = await Report.findById(id);
			if (!report) {
					return res.status(404).json({ success: false, error: '리포트를 찾을 수 없습니다.' });
			}
			report.views = (report.views || 0) + 1;
			await report.save();
			res.json({ success: true, updatedViews: report.views });
	} catch (err) {
			res.status(500).json({ success: false, error: '조회수 업데이트에 실패했습니다.' });
	}
});



module.exports = ReportController;
