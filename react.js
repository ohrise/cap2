import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSidebar } from "./SidebarContext";
import "./ReportContext.css";

function ReportContext() {
    const { id } = useParams(); // URL에서 id 가져오기
    const navigate = useNavigate(); // 목록으로 돌아가기 위한 훅
    const { predictResultData } = useSidebar(); // 전역 데이터 가져오기

    // 초기 상태
    const [actualData, setActualData] = useState({
        fireFighter: "",
        ladder: "",
        waterTank: "",
        pump: "",
    });
    const [feedback, setFeedback] = useState("");
    const [isSaved, setIsSaved] = useState(false); // 저장 여부
    const [isEditing, setIsEditing] = useState(false); // 수정 여부
    const [accuracy, setAccuracy] = useState(null); // 정확도 계산 결과

    const handleActualDataChange = (e) => {
        const { name, value } = e.target;
        setActualData({ ...actualData, [name]: value });
    };

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
    };

    const calculateAccuracy = () => {
        const expected = {
            fireFighter: 36,
            ambulance: 5,
            pump: 3,
            waterTank: 2,
            ladder: 2,
        };

        let total = 5; // 총 항목 수
        let correct = 0;

        if (parseInt(actualData.fireFighter) === expected.fireFighter) correct++;
        if (parseInt(actualData.ambulance) === expected.ambulance) correct++;
        if (parseInt(actualData.pump) === expected.pump) correct++;
        if (parseInt(actualData.waterTank) === expected.waterTank) correct++;
        if (parseInt(actualData.ladder) === expected.ladder) correct++;
        

        return Math.round((correct / total) * 100); // 퍼센트 계산
    };

    const handleSave = () => {
        const calculatedAccuracy = calculateAccuracy(); // 정확도 계산
        setAccuracy(calculatedAccuracy);
        setIsSaved(true); // 저장 상태 변경
        setIsEditing(false); // 수정 종료
    };

    const handleEdit = () => {
        setIsEditing(true); // 수정 활성화
    };

    if (!predictResultData) {
        return <h1>리포트 데이터를 찾을 수 없습니다.</h1>;
    }

    // 예측 데이터
    const { fireDate, fireTime, fireLocation, subLocation } = predictResultData;

    return (
        <div className="report-detail-container">
            <h1>🔥 리포트 #{id} 상세 정보</h1>

            {/* 사용자 입력 */}
            <section className="section">
                <h2>사용자 입력</h2>
                <ul>
                    <li>화재 발생 날짜: {fireDate}</li>
                    <li>화재 발생 시간: {fireTime}</li>
                    <li>화재 위치: {fireLocation}</li>
                    <li>세부 위치: {subLocation}</li>
                </ul>
            </section>

            {/* 예측 데이터 */}
            <section className="section">
                <h2>예측 데이터</h2>
                <ul>
                    <li>소방대원: {predictResultData.fireFighter || "36명"}</li>
                    <li>구급차: {predictResultData.ambulance || "5대"}</li>
                    <li>펌프트럭: {predictResultData.pump || "3대"}</li>
                    <li>물탱크차: {predictResultData.waterTank || "2대"}</li>
                    <li>사다리차: {predictResultData.ladder || "2개"}</li>
                </ul>
            </section>

            {/* 수정 모드가 아닐 때 */}
            {!isEditing && (
                <>
                    <section className="section">
                        <h2>실제 데이터</h2>
                        <ul>
                            <li>소방대원: {actualData.fireFighter || "N/A"}</li>
                            <li>구급차: {actualData.ambulance || "N/A"}</li>
                            <li>펌프트럭: {actualData.pump || "N/A"}</li>
                            <li>물탱크: {actualData.waterTank || "N/A"}</li>
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

            {/* 수정 모드일 때 */}
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
                            실제 펌프트럭:
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
                                name="waterTank"
                                value={actualData.waterTank}
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
                                name="feedback"
                                value={feedback}
                                onChange={handleFeedbackChange}
                            ></textarea>
                        </label>
                        <div className="button-container">
                            <button className="save-button" onClick={handleSave}>
                                저장
                            </button>
                        </div>
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