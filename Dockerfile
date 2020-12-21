FROM node:13.7.0
WORKDIR ../Docker-image
COPY . .
Run npm install
EXPOSE 8000
CMD ["npm" , "run" , "dev"]