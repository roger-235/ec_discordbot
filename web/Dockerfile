FROM node:24.14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]