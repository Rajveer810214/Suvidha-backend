const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const InternModel = require('../../models/Intern');
const fetchUser = require('../../middleware/fetchUser')
router.use(express.json());

// Define validation middleware
const validateInternshipApplication = [
  body('name', 'Name should have a minimum length of 3').isLength({ min: 3 }),
  body('domain', 'domain is required').notEmpty(),
  body('startDate', 'Start Date is required').notEmpty(),
  body('endDate', 'End Date is required').notEmpty(),
];
// API endpoint for internship application submission
router.post('/internship/apply', fetchUser, validateInternshipApplication, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    // Assuming that the user is authenticated and user information is attached to req.user
    const user = req.user;
    console.log(user._id)
    // Check if the user already has an internship application
    const existingInternship = await InternModel.findOne({ user: user.id });

    if (existingInternship) {
      return res.status(400).json({ success: false, message: 'Internship application already submitted' });
    }
    const {
      name,
      domain,
      startDate,
      endDate,
    } = req.body;
    console.log(req.body);
    // Save internship application to MongoDB using the InternModel
    const internshipApplication = new InternModel({
      user: req.user.id, // Set the 'user' field with the user ID
      name,
      domain,
      startDate,
      endDate,
    });
    await internshipApplication.save();
    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;

