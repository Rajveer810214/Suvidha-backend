const express = require('express');
const router = express.Router();
const userInfo = require('../models/User');
const fetchuser = require('../middleware/fetchUser');
router.use(express.json());

router.get('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId)
      const user = await userInfo.findById({_id:userId}).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, data:user });

    }
    catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});

module.exports = router;