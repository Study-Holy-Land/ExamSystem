var {Router} = require('express');

var MessagesController = require('../../controllers/messages-controller');

const msgController = new MessagesController();
const router = Router();

router.post('/', msgController.create);
router.get('/', msgController.findAll);
router.get('/:questionId', msgController.findOne);
router.get('/unread', msgController.findUnread);
router.put('/:messageId/:operation', msgController.update);

module.exports = router;
