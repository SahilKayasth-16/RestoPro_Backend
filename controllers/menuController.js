const Menu = require('../models/Menu');

exports.getMenu = async (req, res) => {
    try {
        const menu = await Menu.find({});
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addMenuItem = async (req, res) => {
    const { name, description, price, category, image } = req.body;
    try {
        const item = new Menu({ name, description, price, category, image });
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const item = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        await Menu.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleAvailability = async (req, res) => {
    try {
        const item = await Menu.findById(req.params.id);
        item.isAvailable = !item.isAvailable;
        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
