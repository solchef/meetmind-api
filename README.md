
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
<!-- prisma methods -->
[
  'constructor',    'where',
  'variant',        'include',
  'select',         'orderBy',
  'groupBy',        'combine',
  'cursor',         'distinct',
  'distinctOn',     'limit',
  'offset',         'all',
  'prepared',       'first',
  'aggregate',      'create',
  'createAll',      'createAndCount',
  'upsert',         'update',
  'updateAll',      'updateAndCount',
  'delete',         'deleteAll',
  'deleteAndCount'
]


<!-- next build steps -->

Clean up Meetings CRUD — make sure responses and validation are solid.
Authentication/users — stop accepting creatorId from the client; derive it from the authenticated user.
Workspaces + membership — establish who can access a meeting.
Meeting lifecycle — scheduled → in progress → completed.
Audio upload/storage.
Transcription pipeline.
AI processing — summary, decisions, action items, risks, questions, topics.
Search/history.
Queues with BullMQ for long-running AI jobs.
