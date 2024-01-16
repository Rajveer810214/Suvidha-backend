const express = require('express');
const router = express.Router();
const InternModel = require('../../models/Intern');
const fetchUser = require('../../middleware/fetchUser');
const isAdmin = require('../../middleware/isAdmin');


router.put('internship/accept/:id', isAdmin, async (req, res) => {
  try {
    const internId = req.params.id;
    // Update status to "accepted"
    const updatedIntern = await InternModel.findByIdAndUpdate(internId, { status: 'accepted' }, { new: true });
    if (!updatedIntern) {
      return res.status(404).json({ success: false, error: 'Intern not found' });
    }
    res.json({ success: true, data: updatedIntern });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


router.get('/internship/accepted', isAdmin, async (req, res) => {
  try {
    const pendingInterns = await InternModel.find({ status: 'accepted' }).populate('user', 'email phone');
    // If the user field is null or undefined, handle it
    const internsWithUserDetails = pendingInterns.map(intern => {
      return {
        _id: intern._id,
        name: intern.name,
        domain: intern.domain,
        startDate: intern.startDate,
        endDate: intern.endDate,
        status: intern.status,
        user: intern.user ? {
          email: intern.user.email,
          phone: intern.user.phone
        } : null
      };
    });

    res.json({ success: true, data: internsWithUserDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.get('/internship/acceptEachUser', fetchUser, async (req, res) => {
  try {
    const acceptedInterns = await InternModel.find({ status: 'accepted', user: req.user.id });
    // Using the select method
    // const acceptedInterns = await InternModel.find({ status: 'accepted' }).select({ _id: req.user.id });

    res.json({ success: true, data: acceptedInterns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


router.get('/internship/pending', isAdmin, async (req, res) => {
  try {
    const pendingInterns = await InternModel.find({ status: 'pending' }).populate('user', 'email phone status');

    // If the user field is null or undefined, handle it
    const internsWithUserDetails = pendingInterns.map(intern => {
      return {
        _id: intern._id,
        name: intern.name,
        domain: intern.domain,
        startDate: intern.startDate,
        endDate: intern.endDate,
        status: intern.status,
        user: intern.user ? {
          email: intern.user.email,
          phone: intern.user.phone
        } : null
      };
    });

    res.json({ success: true, data: internsWithUserDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
// Route to get the count of students with pending and accepted status based on the current date
router.get('/internship/status-count', isAdmin, async (req, res) => {
  try {
    // Count students with pending status and internship within the date range
    const pendingCount = await InternModel.countDocuments({
      status: 'pending'

    });

    // Count students with accepted status and internship within the date range
    const acceptedCount = await InternModel.countDocuments({
      status: 'accepted'
    });

    // Create a response array
    const responseArray = [
      { status: 'pending', count: pendingCount },
      { status: 'accepted', count: acceptedCount },
    ];

    res.json({ success: true, data: responseArray });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;