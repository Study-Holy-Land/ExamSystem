var {Router} = require('express');
var router = Router();

var SingleChoice = require('../../controllers/single-choices-controller');
var singleChoiceCtrl = new SingleChoice();

router.post('/', singleChoiceCtrl.create);
router.get('/:id', singleChoiceCtrl.getOne);
router.put('/:id', singleChoiceCtrl.update);

module.exports = router;
