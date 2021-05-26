## Requirements

 - [Node v7.6+](https://nodejs.org/en/download/current/)
 - [Yarn](https://yarnpkg.com/en/docs/install)
 - [Redis](https://redis.io/download)

## Installation

1. Install Node, Yarn, Redis from links above or via command line
2. Install Node dependencies 
```bash
yarn
```
3. Set up environment variables
```bash
cp .env.example .env
```

## Build and Run
1. Run Redis server
```bash
redis-server
```
2. Start Node server
```bash
yarn dev
```
3. Call APIs via Postman or browser

## Test
```bash
yarn test
```

## Caching Strategy
- When there is no cache upon the first API call, all character ids are fetched from the external Marvel API
- Then they are stored in an object together with a cached date in Redis
```json
{
  "characters": [1, 2, 3],
  "timestamp": "2021-05-16"
}
```
- When cache is found upon subsequent API call, all character ids are extracted from Redis, together with the timestamp 
- The timestamp is used to call the external Marvel API by being passed in as `modifiedSince` to fetch any additional characters that have been added since the cached date