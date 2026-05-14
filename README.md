# 서울 커플 데이트 플래너

## 배포 방법 (Vercel)

### 1. 이 폴더를 GitHub에 올리기
1. github.com에서 새 repository 만들기 (이름: `date-planner`)
2. 이 `date-planner` 폴더 안의 파일들을 올리기

### 2. Vercel에 배포
1. vercel.com → "Add New Project"
2. GitHub repository 선택
3. **Environment Variables 설정** (중요!)
   - `GEMINI_API_KEY` → Gemini API 키
   - `NAVER_CLIENT_ID` → 네이버 Client ID
   - `NAVER_CLIENT_SECRET` → 네이버 Client Secret
4. Deploy!

### 3. 네이버 API 키 발급
1. developers.naver.com 접속
2. Application → 애플리케이션 등록
3. 사용 API: **검색** 선택
4. 환경: Web, URL에 Vercel 도메인 입력 (예: https://date-planner.vercel.app)
5. Client ID / Client Secret 복사

## 구조
```
date-planner/
├── api/
│   ├── naver-search.js   # 네이버 검색 API (CORS 해결)
│   └── gemini.js         # Gemini API (키 숨김)
├── public/
│   └── index.html        # 메인 앱
└── vercel.json           # Vercel 설정
```
