import { IKaryawanRepository } from "../../domain/repositories/IKaryawanRepository.interface";
import { Karyawan } from "../../domain/entities/Karyawan";
import { KaryawanRow } from "../dtos/KaryawanDTO";
import { KaryawanMapper } from "../mappers/KaryawanMapper";
import { dbPool } from "../../../../shared/infrastructure/database";

export class KaryawanRepositoryImpl implements IKaryawanRepository {
  async getAll(): Promise<Karyawan[]> {
    const [rows] = await dbPool.query<KaryawanRow[]>(
      "SELECT id_karyawan, nama_lengkap, jabatan, tanggal_gabung FROM karyawan"
    );
    return rows.map(KaryawanMapper.toEntity);
  }

  async getById(id: string): Promise<Karyawan | null> {
    const [rows] = await dbPool.query<KaryawanRow[]>(
      "SELECT id_karyawan, nama_lengkap, jabatan, tanggal_gabung FROM karyawan WHERE id_karyawan = ?",
      [id]
    );
    if (rows.length === 0) return null;
    return KaryawanMapper.toEntity(rows[0]);
  }

  async create(data: Omit<Karyawan, 'id' | 'tanggalGabung'>): Promise<Karyawan> {
    const now = new Date();
    const [result] = await dbPool.query(
      "INSERT INTO karyawan (nama_lengkap, jabatan, tanggal_gabung) VALUES (?, ?, ?)",
      [data.namaLengkap, data.jabatan, now]
    );
    
    const insertId = (result as any).insertId;
    const [rows] = await dbPool.query<KaryawanRow[]>(
      "SELECT id_karyawan, nama_lengkap, jabatan, tanggal_gabung FROM karyawan WHERE id_karyawan = ?",
      [insertId]
    );
    return KaryawanMapper.toEntity(rows[0]);
  }

  async update(id: string, data: Partial<Karyawan>): Promise<Karyawan | null> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.namaLengkap !== undefined) {
      updates.push("nama_lengkap = ?");
      values.push(data.namaLengkap);
    }
    if (data.jabatan !== undefined) {
      updates.push("jabatan = ?");
      values.push(data.jabatan);
    }

    if (updates.length === 0) {
      return await this.getById(id);
    }

    values.push(id);
    await dbPool.query(
      `UPDATE karyawan SET ${updates.join(", ")} WHERE id_karyawan = ?`,
      values
    );

    return await this.getById(id);
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await dbPool.query(
      "DELETE FROM karyawan WHERE id_karyawan = ?",
      [id]
    );
    return (result as any).affectedRows > 0;
  }
}