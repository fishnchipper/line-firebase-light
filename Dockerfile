FROM mhart/alpine-node

WORKDIR /src

# install npm packages
COPY package.json .
RUN npm i

# copy all files
COPY . .

EXPOSE 65000/tcp

CMD ["npm", "start"]