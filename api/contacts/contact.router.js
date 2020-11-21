const { Router } = require("express");
const contactRouter = Router();

const contactController = require("./contact.controller");

// Get contact list
contactRouter.get("/", contactController.getContacts);

// Create new contact in database
contactRouter.post(
  "/",
  contactController.validateCreateContact,
  contactController.createContact
);

// Find contact by ID
contactRouter.get(
  "/:id",
  contactController.validateId,
  contactController.getContactById
);

// Delete contact by ID
contactRouter.delete(
  "/:id",
  contactController.validateId,
  contactController.deleteContactById
);

// Update contact information
contactRouter.put(
  "/:id",
  contactController.validateId,
  contactController.validateUpdateContact,
  contactController.updateContact
);

module.exports = contactRouter;
