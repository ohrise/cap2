import React, { createContext, useState, useContext } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [showPredictResult, setShowPredictResult] = useState(false);
    const [predictResultData, setPredictResultData] = useState(null); // PredictResult 데이터를 저장

    const enablePredictResult = (data) => {
        if (!data) return; // 데이터 유효성 검사
        setShowPredictResult(true);
        setPredictResultData(data); // 데이터를 저장
    };

    // Sidebar 상태 초기화
    const resetSidebar = () => {
        setShowPredictResult(false);
        setPredictResultData(null); // 데이터 초기화
    };

    return (
        <SidebarContext.Provider value={{ showPredictResult, enablePredictResult, resetSidebar, predictResultData }}>
            {children}
        </SidebarContext.Provider>
    );
};

// SidebarContext를 안전하게 가져오는 Hook
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};