import { Request, Response, NextFunction } from "express";
import { Karyawan } from "../../domain/entities/Karyawan";

export class KaryawanValidator {
  static validateCreate(req: Request, res: Response, next: NextFunction): void {
    const { namaLengkap, jabatan } = req.body;

    if (!namaLengkap || typeof namaLengkap !== 'string') {
      res.status(400).json({
        success: false,
        message: "namaLengkap harus string"
      });
      return;
    }

    if (!jabatan || typeof jabatan !== 'string') {
      res.status(400).json({
        success: false,
        message: "jabatan harus string"
      });
      return;
    }

    next();
  }

  static validateUpdate(req: Request, res: Response, next: NextFunction): void {
    const { namaLengkap, jabatan } = req.body;

    if (namaLengkap !== undefined && typeof namaLengkap !== 'string') {
      res.status(400).json({
        success: false,
        message: "namaLengkap harus string"
      });
      return;
    }

    if (jabatan !== undefined && typeof jabatan !== 'string') {
      res.status(400).json({
        success: false,
        message: "jabatan harus string"
      });
      return;
    }

    next();
  }
}