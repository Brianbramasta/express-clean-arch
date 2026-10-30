import { IKaryawanRepository } from "../repositories/IKaryawanRepository.interface";
import { Karyawan } from "../entities/Karyawan";

export class UpdateKaryawanUseCase {
  constructor(private karyawanRepo: IKaryawanRepository) {}

  async execute(id: string, data: Partial<Karyawan>): Promise<Karyawan | null> {
    return await this.karyawanRepo.update(id, data);
  }
}