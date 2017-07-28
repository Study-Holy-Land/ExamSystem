const express = require('express');
const router = express.Router();
const PaperDefinitionController = require('../../controllers/paper-definition-controller');
const ProgramPaperController = require('../../controllers/program-paper-controller');
const ProgramController = require('../../controllers/program-controller');
const paperDefinitionController = new PaperDefinitionController();

const programPaperController = new ProgramPaperController();

const programController = new ProgramController();

router.get('/', programController.getList);
router.post('/', programController.create);
router.put('/:programId', programController.update);
router.post('/programCode', programController.addProgramByProgramCode);
router.post('/invitationCode', programController.addProgramByInvitationCode);
router.get('/:programId/paperDefinitions/selection', paperDefinitionController.selectPaperDefinition);

router.get('/:programId/papers', programPaperController.getPaperList);
router.post('/:programId/papers/:paperId', programPaperController.retrievePaper);
router.get('/:programId/papers/:paperId/sections', programPaperController.getSection);
router.get('/:programId/papers/:paperId/sections/:sectionId/questionIds', programPaperController.getQuestionIds);
router.get('/:programId/papers/:paperId/sections/:sectionId', programPaperController.getQuizList);
router.post('/:programId/papers/:paperId/sections/:sectionId/submission', programPaperController.submitPaper);
router.get('/:programId/invitationCode', programController.getInvitationCode);
router.get('/:programId/invitationCodeCount', programController.getInvitationCodeCount);
router.post('/:programId/invitationCode', programController.addInvitationCode);

module.exports = router;
