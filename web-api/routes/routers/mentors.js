var {Router} = require('express');

var MentorsController = require('../../controllers/mentors-controller');

const mentorsController = new MentorsController();
const router = Router();

router.get('/search', mentorsController.search);
router.get('/', mentorsController.findAllMentors);

module.exports = router;
