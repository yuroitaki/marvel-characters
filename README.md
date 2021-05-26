## Requirements:

 - [Node v7.6+](https://nodejs.org/en/download/current/) or [Docker](https://www.docker.com/)
 - [Yarn](https://yarnpkg.com/en/docs/install)
 - [Redis](https://redis.io/download)

## Installation

1. Install Node, Yarn, Redis from links above or via command line
2. Install node dependencies 
```bash
yarn
```
3. Set up environment variables
```bash
cp .env.example .env
```

## Build and Run
1. Run Redis server - for Mac and Linux user, can run `redis-server`
2. Start node server
```bash
yarn dev
```
3. Call APIs via Postman or browser

## Test
```bash
yarn test
```
