import { RowDataPacket } from "mysql2";

export interface KaryawanRow extends RowDataPacket {
  id_karyawan: number;
  nama_lengkap: string;
  jabatan: string;
  tanggal_gabung: Date;
}