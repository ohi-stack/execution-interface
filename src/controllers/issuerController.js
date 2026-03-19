import { createIssuer, getIssuerById } from '../services/issuerService.js';

export const createIssuerHandler = async (req, res, next) => {
  try {
    const issuer = await createIssuer(req.validatedBody);
    res.status(201).json({ data: issuer });
  } catch (error) {
    next(error);
  }
};

export const getIssuerHandler = async (req, res, next) => {
  try {
    const issuer = await getIssuerById(req.validatedIssuerId);
    res.status(200).json({ data: issuer });
  } catch (error) {
    next(error);
  }
};
