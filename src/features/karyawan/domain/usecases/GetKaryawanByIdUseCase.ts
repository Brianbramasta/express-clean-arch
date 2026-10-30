import { IKaryawanRepository } from "../repositories/IKaryawanRepository.interface";
import { Karyawan } from "../entities/Karyawan";

export class GetKaryawanByIdUseCase {
  constructor(private karyawanRepo: IKaryawanRepository) {}

  async execute(id: string): Promise<Karyawan | null> {
    return await this.karyawanRepo.getById(id);
  }
}