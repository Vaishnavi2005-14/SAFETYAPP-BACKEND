const User = require('../models/User');

exports.getData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, age, phone, aadhaar, customMessage, shakeEnabled, shakeSensitivity } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile = {
      name: name !== undefined ? name : user.profile.name,
      age: age !== undefined ? age : user.profile.age,
      phone: phone !== undefined ? phone : user.profile.phone,
      aadhaar: aadhaar !== undefined ? aadhaar : user.profile.aadhaar,
      customMessage: customMessage !== undefined ? customMessage : user.profile.customMessage,
      shakeEnabled: shakeEnabled !== undefined ? shakeEnabled : user.profile.shakeEnabled,
      shakeSensitivity: shakeSensitivity !== undefined ? shakeSensitivity : user.profile.shakeSensitivity
    };

    await user.save();
    res.json({ message: 'Profile updated successfully', profile: user.profile });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateContacts = async (req, res) => {
  try {
    const { contacts } = req.body;
    if (!Array.isArray(contacts)) {
      return res.status(400).json({ message: 'Contacts must be an array' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.contacts = contacts;
    await user.save();
    res.json({ message: 'Contacts updated successfully', contacts: user.contacts });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
