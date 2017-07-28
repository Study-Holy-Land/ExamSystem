'use strict';

exports.setRoutes = (app) => {
  app.use('/register', require('./routers/register'));
  app.use('/puzzle', require('./routers/logic-puzzle'));
  app.use('/login', require('./routers/login'));
  app.use('/weChat-login', require('./routers/weChat-login'));
  app.use('/start', require('./routers/start'));
  app.use('/user-detail', require('./routers/user-detail'));
  app.use('/dashboard', require('./routers/dashboard'));
  app.use('/logout', require('./routers/logout'));
  app.use('/timer', require('./routers/timer'));
  app.use('/user-initialization', require('./routers/user-initialization'));
  app.use('/homework', require('./routers/homework'));
  app.use('/password', require('./routers/password'));
  app.use('/user', require('./routers/user'));
  app.use('/report', require('./routers/report'));
  app.use('/reports', require('./routers/reports'));
  app.use('/reuse', require('./routers/reuse'));
  app.use('/deadline', require('./routers/deadline'));
  app.use('/inspector', require('./routers/inspector'));
  app.use('/style-guide', require('./routers/style-guide'));
  app.use('/group', require('./routers/group'));
  app.use('/paper-assignment', require('./routers/paper-assignment'));
  app.use('/auth', require('./routers/auth'));
  app.use('/qa', require('./routers/qa'));
  app.use('/admin', require('./routers/admin'));
  app.use('/papers', require('./routers/papers'));
  app.use('/test', require('./routers/test'));
  app.use('/paper-draft', require('./routers/paper-draft'));
  app.use('/teacher-login', require('./routers/teacher-login'));
  app.use('/programs', require('./routers/programs'));
  app.use('/paper-definitions', require('./routers/paper-definitions'));
  app.use('/username', require('./routers/username'));
  app.use('/homeworks', require('./routers/homework-program'));
  app.use('/homework-quizzes', require('./routers/homework-quizzes'));
  app.use('/homework-definitions', require('./routers/homework-definition'));
  app.use('/messages', require('./routers/messages'));
  app.use('/mentors', require('./routers/mentors'));
  app.use('/stacks', require('./routers/stacks'));
  app.use('/stack-definitions', require('./routers/stack-definition'));
  app.use('/questions', require('./routers/questions'));
  app.use('/section', require('./routers/logic-puzzle'));
  app.use('/check-cookie', require('./routers/check-cookie'));
  app.use('/files', require('./routers/files'));
  app.use('/users', require('./routers/users'));
  app.use('/global-vars', require('./routers/global-vars'));
  app.use('/single-choices', require('./routers/single-choices'));
  app.use('/multiple-choices', require('./routers/multiple-choices'));
  app.use('/basic-blank-quizzes', require('./routers/basic-blank-quizzes'));
  app.use('/students', require('./routers/students'));
  app.use('/che', require('./routers/che'));
  app.use('/profile', require('./routers/profile'));
  app.use('/quiz', require('./routers/quiz'));
  app.use('/github-token', require('./routers/github-token'));
  app.use('/email', require('./routers/email'));
};