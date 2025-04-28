const Presentation = require('../models/Presentation');

exports.getAllPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find();
    res.json(presentations);
  } catch (error) {
    console.error('Get Presentations Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createPresentation = async (req, res) => {
  try {
    console.log('Creating presentation with data:', req.body);
    const presentation = new Presentation(req.body);
    const savedPresentation = await presentation.save();
    console.log('Saved presentation:', savedPresentation);
    res.json(savedPresentation);
  } catch (error) {
    console.error('Create Presentation Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    res.json(presentation);
  } catch (error) {
    console.error('Update Presentation Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findByIdAndDelete(req.params.id);
    if (!presentation) {
      return res.status(404).json({ error: 'Presentation not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Delete Presentation Error:', error);
    res.status(500).json({ error: error.message });
  }
};