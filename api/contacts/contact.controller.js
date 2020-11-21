const Joi = require("joi");
const contactModel = require("./contact.model");
const {
  Types: { ObjectId },
} = require("mongoose");

class ContactController {
  // get contact list
  async getContacts(req, res, next) {
    try {
      const contacts = await contactModel.find();

      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  // Add new contact into db
  async createContact(req, res, next) {
    try {
      const contact = await contactModel.create(req.body);

      return res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  // get contact by id
  async getContactById(req, res, next) {
    try {
      const contactId = req.params.id;

      const contact = await contactModel.findById(contactId);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }

      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  // Delete contact by ID
  async deleteContactById(req, res, next) {
    try {
      const contactId = req.params.id;

      const deletedContact = await contactModel.findByIdAndDelete(contactId);
      if (!deletedContact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.status(204).json({ message: "Contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    try {
      const contactId = req.params.id;

      const contactToUpdate = await contactModel.findByIdAndUpdate(
        contactId,
        { $set: req.body },
        { new: true }
      );
      if (!contactToUpdate) {
        return res.status(404).json({ message: "Contact not found" });
      }
      return res.status(204).json(contactToUpdate);
    } catch (err) {
      next(err);
    }
  }

  // Check contact in list
  validateId(req, res, next) {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Not found" });
    }
    next();
  }

  // Validate before creating new contact
  validateCreateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string(),
    });

    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }

  // validate contact before update
  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    }).min(1);

    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }
}

module.exports = new ContactController();
