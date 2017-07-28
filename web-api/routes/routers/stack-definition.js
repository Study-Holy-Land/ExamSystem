var express = require('express');
var router = express.Router();

var StackDefinitionController = require('../../controllers/stack-definiton-controller');
var stackDefinitionCtrl = new StackDefinitionController();

router.get('/', stackDefinitionCtrl.getAll);
router.get('/:stackId', stackDefinitionCtrl.getOne);
router.post('/', stackDefinitionCtrl.create);
router.put('/:stackId', stackDefinitionCtrl.update);
router.get('/status/:stackId', stackDefinitionCtrl.searchStatus);

module.exports = router;
