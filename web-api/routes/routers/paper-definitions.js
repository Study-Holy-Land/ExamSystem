const express = require('express');
const router = express.Router();
const PaperDefinitionController = require('../../controllers/paper-definition-controller');
const paperDefinitionController = new PaperDefinitionController();

router.get('/', paperDefinitionController.getPaperDefinitionList);
router.post('/', paperDefinitionController.savePaperDefinition);
router.delete('/deletion', paperDefinitionController.deleteSomePaperDefinition);
router.delete('/:paperId', paperDefinitionController.deletePaperDefinition);
router.get('/:paperId', paperDefinitionController.getPaperDefinition);
router.put('/:paperId', paperDefinitionController.updatePaperDefinition);
// router.post('/distribution', paperDefinitionController.distributePaperDefinition);
router.put('/:paperId/:operation', paperDefinitionController.operatePaperDefinitionById);

module.exports = router;
