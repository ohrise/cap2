const axios = require('axios');
const xlsx = require('xlsx');
const pool = require('../pgConnect.js'); // PostgreSQL 연결

// 엑셀 파일 경로
const excelFilePath = './location.xlsx';

const workbook = xlsx.readFile(excelFilePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

// 도시와 지역에 해당하는 좌표 찾기
async function getLocationCoordinates(city, district) {
  var locationData = data.find(row => row[Object.keys(row)[0]] === city && row[Object.keys(row)[1]] === district);

  if (locationData) {
    // 해당 데이터가 있으면 nx, ny 값을 반환
    console.log('좌표 찾기 성공:', {
      city,
      district,
      nx: locationData[Object.keys(locationData)[2]],
      ny: locationData[Object.keys(locationData)[3]]
    });
    return { nx: locationData[Object.keys(locationData)[2]], ny: locationData[Object.keys(locationData)[3]] };
  }

  console.error('좌표 찾기 실패:', { city, district });
  return null;
}

// 날씨 정보 가져오기
async function getWeatherInfo(city, district, dateInput, timeInput) {
	const coordinates = await getLocationCoordinates(city, district);
	if (!coordinates) {
			throw new Error('해당 위치의 좌표를 찾을 수 없습니다.');
	}

	const { nx, ny } = coordinates;
	console.log('좌표:', { nx, ny });
	console.log('날씨 요청:', { dateInput, timeInput });

	const apiUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
	const serviceKey = 'DSQRNtEytEgIHvSIiIc0BVZP6fHjNZvzWzJO7dZqPVURPfN0TLjYV89A6Ht4+Iv905FtGseBc/5Ji7sYOEcXcw==';

	const queryParams = `?serviceKey=${encodeURIComponent(serviceKey)}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${dateInput}&base_time=${timeInput}&nx=${nx}&ny=${ny}`;
	
	try {
			console.log('API 요청 URL:', apiUrl + queryParams);
			const response = await axios.get(apiUrl + queryParams);
			
			
			// 응답 데이터 확인
			console.log('API 응답:', response.data);

			const items = response?.data?.response?.body?.items?.item || [];
			if (!items.length) {
					throw new Error('API 응답에 날씨 데이터가 없습니다.');
			}

			let weatherConditions = new Set();

			items.forEach(item => {
					if (item.category === 'PTY') {
							const ptyMapping = { '0': '맑음', '1': '비', '2': '비/눈', '3': '눈', '5': '이슬비', '6': '빗방울/눈날림', '7': '눈날림' };
							if (ptyMapping[item.obsrValue]) weatherConditions.add(ptyMapping[item.obsrValue]);
					} else if (item.category === 'SKY') {
							const skyMapping = { '1': '맑음', '3': '구름많음', '4': '흐림' };
							if (skyMapping[item.obsrValue]) weatherConditions.add(skyMapping[item.obsrValue]);
					} else if (item.category === 'REH' && item.obsrValue >= 80) {
							weatherConditions.add('습함');
					} else if (item.category === 'WSD' && item.obsrValue >= 4) {
							weatherConditions.add('바람');
					}
			});

			const weather = Array.from(weatherConditions).join(', ');
			console.log('날씨 출력 결과:', weather);

			return weather;
	} catch (error) {
			console.error('날씨 정보 가져오기 실패:', error.message);
			throw new Error('날씨 정보를 가져오는 데 실패했습니다.');
	}
}




// 화재 정보 DB에 저장
async function insertFireInformation(fireInfo) {
  const { fire_date, fire_time, city, district, traffic_condition, fire_type, fire_size } = fireInfo;

  // 날짜 및 시간 형식 변환 (API 요구사항에 맞게)
  const formattedDate = fire_date.replace(/-/g, ''); // 2024-12-03 -> 20241203
  const formattedTime = fire_time.replace(':', '').slice(0, 4); // 16:00:00 -> 1600

  try {
    // 날씨 정보 가져오기
    console.log('날씨 정보 요청:', { city, district, formattedDate, formattedTime });
    const weather = await getWeatherInfo(city, district, formattedDate, formattedTime);

    console.log('가져온 날씨 정보:', weather);

    // SQL 쿼리문
    const sql = `
      INSERT INTO fire_incident (fire_date, fire_time, city, district, traffic_condition, fire_type, fire_size, weather)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;

    // 쿼리 실행
    const result = await pool.query(sql, [
      fire_date,
      fire_time,
      city,
      district,
      traffic_condition,
      fire_type,
      fire_size,
      weather,
    ]);

    console.log('DB 저장 완료:', result.rowCount, '행이 삽입되었습니다.');
  } catch (error) {
    console.error('DB 저장 실패:', error.message, {
      fire_date,
      fire_time,
      city,
      district,
      traffic_condition,
      fire_type,
      fire_size,
    });
    throw new Error('DB 저장 실패: ' + error.message);
  }
}


module.exports = {
  getLocationCoordinates,
  getWeatherInfo,
  insertFireInformation
};
