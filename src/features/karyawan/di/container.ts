import { KaryawanRepositoryImpl } from "../data/repositories/KaryawanRepositoryImpl";
import { GetAllKaryawanUseCase } from "../domain/usecases/GetAllKaryawanUseCase";
import { GetKaryawanByIdUseCase } from "../domain/usecases/GetKaryawanByIdUseCase";
import { CreateKaryawanUseCase } from "../domain/usecases/CreateKaryawanUseCase";
import { UpdateKaryawanUseCase } from "../domain/usecases/UpdateKaryawanUseCase";
import { DeleteKaryawanUseCase } from "../domain/usecases/DeleteKaryawanUseCase";

const karyawanRepository = new KaryawanRepositoryImpl();

export const getAllKaryawanUseCase = new GetAllKaryawanUseCase(karyawanRepository);
export const getKaryawanByIdUseCase = new GetKaryawanByIdUseCase(karyawanRepository);
export const createKaryawanUseCase = new CreateKaryawanUseCase(karyawanRepository);
export const updateKaryawanUseCase = new UpdateKaryawanUseCase(karyawanRepository);
export const deleteKaryawanUseCase = new DeleteKaryawanUseCase(karyawanRepository);