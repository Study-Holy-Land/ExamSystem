var express = require('express');
var router = express.Router();

var RoleManagementController = require('../../controllers/role-management-controller');
var roleManagementCtrl = new RoleManagementController();

router.get('/', roleManagementCtrl.getUsers);
router.put('/:id', roleManagementCtrl.updateUsers);
router.post('/', roleManagementCtrl.createUser);

module.exports = router;
