const express = require('express');
const router = express.Router();
const { getTeamMembers, addTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getTeamMembers);
router.post('/', protect, authorize('admin'), upload.single('foto'), addTeamMember);
router.delete('/:id', protect, authorize('admin'), deleteTeamMember);

module.exports = router;