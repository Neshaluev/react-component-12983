FROM node:14
WORKDIR /app
COPY package.json . 
RUN npm install
COPY . .
ENV REACT_APP_NAME=myusername
CMD ["npm","start"]