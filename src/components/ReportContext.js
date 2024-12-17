import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReportContext.css";

function ReportContext() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actualData, setActualData] = useState({
    fireFighter: "",
    ladder: "",
    waterTank: "",
    pump: "",
  });
  const [fireResult, setFireResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [modifyResult, setModifyResult] = useState(null); // modify 데이터 상태 추가
  const [feedback, setFeedback] = useState("");
  const [accuracy, setAccuracy] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleActualDataChange = (e) => {
    const { name, value } = e.target;
    setActualData({ ...actualData, [name]: value });
  };

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/reports/${id}`);
        const { fireResult, predictionResult, modifyResult } = response.data;

        setFireResult(fireResult);
        setPredictionResult(predictionResult);
        setModifyResult(modifyResult); // modifyResult 상태 업데이트
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [id]);

  const calculateAccuracy = (actualData) => {
    const expected = {
      fireFighter: 36,
      ambulance: 5,
      pump: 3,
      waterTank: 2,
      ladder: 2,
    };

    let correct = 0;
    let total = 5;

    if (parseInt(actualData.fireFighter) === expected.fireFighter) correct++;
    if (parseInt(actualData.ambulance) === expected.ambulance) correct++;
    if (parseInt(actualData.pump) === expected.pump) correct++;
    if (parseInt(actualData.waterTank) === expected.waterTank) correct++;
    if (parseInt(actualData.ladder) === expected.ladder) correct++;

    return Math.round((correct / total) * 100);
  };

  const handleFeedbackChange = (e) => {
    const { value } = e.target;
    setFeedback(value);
  };

  const handleSave = async () => {
		try {
			// 정확도 계산: 실제 데이터(actualData)와 예측 결과(predictionResult)를 비교해야 함.
			const calculatedAccuracy = calculateAccuracy(actualData); // actualData 사용
			setAccuracy(calculatedAccuracy);
	
			const postData = {
				firefighter: predictionResult.firefighter || '',
				ambulance: predictionResult.ambulance || '',
				water: predictionResult.water || '',
				ladder: predictionResult.ladder || '',
				pumper: predictionResult.pumper || '',
				input: feedback || '',
			};
	
			const response = await axios.patch(`http://localhost:5000/api/reports/${id}`, postData);
	
			if (response.status === 200) {  // 상태 코드 200 확인
				alert("수정이 성공적으로 완료되었습니다.");
				setIsEditing(false);
				setFeedback(""); // 피드백 초기화
			} else {
				throw new Error("수정에 실패했습니다.");
			}
		} catch (err) {
			setError("수정 중 오류가 발생했습니다.");
			console.error(err);
		}
	};
	

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading) return <h1>로딩 중...</h1>;
  if (error) return <h1>에러: {error}</h1>;

  return (
    <div className="report-detail-container">
      <h1>리포트 상세 정보 (ID: {id})</h1>

      <section className="section">
        <h2>실제 데이터</h2>
        {fireResult ? (
          <ul>
            <li>화재 날짜: {fireResult.fire_date || "N/A"}</li>
            <li>화재 시간: {fireResult.fire_time || "N/A"}</li>
            <li>날씨: {fireResult.weather || "N/A"}</li>
            <li>교통 상황: {fireResult.traffic_condition || "N/A"}</li>
            <li>화재 유형: {fireResult.fire_type || "N/A"}</li>
            <li>화재 크기: {fireResult.fire_size || "N/A"}</li>
            <li>도시: {fireResult.city || "N/A"}</li>
            <li>구: {fireResult.district || "N/A"}</li>
          </ul>
        ) : (
          <p>실제 데이터가 없습니다.</p>
        )}
      </section>

      <section className="section">
        <h2>예측 결과</h2>
        {predictionResult ? (
          <ul>
            <li>소방관: {predictionResult.firefighter || "N/A"}</li>
            <li>사다리차: {predictionResult.ladder || "N/A"}</li>
            <li>구급차: {predictionResult.ambulance || "N/A"}</li>
            <li>물탱크차: {predictionResult.water || "N/A"}</li>
            <li>펌프차: {predictionResult.pumper || "N/A"}</li>
          </ul>
        ) : (
          <p>예측 결과가 없습니다.</p>
        )}
      </section>

      <section className="section">
        <h2>Modify 데이터</h2>
        {modifyResult ? (
          <ul>
            <li>소방대원: {modifyResult.firefighter || "N/A"}</li>
            <li>구급차: {modifyResult.ambulance || "N/A"}</li>
            <li>펌프트럭: {modifyResult.pumper || "N/A"}</li>
            <li>물탱크차: {modifyResult.water || "N/A"}</li>
            <li>사다리차: {modifyResult.ladder || "N/A"}</li>
          </ul>
        ) : (
          <p>Modify 데이터가 없습니다.</p>
        )}
      </section>

      {!isEditing && (
        <>
          <section className="section">
            <h2>실제 데이터</h2>
            <ul>
              <li>소방대원: {actualData.fireFighter || "N/A"}</li>
              <li>구급차: {actualData.ambulance || "N/A"}</li>
              <li>펌프트럭: {actualData.pump || "N/A"}</li>
              <li>물탱크: {actualData.water || "N/A"}</li>
              <li>사다리차: {actualData.ladder || "N/A"}</li>
            </ul>
          </section>

          <section className="section">
            <h2>결과</h2>
            <p>정확도: {accuracy !== null ? `${accuracy}%` : "N/A"}</p>
            <p>피드백: {feedback || "N/A"}</p>
          </section>

          <div className="button-container">
            <button className="edit-button" onClick={handleEdit}>
              수정
            </button>
          </div>
        </>
      )}

      {isEditing && (
        <section className="section">
          <h2>실제 데이터 및 피드백</h2>
          <div className="feedback-form">
            <label>
              실제 소방대원:
              <input
                type="text"
                name="fireFighter"
                value={actualData.fireFighter}
                onChange={handleActualDataChange}
              />
            </label>
            <label>
              실제 구급차:
              <input
                type="text"
                name="ambulance"
                value={actualData.ambulance}
                onChange={handleActualDataChange}
              />
            </label>
            <label>
              실제 펌프:
              <input
                type="text"
                name="pump"
                value={actualData.pump}
                onChange={handleActualDataChange}
              />
            </label>
            <label>
              실제 물탱크:
              <input
                type="text"
                name="water"
                value={actualData.water}
                onChange={handleActualDataChange}
              />
            </label>
            <label>
              실제 사다리차:
              <input
                type="text"
                name="ladder"
                value={actualData.ladder}
                onChange={handleActualDataChange}
              />
            </label>
            <label>
              피드백:
              <textarea
                value={feedback}
                onChange={handleFeedbackChange}
              />
            </label>
            <button className="save-button" onClick={handleSave}>
              저장
            </button>
          </div>
        </section>
      )}
			{/* 목록으로 돌아가기 버튼 */}
			<button className="back-button" onClick={() => navigate("/report")}>
                목록으로 돌아가기
            </button>
        </div>
  );
}

export default ReportContext;
