import { IKaryawanRepository } from "../repositories/IKaryawanRepository.interface";
import { Karyawan } from "../entities/Karyawan";

export class GetAllKaryawanUseCase {
  constructor(private karyawanRepo: IKaryawanRepository) {}

  async execute(): Promise<Karyawan[]> {
    return await this.karyawanRepo.getAll();
  }
}