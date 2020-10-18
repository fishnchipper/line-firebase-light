FROM mhart/alpine-node:14.9.0

WORKDIR /src

# install npm packages
COPY package.json .
RUN npm i

# copy all files
COPY . .

EXPOSE 65000/tcp

CMD ["npm", "start"]