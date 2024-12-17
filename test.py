import pandas as pd
import numpy as np
import joblib

# 1. 학습된 모델 로드
model_file_path = '/Users/oseli/Desktop/Capstone2/Code/finalcap2/server/firefighters_vehicle_model.pkl'  # 학습된 모델 파일 경로
model = joblib.load(model_file_path)

# 2. 예측 함수 정의
def predict_firefighting_resources(input_data):
    """
    입력 데이터를 기반으로 소방대원 수와 소방차의 수를 예측합니다.
    Args:
        input_data (dict): 입력 데이터 딕셔너리 (특성 값 포함).
    Returns:
        dict: 예측된 소방대원 수와 소방차 수.
    """
    # 입력 데이터를 DataFrame으로 변환
    input_df = pd.DataFrame([input_data])
    
    # 예측 수행
    predictions = model.predict(input_df)
    
    # 예측 결과 반환
    results = {
        "투입 소방관 수": int(round(predictions[0, 0])),
        "구급차": int(round(predictions[0, 1])),
        "물탱크차": int(round(predictions[0, 2])),
        "사다리차": int(round(predictions[0, 3])),
        "물빼는차": int(round(predictions[0, 4]))
    }
    return results


input_data_example = {
    '날씨 상황': 1, 
    '교통 상황': 1, 
    '화재 크기': 1, 
    '화재 유형': 1  
}

# 4. 예측 수행
predictions = predict_firefighting_resources(input_data_example)

# 5. 결과 출력
print("예측 결과:")
for key, value in predictions.items():
    print(f"{key}: {value}")
