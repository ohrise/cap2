import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "./SidebarContext";
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showPredictResult, resetSidebar } = useSidebar(); // Sidebar 상태 관리

    const handleLogoutClick = () => {
        resetSidebar(); // PredictResult 상태 초기화
        navigate("/logout", { state: { from: location.pathname } }); // 로그아웃 후 리디렉션
    };

    const menuItems = [
        { path: "/", label: "Dashboard" },
        { path: "/fireinformation", label: "Fire Information" },
        { path: "/predictresult", label: "Predict Result", condition: showPredictResult }, // 조건부 렌더링
        { path: "/report", label: "Report" }
        // { path: "/feedback", label: "Feedback" },
    ];

    return (
        <nav className="sidebar">
            <ul>
                {menuItems.map(
                    ({ path, label, condition = true }) =>
                        condition && (
                            <li key={path} className={location.pathname === path ? "active" : ""}>
                                <Link to={path}>{label}</Link>
                            </li>
                        )
                )}
                <li>
                    <button onClick={handleLogoutClick} className="logout-button">
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;