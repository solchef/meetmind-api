
## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```
## Prisma Client methods

### Model methods (e.g. `prisma.meeting.findMany()`)

| Method | Description |
|--------|-------------|
| `findUnique` | Returns one record by a unique field (id, email), or `null`. |
| `findUniqueOrThrow` | Same as `findUnique`, but throws if nothing is found. |
| `findFirst` | Returns the first record matching the filter, or `null`. |
| `findFirstOrThrow` | Same as `findFirst`, but throws if nothing is found. |
| `findMany` | Returns all records matching the filter. |
| `create` | Inserts a single record. |
| `createMany` | Inserts multiple records in one operation. |
| `createManyAndReturn` | Inserts multiple records and returns them. |
| `update` | Updates a single record found by a unique field. |
| `updateMany` | Updates all records matching the filter. |
| `upsert` | Updates a record if it exists, otherwise creates it. |
| `delete` | Deletes a single record found by a unique field. |
| `deleteMany` | Deletes all records matching the filter. |
| `count` | Returns the number of matching records. |
| `aggregate` | Computes `_sum`, `_avg`, `_min`, `_max`, and `_count` values. |
| `groupBy` | Groups records by field(s) and applies aggregates. |

### Query options (passed inside the methods above)

| Option | Description |
|--------|-------------|
| `where` | Filters records by conditions. |
| `select` | Chooses which fields to return. |
| `include` | Loads related records alongside the result. |
| `omit` | Excludes specific fields from the result. |
| `orderBy` | Sorts results by one or more fields. |
| `take` | Limits the number of records returned. |
| `skip` | Skips a number of records (offset pagination). |
| `cursor` | Starts from a given record (cursor pagination). |
| `distinct` | Returns only unique values for the given fields. |

### Client methods

| Method | Description |
|--------|-------------|
| `$connect` | Opens the database connection explicitly. |
| `$disconnect` | Closes the database connection. |
| `$transaction` | Runs multiple operations as one atomic transaction. |
| `$queryRaw` | Runs a raw SQL query that returns rows. |
| `$executeRaw` | Runs a raw SQL statement and returns the affected row count. |
| `$extends` | Adds custom methods, computed fields, or query hooks. |


<!-- next build steps -->

Clean up Meetings CRUD — make sure responses and validation are solid.\
Authentication/users — stop accepting creatorId from the client; derive it from the authenticated user.\
Workspaces + membership — establish who can access a meeting.\
Meeting lifecycle — scheduled → in progress → completed.\
Audio upload/storage.\
Transcription pipeline.
AI processing — summary, decisions, action items, risks, questions, topics.\
Search/history.
Queues with BullMQ for long-running AI jobs.\
