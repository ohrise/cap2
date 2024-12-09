import React, { useEffect, useState } from 'react';
import axios from 'axios'; // API 호출을 위한 Axios
import Sidebar from './Sidebar';
import './Report.css';

function Report() {
    const [reports, setReports] = useState([]); // 게시글 데이터 상태 관리
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(null); // 에러 상태 관리

		const formatDate = (dateString) => {
			const date = new Date(dateString);
			return date.toLocaleDateString('ko-KR');  // 'ko-KR'을 사용하여 한국식 날짜 형식으로 출력
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
					<h1>Fire Reports</h1>
					{reports.length === 0 ? (
						<p>No reports available.</p>
					) : (
						<ul>
  {reports.map((report) => (
    <li key={report.id}>
      <strong>Incident #{report.id}</strong> - {formatDate(report.fire_date)}
      <p>{report.city}</p>
      <p>{report.district}</p> {/* 오타 수정 */}
    </li>
  ))}
</ul>

					)}
				</div>
			</div>
		);
}

export default Report;
