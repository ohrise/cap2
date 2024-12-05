
// services/FeedbackService.js
var { spawn } = require('child_process');
var { getLatestInput, savePredictionResult, FireInformation } = require('../repositories/PredicResultRepositories.js');  // 경로 수정
var pool = require('../pgConnect.js'); // PostgreSQL 연결

// Python 모델 실행 함수
const runPythonModel = async (inputData) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['/Users/oseli/Desktop/캡스톤 2/코드/finalcap2/Feedback.py', JSON.stringify(inputData)]);


    let result = '';
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python Error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(result));
        } catch (error) {
          reject(new Error('Python 결과를 JSON으로 변환하는 데 실패했습니다.'));
        }
      } else {
        reject(new Error(`Python 프로세스 종료 코드: ${code}`));
      }
    });
  });
};

// 예측 분석 및 결과 저장 함수
const predictFireAnalysisAndSave = async () => {
  try {
    // 데이터베이스에서 최신 입력 데이터 가져오기
    const latestData = await getLatestInput();

    if (!latestData) {
      throw new Error('No latest fire incident data found.');
    }

    // 문자열 데이터를 정수형으로 변환하는 매핑 로직
    const WeatherMapping = { "맑음": 1, "구름많음": 2, "흐림": 3, "비": 4, "눈": 5, "습함": 6, "바람": 7 };
    const trafficMapping = { "여유": 0, "보통": 1, "혼잡": 2, "매우혼잡": 3 };
    const fireTypeMapping = { "산업용": 0, "차량": 1, "산불": 2, "그 외": 3 };
    const fireSizeMapping = { "소": 0, "중": 1, "대": 2, "특대": 3 };

    // 정수형 데이터로 변환
    const transformedData = {
      weather: WeatherMapping[latestData.weather] ?? -1,
      traffic_condition: trafficMapping[latestData.traffic_condition] ?? -1, // 변환 실패 시 기본값 -1
      fire_size: fireSizeMapping[latestData.fire_size] ?? -1, // 변환 실패 시 기본값 -1
      fire_type: fireTypeMapping[latestData.fire_type] ?? -1, // 변환 실패 시 기본값 -1
    };

    // Python 모델 실행에 매핑된 정수형 데이터 전달
    const predictionResult = await runPythonModel({
      weather: transformedData.weather, // 변환된 weather 값 사용
      traffic_condition: transformedData.traffic_condition, // 변환된 traffic_condition 값 사용
      fire_size: transformedData.fire_size, // 변환된 fire_size 값 사용
      fire_type: transformedData.fire_type, // 변환된 fire_type 값 사용
    });

    // 예측 결과를 데이터베이스에 저장
    await savePredictionResult(predictionResult);

    return predictionResult; // 결과 반환
  } catch (error) {
    console.error('Error in predictFireAnalysisAndSave:', error);
    throw error;
  }
};


const UserFireInformation = async () => {
  try {
    // 최신 입력 데이터를 fire_incident 테이블에서 조회 (가장 최근 데이터 1개)
    const latestData = await FireInformation();

    return latestData ? latestData : null; // 최신 데이터 반환, 없으면 null 반환
  } catch (error) {
    console.error('Error in getLatestInput:', error);
    throw error; // 에러 처리
  }
};


module.exports = { 
  runPythonModel,
  predictFireAnalysisAndSave,
	UserFireInformation
};
