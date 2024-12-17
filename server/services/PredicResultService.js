
// services/FeedbackService.js
var { spawn } = require('child_process');
var { getLatestInput, predictSave, FireInformation } = require('../repositories/PredicResultRepositories.js');
// var { getLatestInput, predictSave, FireInformation } = require('/Users/oseli/Desktop/Capstone2/Code/finalcap2/server/repositories/PredicResultRepositories.js');
var pool = require('../pgConnect.js'); 


const runPythonModel = async (inputData) => {
  return new Promise((resolve, reject) => {
		const pythonProcess = spawn('python3', ['Feedback.py', JSON.stringify(inputData)]);




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
    const WeatherMapping = { "폭우": 1, "비": 2, "습함": 3, "흐림": 4, "눈": 5, "맑음": 6, "바람": 7 };
    const trafficMapping = { "여유": 1, "보통": 2, "혼잡": 3, "매우혼잡": 4 };
    const fireTypeMapping = { "산업용": 2, "차량": 1, "산불": 4, "그 외": 3 };
    const fireSizeMapping = { "소": 1, "중": 2, "대": 3, "특대": 4 };

    // 정수형 데이터로 변환
    const transformedData = {
      weather: WeatherMapping[latestData.weather] ?? -1,
      traffic_condition: trafficMapping[latestData.traffic_condition] ?? -1, 
      fire_size: fireSizeMapping[latestData.fire_size] ?? -1,
      fire_type: fireTypeMapping[latestData.fire_type] ?? -1, 
    };

    // Python 모델 실행에 매핑된 정수형 데이터 전달
    const predictionResult = await runPythonModel({
      weather: transformedData.weather, 
      traffic_condition: transformedData.traffic_condition, 
      fire_size: transformedData.fire_size, 
      fire_type: transformedData.fire_type, 
    });

    // 예측 결과를 데이터베이스에 저장
    await predictSave(predictionResult);

    return predictionResult; 
  } catch (error) {
    console.error('Error in predictFireAnalysisAndSave:', error);
    throw error;
  }
};


const UserFireInformation = async () => {
  try {
   
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