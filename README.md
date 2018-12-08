# Decision Maker

A web app that helps groups of friends to vote on a preferred choice (using ranked voting), for example: "What movie should we see next Friday?".

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`

- Check the migrations folder to see what gets created in the DB

6. Run the seed: `npm run knex seed:run`

- Check the seeds file to see what gets seeded in the DB

7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- body-parser 1.15.x or above
- chart.js 2.7.x or above
- dotenv 2.0.x or above
- ejs 2.4.x or above
- express 4.13.x or above
- knex 0.11.x or above
- knex-logger 0.1.x or above
- mailgun-js 0.22.x or above
- md5 2.2.x or above
- morgan 1.7.x or above
- pg 6.0.x or above
- uuid 3.3.x or above
