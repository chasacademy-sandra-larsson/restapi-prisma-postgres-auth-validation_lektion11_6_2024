import { body, param, query, validationResult} from "express-validator"
import { Request, Response, NextFunction } from "express" 


// Middlewares
export const validateUser = [
    body('username')
      .isString().withMessage('Username must be a string')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
      .trim().escape(),
    body('email')
      .isEmail().withMessage('Invalid email address')
      .normalizeEmail(),
    body('password')
      .isString().withMessage('Password must be a string')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .trim().escape(),
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
  ];