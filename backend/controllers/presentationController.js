const Presentation = require('../models/Presentation');

exports.getAllPresentations = async (req, res) => {
  const presentations = await Presentation.find();
  res.json(presentations);
};

exports.createPresentation = async (req, res) => {
  const presentation = new Presentation(req.body);
  await presentation.save();
  res.json(presentation);
};

exports.updatePresentation = async (req, res) => {
  const presentation = await Presentation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(presentation);
};

exports.deletePresentation = async (req, res) => {
  await Presentation.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
