import { Request, Response } from "express";
import { getAllKaryawanUseCase } from "../../di/container";
import { getKaryawanByIdUseCase } from "../../di/container";
import { createKaryawanUseCase } from "../../di/container";
import { updateKaryawanUseCase } from "../../di/container";
import { deleteKaryawanUseCase } from "../../di/container";

export class KaryawanController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const karyawanList = await getAllKaryawanUseCase.execute();
      res.status(200).json({
        success: true,
        data: karyawanList
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan internal pada sistem."
      });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const karyawan = await getKaryawanByIdUseCase.execute(id);

      if (!karyawan) {
        res.status(404).json({
          success: false,
          message: "Karyawan tidak ditemukan"
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: karyawan
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan internal pada sistem."
      });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const karyawan = await createKaryawanUseCase.execute(req.body);
      res.status(201).json({
        success: true,
        data: karyawan
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan internal pada sistem."
      });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const karyawan = await updateKaryawanUseCase.execute(id, req.body);

      if (!karyawan) {
        res.status(404).json({
          success: false,
          message: "Karyawan tidak ditemukan"
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: karyawan
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan internal pada sistem."
      });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const deleted = await deleteKaryawanUseCase.execute(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Karyawan tidak ditemukan"
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Karyawan berhasil dihapus"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan internal pada sistem."
      });
    }
  }
}