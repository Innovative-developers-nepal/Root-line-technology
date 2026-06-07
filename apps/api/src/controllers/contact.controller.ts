// import asyncHandler from "../utils/asyncHandler";
// import sendSuccess from "../utils/responseHandler";
// import { AuthRequest } from "../middlewares/auth.middleware";
// import * as contactService from "../services/contact.service";
// import { buildPaginationMeta } from "../utils/paginator";
// import httpStatus from "http-status";

// export const submitContact = asyncHandler(async (req, res) => {
//     const data = req.body;
//     const contact = await contactService.submitContact(data);
//     sendSuccess(res, httpStatus.CREATED, contact);
// });

// export const getContacts = asyncHandler(async (req: AuthRequest, res) => {
//     const query = req.query as any;
//     const result = await contactService.getContacts(query);
//     const meta = buildPaginationMeta(result.contacts, Number(query.limit) || 20);
//     sendSuccess(res, httpStatus.OK, result.contacts, { pagination: { ...meta, nextCursor: result.nextCursor ?? null } });
// });

// export const updateContactStatus = asyncHandler(async (req: AuthRequest, res) => {
//     const id = req.params.id as string;
//     const { status } = req.body;
//     const contact = await contactService.updateContactStatus(id, status);
//     sendSuccess(res, httpStatus.OK, contact);
// });


import { Request, Response } from "express";
import contactService from "../services/contact.service";

export const sendContactMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return;
    }

    await contactService.sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};