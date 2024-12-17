import React from 'react';
import './NoticePannel.css';

const notices = [
    {
        title: "소방 대응 시스템 점검 예정",
        date: "2024년 5월 15일",
        description: "00:00 ~ 03:00에 시스템 점검이 진행됩니다.",
        link: null,
    },
    {
        title: "화재 예방 캠페인 참여 신청 마감",
        date: "2024년 4월 20일",
        description: "캠페인 참여 신청이 마감됩니다.",
        link: "https://example.com/campaign",
    },
    {
        title: "실시간 통계 기능 개선 완료",
        date: "최근 업데이트",
        description: "통계 기능이 개선되었습니다.",
        link: null,
    },
    {
        title: "신규 소방 장비 도입",
        date: "2024년 3월 25일",
        description: "최신 소방 장비가 도입됩니다. 자세한 내용은 내부 공지를 확인하세요.",
        link: "https://example.com/equipment",
    },
    {
        title: "소방 안전 교육 실시",
        date: "2024년 2월 30일",
        description: "소방 안전 교육이 오전 10시에 시작됩니다. 모든 소방대원 참석 필수.",
        link: "https://example.com/training",
    },
    {
        title: "화재 예보 서비스 출시",
        date: "2024년 1월 11일",
        description: "화재 예보 서비스를 통해 실시간 화재 발생 가능성을 예측할 수 있습니다.",
        link: null,
    },
    {
        title: "긴급 구조대 훈련 일정 안내",
        date: "2024년 1월 5일",
        description: "긴급 구조대 훈련이 다음 주부터 시작됩니다. 일정은 내부 공지를 확인하세요.",
        link: "https://example.com/training-schedule",
    },
    {
        title: "화재 위험 지역 업데이트",
        date: "2023년 12월 10일",
        description: "최근 데이터를 바탕으로 화재 위험 지역이 업데이트되었습니다.",
        link: null,
    },
];

function NoticePanel() {
    return (
        <div className="notice-panel">
            {/* 공지사항 타이틀 */}
            <h3 className="notice-title">공지사항</h3>
            <ul className="notice-list">
                {notices.map((notice, index) => (
                    <li key={index} className="notice-item">
                        {/* 공지사항 헤더 */}
                        <div className="notice-header">
                            <span className="notice-date">{notice.date}</span>
                            <span className="notice-item-title">{notice.title}</span>
                        </div>
                        {/* 공지사항 설명 */}
                        <p className="notice-description">{notice.description}</p>
                        {/* 공지사항 링크 */}
                        {notice.link && (
                            <a
                                href={notice.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="notice-link"
                            >
                                [자세히 보기]
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NoticePanel;