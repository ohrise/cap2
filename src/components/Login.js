import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // 문자열로 단순화
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); 

        if (!username.trim() || !password.trim()) {
            setErrorMessage('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('http://43.200.27.116:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: username,
                    user_password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // 로그인 성공 처리
                alert('Login successful!');
                onLogin(username); // 부모 컴포넌트에 로그인 상태 전달
                navigate('/'); // 홈 화면으로 이동
            } else {
                // 서버가 반환한 에러 메시지 출력
                setErrorMessage(data.error || '로그인 실패. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            setErrorMessage('예기치 않은 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="login">
            <div className="login-container">
                <h1>로그인</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="아이디"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value); setErrorMessage(''); }}
                        className={errorMessage ? 'error' : ''}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMessage(''); }}
                        className={errorMessage ? 'error' : ''}
                    />
                    <button type="submit">로그인</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <p>계정이 없으신가요? <Link to="/signup">회원가입하기</Link></p>
            </div>
        </div>
    );
}

export default Login;
