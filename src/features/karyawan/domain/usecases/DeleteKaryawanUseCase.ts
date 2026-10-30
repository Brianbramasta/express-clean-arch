import { IKaryawanRepository } from "../repositories/IKaryawanRepository.interface";

export class DeleteKaryawanUseCase {
  constructor(private karyawanRepo: IKaryawanRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.karyawanRepo.delete(id);
  }
}