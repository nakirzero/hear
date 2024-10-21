# Node.js 이미지 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 설치 및 보안 문제 수정
COPY package.json package-lock.json ./
RUN npm install

# 환경 변수 설정
ENV NODE_OPTIONS=--no-deprecation

# 소스 복사
COPY . .

# 개발 서버 실행
EXPOSE 3000
CMD ["npm", "start"]
