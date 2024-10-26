# Node.js 이미지 사용
FROM node:18-slim

# 작업 디렉토리 설정
WORKDIR /app

# 소스 복사 및 패키치 설치
COPY . .
RUN npm install

# 환경 변수 설정
ENV NODE_OPTIONS=--no-deprecation

# 개발 서버 실행
EXPOSE 3000
CMD ["npm", "start"]
