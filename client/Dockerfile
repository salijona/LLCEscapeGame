FROM node:14
# ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY . .
RUN npm install
# RUN npm install --save-dev @types/googlemaps
RUN npm run-script build
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]
