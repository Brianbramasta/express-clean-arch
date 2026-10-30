import { Karyawan } from "../entities/Karyawan";

export interface IKaryawanRepository {
  getAll(): Promise<Karyawan[]>;
  getById(id: string): Promise<Karyawan | null>;
  create(karyawan: Omit<Karyawan, 'id' | 'tanggalGabung'>): Promise<Karyawan>;
  update(id: string, karyawan: Partial<Karyawan>): Promise<Karyawan | null>;
  delete(id: string): Promise<boolean>;
}