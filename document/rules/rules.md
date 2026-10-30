# 🏛️ Backend Feature-Based Clean Architecture (Express.js + MySQL)

Dokumen ini merupakan spesifikasi standar fungsi dari masing-masing folder dan file berdasarkan blueprint **Feature-Based Clean Architecture** untuk backend. Panduan ini dirancang lengkap dengan contoh kode konkret menggunakan TypeScript dan driver database SQL murni (`mysql2`).

Kita akan menggunakan contoh studi kasus fitur **Karyawan**.

---

## 🧠 1. Domain Layer (`domain/`)

Layer ini adalah **otak dari bisnis Anda**. Layer ini mutakhir, suci, dan **tidak boleh mengimport apa pun dari Express atau library luar** (seperti `mysql2` atau database client). Hanya berisi TypeScript murni.

### 📁 `domain/entities/Karyawan.ts`

- **Fungsi:** Mendefinisikan struktur data murni yang dibutuhkan oleh aplikasi/bisnis Anda.
- **Contoh Isi:**

```typescript
export interface Karyawan {
  id: string;
  fullName: string;
  role: string;
  joinDate: Date; // Menggunakan objek Date asli, bukan string tanggal mentah dari DB
}
```

### 📁 `domain/repositories/KaryawanRepository.interface.ts`

- **Fungsi:** Membuat *kontrak* atau janji tentang apa saja aksi data yang bisa dilakukan. Domain tidak peduli datanya diambil dari MySQL, PostgreSQL, atau Mock Data lokal.
- **Contoh Isi:**

```typescript
import { Karyawan } from "../entities/Karyawan";

export interface IKaryawanRepository {
  getAllKaryawan(): Promise<Karyawan[]>;
}
```

### 📁 `domain/usecases/GetKaryawanUseCase.ts`

- **Fungsi:** Berisi aturan bisnis (*business logic*). Menggunakan prinsip *Dependency Inversion* dengan menerima repository lewat *constructor/parameter*.
- **Contoh Isi:**

```typescript
import { IKaryawanRepository } from "../repositories/KaryawanRepository.interface";
import { Karyawan } from "../entities/Karyawan";

export class GetKaryawanUseCase {
  constructor(private karyawanRepo: IKaryawanRepository) {}

  async execute(): Promise<Karyawan[]> {
    // Di sini Anda bisa menaruh business logic tambahan, misal filter otomatis atau sorting
    const data = await this.karyawanRepo.getAllKaryawan();
    return data.sort((a, b) => b.joinDate.getTime() - a.joinDate.getTime());
  }
}
```

---

## 💾 2. Data Layer (`data/`)

Layer ini bertanggung jawab mengambil data mentah dari Database/Infrastruktur, menyelaraskannya, dan mengimplementasikan kontrak dari Domain.

### 📁 `data/dtos/KaryawanDTO.ts`

- **Fungsi:** *Data Transfer Object*. Meniru persis struktur data kotor/asli kolom tabel MySQL yang dikirim oleh database (biasanya berupa format `snake_case`).
- **Contoh Isi:**

```typescript
export interface KaryawanRow {
  id_karyawan: string;
  nama_lengkap: string;
  jabatan_code: string;
  created_at: Date; // Mengikuti tipe kembalian objek tanggal dari driver mysql2
}
```

### 📁 `data/mappers/KaryawanMapper.ts`

- **Fungsi:** Mengubah data kotor database `KaryawanRow` menjadi data bersih `Karyawan` (Entity Domain) yang siap dikonsumsi oleh logika bisnis dan API.
- **Contoh Isi:**

```typescript
import { KaryawanRow } from "../dtos/KaryawanDTO";
import { Karyawan } from "../../domain/entities/Karyawan";

export class KaryawanMapper {
  static toEntity(row: KaryawanRow): Karyawan {
    return {
      id: row.id_karyawan,
      fullName: row.nama_lengkap,
      role: row.jabatan_code === "MGR" ? "Manager" : "Staff", // Transformasi data bisnis
      joinDate: row.created_at,
    };
  }
}
```

### 📁 `data/repositories/KaryawanRepositoryImpl.ts`

- **Fungsi:** Implementasi nyata dari kontrak interface di Domain. Di sini driver database pool (`dbPool`) dari shared folder dipanggil untuk mengeksekusi perintah SQL murni.
- **Contoh Isi:**

```typescript
import { IKaryawanRepository } from "../../domain/repositories/KaryawanRepository.interface";
import { Karyawan } from "../../domain/entities/Karyawan";
import { KaryawanRow } from "../dtos/KaryawanDTO";
import { KaryawanMapper } from "../mappers/KaryawanMapper";
import { dbPool } from "../../../../shared/infrastructure/database"; // Pool koneksi global
import { RowDataPacket } from "mysql2";

export class KaryawanRepositoryImpl implements IKaryawanRepository {
  async getAllKaryawan(): Promise<Karyawan[]> {
    // Eksekusi query murni menggunakan mysql2 pool
    const [rows] = await dbPool.query<RowDataPacket & KaryawanRow>(
      "SELECT id_karyawan, nama_lengkap, jabatan_code, created_at FROM karyawan"
    );
    
    return rows.map(KaryawanMapper.toEntity); // Mengubah semua data kotor MySQL menjadi Entity bersih
  }
}
```

---

## 🔌 3. Dependency Injection Layer (`di/`)

Layer penghubung rahasia agar layer presentation/Express tidak bocor ke dalam data layer.

### 📁 `di/container.ts`

- **Fungsi:** Merakit instansiasi class dari data layer dan domain layer sehingga siap diekspor ke Controller Express sebagai objek jadi.
- **Contoh Isi:**

```typescript
import { KaryawanRepositoryImpl } from "../data/repositories/KaryawanRepositoryImpl";
import { GetKaryawanUseCase } from "../domain/usecases/GetKaryawanUseCase";

// 1. Rakit repositori infrastruktur
const karyawanRepository = new KaryawanRepositoryImpl();

// 2. Inject repositori ke UseCase murni. UseCase siap pakai!
export const getKaryawanUseCase = new GetKaryawanUseCase(karyawanRepository);
```

---

## 🎨 4. Presentation Layer (`presentation/`)

Layer yang hanya peduli tentang protokol HTTP, menerima Express Request, memproses validasi parameter, dan mengembalikan Response API.

### 📁 `presentation/controllers/KaryawanController.ts`

- **Fungsi:** Handler utama untuk memetakan request data ke UseCase dan merumuskan bentuk kembalian JSON serta HTTP Status Code.
- **Contoh Isi:**

```typescript
import { Request, Response } from "express";
import { getKaryawanUseCase } from "../../di/container";

export class KaryawanController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      // Memanggil usecase murni yang sudah dirakit di folder DI
      const karyawanList = await getKaryawanUseCase.execute();
      
      res.status(200).json({
        success: true,
        data: karyawanList
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan internal pada sistem."
      });
    }
  }
}
```

<h3>📁 `presentation/routes.ts`</h3>

- **Fungsi:** Mendefinisikan endpoint URL khusus untuk ekosistem fitur ini.
- **Contoh Isi:**

```typescript
import { Router } from "express";
import { KaryawanController } from "./controllers/KaryawanController";

const router = Router();

router.get("/", KaryawanController.getAll);

export { router as karyawanRouter };
```

---

## 💡 Tips Praktis untuk Implementation Lanjutan

- **File Naming & Export:** Gunakan **camelCase** untuk nama file router internal (`routes.ts`) dan file perakit di folder DI (`container.ts`). Gunakan **PascalCase** untuk kelas usecase, mapper, controller, dan implementasi repository agar selaras dengan ekosistem backend TypeScript.

---

## 🚪 5. Feature Public API (`index.ts` Utama Fitur)

### 📄 `features/karyawan/index.ts`

- **Fungsi:** Penjaga gawang fitur. Hanya mengekspos objek router milik presentation layer agar bisa dipasang di file root routing utama Express.
- **Contoh Isi:**

```typescript
// Fitur lain HANYA boleh mengakses file ini. 
// Folder domain/, data/, di/ di dalam tidak boleh disentuh langsung dari luar!
export { karyawanRouter } from "./presentation/routes";
```

----
# 🏛️ Fondasi Utama & Integrasi Server (Express + MySQL)

Bagian ini menjelaskan konfigurasi koneksi database bersama (*Shared Infrastructure*) dan cara merakit seluruh layer fitur `karyawan` ke dalam server Express utama.

---

## 🌐 1. Shared Database Infrastructure

File ini mengelola koneksi pool ke MySQL secara terpusat agar bisa digunakan kembali oleh seluruh fitur tanpa membuat koneksi baru berulang kali.

### 📁 `src/shared/infrastructure/database.ts`

```typescript
import mysql from 'mysql2/promise';

// Membuat pool koneksi murni ke MySQL
export const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password_kamu',
  database: process.env.DB_NAME || 'nama_database_kamu',
  waitForConnections: true,
  connectionLimit: 10, // Maksimal 10 koneksi simultan terbuka
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});
```

---

## 🌐 2. Integrasi ke Server Utama

Setelah folder `features/karyawan/` lengkap diisi dengan kode dari panduan aturan arsitektur, kita mendaftarkannya ke dalam entry point aplikasi utama melalui gerbang `index.ts`.

### 📁 `src/app.ts`

```typescript
import express, { Application } from 'express';
import { karyawanRouter } from './features/karyawan'; // Otomatis membaca pintu gerbang index.ts

const app: Application = express();

// Global Middlewares
app.use(express.json());

// Registrasi Route Fitur (Hanya memanggil router dari Public API)
app.use('/api/v1/karyawan', karyawanRouter);

// Global Error Handler Handler (Opsional)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan sistem internal.'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan lancar di http://localhost:${PORT}`);
});
```
