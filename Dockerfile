FROM node:21-slim
EXPOSE 5000
WORKDIR /app
COPY . .
RUN npm install
CMD [ "npm", "start" ]