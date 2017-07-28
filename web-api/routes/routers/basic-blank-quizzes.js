var {Router} = require('express');
var router = Router();

var BasicBlankQuizController = require('../../controllers/basic-blank-quizzes-controller');
var basicBlankQuizCtrl = new BasicBlankQuizController();

router.post('/', basicBlankQuizCtrl.create);
router.get('/:id', basicBlankQuizCtrl.getOne);
router.put('/:id', basicBlankQuizCtrl.update);

module.exports = router;
