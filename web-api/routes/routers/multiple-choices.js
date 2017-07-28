var {Router} = require('express');
var router = Router();

var MultipleChoice = require('../../controllers/multiple-choices-controller');
var multipleChoiceCtrl = new MultipleChoice();

router.post('/', multipleChoiceCtrl.create);
router.get('/:id', multipleChoiceCtrl.getOne);
router.put('/:id', multipleChoiceCtrl.update);

module.exports = router;
