var PaperService = require('./services/paper-service');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/twars');

const data = {
  'paperName': '简单的试卷',
  'id': 1,
  'sections': [
    {
      'description': '这是描述',
      'id': 1,
      'quizzes': [
        {
          'definition_uri': 'blankQuizzes/1',
          'id': 1,
          'items_uri': 'blankQuizzes/1/items'
        },
        {
          'definition_uri': 'blankQuizzes/2',
          'id': 2,
          'items_uri': 'blankQuizzes/2/items'
        }
      ],
      'sectionType': 'blankQuizzes'
    },
    {
      'description': '这是描述',
      'id': 2,
      'quizzes': [
        {
          'definition_uri': 'homeworkQuizzes/1',
          'id': 1,
          'items_uri': null
        },
        {
          'definition_uri': 'homeworkQuizzes/2',
          'id': 2,
          'items_uri': null
        },
        {
          'definition_uri': 'homeworkQuizzes/3',
          'id': 3,
          'items_uri': null
        },
        {
          'definition_uri': 'homeworkQuizzes/4',
          'id': 4,
          'items_uri': null
        },
        {
          'definition_uri': 'homeworkQuizzes/5',
          'id': 5,
          'items_uri': null
        },
        {
          'definition_uri': 'homeworkQuizzes/6',
          'id': 6,
          'items_uri': null
        },
        {
          'definition_uri': 'homeworkQuizzes/7',
          'id': 7,
          'items_uri': null
        },
        {
          'definition_uri': 'homeworkQuizzes/8',
          'id': 8,
          'items_uri': null
        }
      ],
      'sectionType': 'homeworkQuizzes'
    }
  ]
};

const args = Object.assign({}, data, {
  userId: 1,
  programId: 1
});
new PaperService().addPaperForUser(args, (err, data) => {
  if (err) {
    throw err;
  }
});  //eslint-disable-line