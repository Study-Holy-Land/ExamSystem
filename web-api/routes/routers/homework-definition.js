var express = require('express');
var multer = require('multer');
var router = express.Router();
var HomeworkDefinationController = require('../../controllers/homework-definition-controller');
var homeworkDefinationController = new HomeworkDefinationController();
router.get('/selection', homeworkDefinationController.matchHomework);
router.get('/', homeworkDefinationController.getHomeworkList);
router.delete('/deletion', homeworkDefinationController.deleteSomeHomeworks);

router.get('/:homeworkId', homeworkDefinationController.getOneHomework);
router.delete('/:homeworkId', homeworkDefinationController.deleteHomework);

var storage = multer.diskStorage({
  destination: './homework-script',
  filename: function(req, file, cb) {
    cb(null, new Date().getTime() + Math.random().toString().slice(2, 8));
  }
});

var upload = multer({storage: storage});

router.post('/', homeworkDefinationController.insertHomework);
router.get('/status/:id', homeworkDefinationController.searchStatus);
router.put('/:dataId/status', upload.fields([{name: 'script', maxCount: 1}, {
  name: 'answer',
  maxCount: 1
}, {
  name: 'readme',
  maxCount: 1
}]), homeworkDefinationController.saveHomework);
router.put('/:homeworkId', homeworkDefinationController.updateHomework);

module.exports = router;

