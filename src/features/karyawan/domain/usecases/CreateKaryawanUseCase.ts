import { IKaryawanRepository } from "../repositories/IKaryawanRepository.interface";
import { Karyawan } from "../entities/Karyawan";

export class CreateKaryawanUseCase {
  constructor(private karyawanRepo: IKaryawanRepository) {}

  async execute(data: Omit<Karyawan, 'id' | 'tanggalGabung'>): Promise<Karyawan> {
    return await this.karyawanRepo.create(data);
  }
}