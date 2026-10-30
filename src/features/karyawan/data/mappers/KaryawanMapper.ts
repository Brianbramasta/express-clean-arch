import { KaryawanRow } from "../dtos/KaryawanDTO";
import { Karyawan } from "../../domain/entities/Karyawan";

export class KaryawanMapper {
  static toEntity(row: KaryawanRow): Karyawan {
    return {
      id: String(row.id_karyawan),
      namaLengkap: row.nama_lengkap,
      jabatan: row.jabatan,
      tanggalGabung: row.tanggal_gabung,
    };
  }

  static toEntityFromResult(result: any): Karyawan {
    return {
      id: String(result.id_karyawan),
      namaLengkap: result.nama_lengkap,
      jabatan: result.jabatan,
      tanggalGabung: result.tanggal_gabung,
    };
  }
}