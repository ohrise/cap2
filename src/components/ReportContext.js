import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReportContext.css";

function ReportContext() {
  const { id } = useParams(); // URL 파라미터에서 ID 가져오기
  const navigate = useNavigate();

  // 상태 변수들
  const [modifyResult, setModifyResult] = useState(null);
  const [fireResult, setFireResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 정확도 계산 함수
  const calculateAccuracy = () => {
    if (!modifyResult || !predictionResult) return 0;

    let total = 5; // 총 항목 수
    let correct = 0;

    if (parseInt(modifyResult.firefighter) === predictionResult.firefighter) correct++;
    if (parseInt(modifyResult.ambulance) === predictionResult.ambulance) correct++;
    if (parseInt(modifyResult.pumper) === predictionResult.pumper) correct++;
    if (parseInt(modifyResult.water) === predictionResult.water) correct++;
    if (parseInt(modifyResult.ladder) === predictionResult.ladder) correct++;

    return Math.round((correct / total) * 100); // 퍼센트 계산
  };

  // 데이터를 가져오는 함수
  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/reports/${id}`);
      const { fireResult, predictionResult, modifyResult } = response.data;
      setFireResult(fireResult);
      setPredictionResult(predictionResult);
      setModifyResult(modifyResult);
    } catch (err) {
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [id]);

  // 입력 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifyResult((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 수정사항 저장
  const handleSave = async () => {
    try {
      const postData = {
        firefighter: modifyResult.firefighter,
        ambulance: modifyResult.ambulance,
        water: modifyResult.water,
        ladder: modifyResult.ladder,
        pumper: modifyResult.pumper,
        input: modifyResult.input,
      };

      const response = await axios.patch(`http://localhost:5000/api/reports/${id}`, postData);
      if (response.status === 200) {
        alert("수정이 성공적으로 완료되었습니다.");
        setIsEditing(false);
        fetchReportData(); // 수정 후 최신 데이터 다시 불러오기
      } else {
        throw new Error("수정에 실패했습니다.");
      }
    } catch (err) {
      setError("수정 중 오류가 발생했습니다. 서버 상태를 확인해주세요.");
      console.error("Error:", err);
    }
  };

  if (loading) return <h1>로딩 중...</h1>;
  if (error) return <h1>에러: {error}</h1>;

  const accuracy = calculateAccuracy(); // 정확도 계산

  return (
    <div className="report-detail-container">
      <h1>🔥 리포트 #{id} 상세 정보</h1>

      {/* Fire Incident */}
      <section className="section">
        <h2>화재 정보</h2>
        {fireResult ? (
          <ul>
            <li>날짜: {fireResult.fire_date || "N/A"}</li>
            <li>시간: {fireResult.fire_time || "N/A"}</li>
            <li>날씨: {fireResult.weather || "N/A"}</li>
            <li>화재 유형: {fireResult.fire_type || "N/A"}</li>
          </ul>
        ) : (
          <p>화재 정보가 없습니다.</p>
        )}
      </section>

      {/* 예측 결과 */}
      <section className="section">
        <h2>예측 결과</h2>
        {predictionResult ? (
          <ul>
            <li>소방관: {predictionResult.firefighter || "N/A"}</li>
            <li>구급차: {predictionResult.ambulance || "N/A"}</li>
            <li>펌프: {predictionResult.pumper || "N/A"}</li>
            <li>물탱크: {predictionResult.water || "N/A"}</li>
            <li>사다리차: {predictionResult.ladder || "N/A"}</li>
          </ul>
        ) : (
          <p>예측 결과가 없습니다.</p>
        )}
      </section>

      {/* 실제 데이터 */}
      <section className="section">
        <h2>실제 데이터</h2>
        {modifyResult ? (
          isEditing ? (
            <div className="edit-form">
              <label>
                소방대원:
                <input
                  type="number"
                  name="firefighter"
                  value={modifyResult.firefighter || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                구급차:
                <input
                  type="number"
                  name="ambulance"
                  value={modifyResult.ambulance || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                펌프:
                <input
                  type="number"
                  name="pumper"
                  value={modifyResult.pumper || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                물탱크:
                <input
                  type="number"
                  name="water"
                  value={modifyResult.water || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                사다리차:
                <input
                  type="number"
                  name="ladder"
                  value={modifyResult.ladder || ""}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                피드백:
                <textarea
                  name="input"
                  value={modifyResult.input || ""}
                  onChange={handleInputChange}
                />
              </label>
              <button className="save-button" onClick={handleSave}>
                저장
              </button>
            </div>
          ) : (
            <ul>
              <li>소방대원: {modifyResult.firefighter || "N/A"}</li>
              <li>구급차: {modifyResult.ambulance || "N/A"}</li>
              <li>펌프: {modifyResult.pumper || "N/A"}</li>
              <li>물탱크: {modifyResult.water || "N/A"}</li>
              <li>사다리차: {modifyResult.ladder || "N/A"}</li>
              <li>피드백: {modifyResult.input || "N/A"}</li>
            </ul>
          )
        ) : (
          <p>실제 데이터가 없습니다.</p>
        )}
      </section>

      {/* 결과 섹션 */}
      <section className="section">
        <h2>결과</h2>
        <p>정확도: {accuracy !== null ? `${accuracy}%` : "N/A"}</p>
        <p>피드백: {modifyResult?.input || "N/A"}</p>
      </section>

      {/* 수정 버튼 */}
      {!isEditing && (
        <button className="edit-button" onClick={() => setIsEditing(true)}>
          수정
        </button>
      )}

      {/* 목록으로 돌아가기 버튼 */}
      <button className="back-button" onClick={() => navigate("/report")}>
        목록으로 돌아가기
      </button>
    </div>
  );
}

export default ReportContext;
