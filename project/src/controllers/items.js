import { ItemModel } from '../models/item.js';

export class ItemsController {
  static async getAll(req, res) {
    try {
      const { search, page = 1, limit = 50 } = req.query;
      const items = await ItemModel.getAll(search, parseInt(page), parseInt(limit));
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const item = await ItemModel.getById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const item = await ItemModel.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      if (!req.body.name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const item = await ItemModel.update(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async patch(req, res) {
    try {
      const item = await ItemModel.patch(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const result = await ItemModel.delete(req.params.id);
      if (!result.changes) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}