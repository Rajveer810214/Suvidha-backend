// routes/intern.js
const express = require('express');
const router = express.Router();
const Intern = require('../../models/Intern');
const isAdmin = require('../../middleware/isAdmin')
// DELETE request to delete an intern and their internship details
router.delete('/delete/:internId', isAdmin, async (req, res) => {

  const internId = req.params.internId;
  try {
    // Find the intern by ID
    const intern = await Intern.findById(internId);

    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }
    // Delete the intern
    await Intern.deleteOne({ _id: internId });
    return res.status(200).json({ success: true, message: 'Intern detail of the user is deleted successfully' });
  } catch (error) {
    console.error('Error deleting intern:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.put('/edit/:internId', isAdmin, async (req, res) => {
  const internId = req.params.internId;
  const { name, domain, startDate, endDate, status } = req.body;

  try {
    // Find the intern by ID
    const intern = await Intern.findById(internId);

    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    // Update intern details
    intern.name = name || intern.name;
    intern.domain = domain || intern.domain;
    intern.startDate = startDate || intern.startDate;
    intern.endDate = endDate || intern.endDate;
    intern.status = status || intern.status;

    // Save the updated intern
    await intern.save();

    return res.status(200).json({ success: true, message: 'Intern details updated successfully', data: intern });
  } catch (error) {
    console.error('Error updating intern details:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
