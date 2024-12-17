import React, { useEffect, useState } from 'react';
import axios from 'axios'; // API 호출을 위한 Axios
import { useNavigate } from "react-router-dom";
import Sidebar from './Sidebar';
import './Report.css';

function Report() {
    const [reports, setReports] = useState([]); // 게시글 데이터 상태 관리
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 관리
    const [sortOrder, setSortOrder] = useState("latest"); // 정렬 순서 상태 관리
		const navigate = useNavigate(); // URL 이동을 위한 hook

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR'); // 'ko-KR'을 사용하여 한국식 날짜 형식으로 출력
    };

    useEffect(() => {
        const fetchReports = async () => {
            try {
                // 서버가 로컬에서 제대로 동작하는지 확인
                const response = await axios.get('http://43.200.27.116:5000/api/report');
                if (response.data.success) {
                    setReports(response.data.posts); // 게시글 데이터 상태 업데이트
                } else {
                    throw new Error(response.data.error || '게시글을 가져오는 데 실패했습니다.');
                }
            } catch (err) {
                setError(err.message || 'API 호출 중 오류가 발생했습니다.'); // 더 구체적인 오류 메시지
                console.error(err); // 더 자세한 오류 정보 출력
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchReports();
    }, []); // 컴포넌트가 처음 렌더링될 때 한 번 실행

		const handleReportClick = (report) => {
			try {
					// report/id 페이지로 이동
					navigate(`/reports/${report.id}`);
			} catch (err) {
					console.error('페이지 이동 중 오류:', err);
			}
	};
	
    const filteredReports = reports
        .filter((report) =>
            report.summary?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const dateA = new Date(a.fire_date || 0);
            const dateB = new Date(b.fire_date || 0);
            if (sortOrder === "latest") return dateB - dateA;
            if (sortOrder === "oldest") return dateA - dateB;
            return 0;
        });

    if (loading) {
        return <div className="page-container">Loading...</div>; // 로딩 상태 표시
    }

    if (error) {
        return <div className="page-container">Error: {error}</div>; // 에러 메시지 표시
    }

    return (
        <div className="page-container">
            <Sidebar />
            <div className="content">
                <h1>화재 리포트</h1>
                <div className="controls-container">
                    <input
                        type="text"
                        placeholder="찾고 싶은 리포트를 검색하시오."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="sort-select"
                    >
                        <option value="latest">최신순</option>
                        <option value="oldest">오래된 순</option>
                    </select>
                </div>
                {reports.length === 0 ? (
                    <p className="no-results">검색 결과가 없습니다.</p>
                ) : (
                    <div className="report-list-container">
                        <ul className="report-list">
                            {reports.map((report) => (
                                <li key={report.id} 
																className="report-item"  
																onClick={() => handleReportClick(report)} // 클릭 이벤트
																>
                                    <strong>
                                        🔥 리포트 #{report.id} - {formatDate(report.fire_date)}
                                    </strong>
                                    <p>{report.city}</p>
                                    <p>{report.district}</p>
																		<p className="views">조회수: {report.views}</p>
                                <p>URL: {report.reportURL}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Report;
