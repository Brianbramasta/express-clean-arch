# 📊 Visualisasi Feature-Based Clean Architecture

Berikut adalah diagram visual untuk memahami struktur folder, aliran data, dan aturan ketergantungan pada arsitektur project ini.

---

## 📁 1. Struktur Folder Fitur
Diagram ini menggambarkan bagaimana sebuah fitur (misalnya `karyawan`) mengisolasi seluruh kodenya dan hanya membuka satu pintu keluar melalui file `index.ts`.

```mermaid
graph TD
    subgraph features/karyawan/ [📦 Folder Fitur: karyawan]
        A[index.ts <br><i>Gerbang Utama / Public API</i>] --> B[presentation/ <br><i>Layer HTTP & Express</i>]
        B -->|Minta data ke| DI[di/container.ts <br><i>Perakit Dependensi</i>]
        DI -->|Inject| C[domain/ <br><i>Layer Bisnis Murni</i>]
        DI -->|Inject| D[data/ <br><i>Layer MySQL & Infra</i>]
        
        subgraph presentation/
            B1[routes.ts] --> B2[controllers/]
        end
        
        subgraph domain/
            C1[usecases/] --> C2[repositories/ <br><i>Interfaces</i>]
            C1 --> C3[entities/]
        end
        
        subgraph data/
            D1[repositories/ <br><i>Impl</i>] --> D2[mappers/]
            D1 --> D3[dtos/]
        end
    end
    
    subgraph shared/ [🏛️ Shared Layer / Global]
        S1[infrastructure/database.ts <br><i>MySQL Connection Pool</i>]
    end

    D1 -->|Gunakan Pool Koneksi| S1
```

---

## 🔄 2. Aliran Data (*Data Flow*)
Diagram ini menggambarkan perjalanan data dari saat *client* melakukan request HTTP ke Express hingga query dieksekusi ke MySQL, lalu dikembalikan dalam bentuk data bersih.

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Router as presentation/routes
    participant Controller as presentation/controllers
    participant UseCase as domain/usecases
    participant RepoImpl as data/repositories (Impl)
    participant DB as MySQL Database

    Client->>Router: HTTP GET /api/v1/karyawan
    Router->>Controller: Panggil Controller.getAll()
    Controller->>UseCase: Panggil GetKaryawanUseCase.execute()
    UseCase->>RepoImpl: Panggil KaryawanRepositoryImpl.findAll()
    RepoImpl->>DB: Jalankan Query "SELECT * FROM karyawan"
    DB-->>RepoImpl: Kembalikan Data Kotor (Raw Rows / DTO)
    Note over RepoImpl,DB: Di-transformasikan oleh KaryawanMapper<br/>menjadi Entity Bersih (camelCase)
    RepoImpl-->>UseCase: Kembalikan Array Karyawan (Entity)
    UseCase-->>Controller: Kembalikan Data (Setelah sorting/filter bisnis)
    Controller-->>Client: HTTP Response 200 OK (JSON Bersih)
```

---

## 📐 3. Aturan Ketergantungan (*Dependency Rule*)
Aturan mutlak yang menunjukkan bahwa semua layer luar wajib bergantung dan mengarah ke **Domain Layer (Core)**, sedangkan Domain sama sekali tidak boleh meng-import kode dari luar.

```mermaid
graph RL
    subgraph Layer Luar
        DB[(MySQL Database)] <--> Data[data/ <br><i>Repositories Impl & DTOs</i>]
        Express[Express.js / Client] <--> Pres[presentation/ <br><i>Routes & Controllers</i>]
    end

    subgraph Layer Dalam / Core
        Pres -->|Bergantung pada| Domain[domain/ <br><i>UseCases & Entities</i>]
        Data -->|Mengimplementasikan Kontrak| Domain
    end

    style Domain fill:#f9f,stroke:#333,stroke-width:2px
```

----
# 🏛️ Backend Feature-Based Clean Architecture (Express.js + MySQL)

Dokumen ini merupakan adaptasi dari arsitektur *Feature-Based Clean Architecture* yang diterapkan pada ekosistem Backend Express.js dengan TypeScript dan MySQL. Prinsipnya tetap sama: menjaga agar **Domain Layer tetap suci (terisolasi)** dan memastikan komunikasi antar-fitur terkunci rapat lewat **Public API (`index.ts`)**.

---

## 📁 1. Struktur Folder Fitur (`src/features/karyawan/`)

Setiap fitur membungkus seluruh lapisannya secara mandiri di dalam satu folder. Berikut adalah struktur folder konkretnya:

```text
src/
├── shared/                       # 🌐 Global Infrastructure & Shared
│   └── infrastructure/
│       └── database.ts           # dbPool (Koneksi Pool MySQL global)
│
└── features/
    └── karyawan/                 # 📦 Feature: Karyawan
        ├── index.ts              # 🚪 Feature Public API (Gerbang Utama)
        │
        ├── presentation/         # 🎨 Presentation Layer (Urusan HTTP Express)
        │   ├── controllers/      # KaryawanController.ts (Handler Request & Response)
        │   ├── middlewares/      # KaryawanValidator.ts (Validasi HTTP input)
        │   └── routes.ts         # Router Express khusus fitur karyawan
        │
        ├── di/                   # 🔌 DI Layer (Perakit Objek)
        │   └── container.ts      # KaryawanContainer.ts (Factory Engine)
        │
        ├── domain/               # 🧠 Domain Layer - PURE TS (Otak Bisnis Murni)
        │   ├── entities/         # Karyawan.ts (Struktur data bisnis murni)
        │   ├── repositories/     # IKaryawanRepository.interface.ts (Kontrak data)
        │   └── usecases/         # GetKaryawanUseCase.ts (Logika bisnis spesifik)
        │
        └── data/                 # 💾 Data Layer (Urusan MySQL Database)
            ├── dtos/             # KaryawanDTO.ts (Struktur kolom/baris asli MySQL)
            ├── mappers/          # KaryawanMapper.ts (Pengubah DTO ke Entity)
            └── repositories/     # KaryawanRepositoryImpl.ts (Tempat Query SQL Murni)
```

---

## 📐 2. Diagram Aliran Data & Hubungan Antar-Layer

Diagram ini memvisualisasikan bagaimana kode di dalam fitur `karyawan` saling terhubung. **Domain Layer (Hijau) berada di tengah dan tidak memiliki panah keluar (terisolasi sempurna)**.

```mermaid
graph TD
    %% Styling
    classDef domain fill:#d4edda,stroke:#28a745,stroke-width:2px,color:#155724;
    classDef data fill:#cce5ff,stroke:#007bff,stroke-width:2px,color:#004085;
    classDef pres fill:#fff3cd,stroke:#ffc107,stroke-width:2px,color:#856404;
    classDef di fill:#e2e3e5,stroke:#6c757d,stroke-width:2px,color:#383d41;
    classDef infra fill:#f8d7da,stroke:#dc3545,stroke-width:2px,color:#721c24;

    %% Global Infrastructure Boundary
    subgraph Global_Infra [🌐 Global Infrastructure & Shared]
        dbPool[database.ts <br>MySQL Connection Pool]:::infra
    end

    %% Feature Boundary
    subgraph Feature_Karyawan [📦 Feature: Karyawan]
        
        %% Public API Gate
        publicAPI[🚪 index.ts <br>Feature Public API]:::pres

        %% Presentation Layer
        subgraph Presentation_Layer [🎨 Presentation Layer]
            routes[routes.ts <br>Express Router]:::pres
            controller[KaryawanController.ts]:::pres
        end

        %% DI Layer
        subgraph DI_Layer [🔌 DI Layer]
            container[container.ts <br>Factory Engine]:::di
        end

        %% Domain Layer
        subgraph Domain_Layer [🧠 Domain Layer - PURE TS]
            usecase[GetKaryawanUseCase.ts]:::domain
            repoInterface[IKaryawanRepository.interface.ts]:::domain
            entity[Karyawan.ts <br>Entities]:::domain
        end

        %% Data Layer
        subgraph Data_Layer [💾 Data Layer]
            repoImpl[KaryawanRepositoryImpl.ts]:::data
            mapper[KaryawanMapper.ts]:::data
            dto[KaryawanDTO.ts <br>MySQL Row Type]:::data
        end
    end

    %% Dependency & Data Flow Directions
    routes --> controller
    
    %% The Secret Bridge (DI)
    controller --> container
    container --> usecase
    container --> repoImpl

    %% Inner Connections
    usecase --> repoInterface
    repoInterface --> entity
    
    repoImpl -.->|Implements| repoInterface
    repoImpl --> mapper
    repoImpl --> dbPool
    
    repoImpl --> dto
    mapper --> dto
    mapper --> entity
    
    %% Public API Gate Connection
    publicAPI --> routes
    
    %% Outside Consumer
    AppTs[app.ts utama] -->|Hanya boleh akses pintu utama| publicAPI
```

---

## 🧱 3. Diagram Komunikasi Antar-Fitur (Cross-Feature Boundaries)

File `index.ts` bertindak sebagai pintu gerbang (*Public API*). Fitur luar (seperti `penggajian`) dilarang keras langsung melakukan *deep import* atau menembak isi perut dari fitur `karyawan`.

```mermaid
graph LR 
    classDef public fill:#28a745,stroke:#1e7e34,stroke-width:2px,color:#fff;
    classDef private fill:#dc3545,stroke:#bd2130,stroke-width:2px,color:#fff;
    classDef shared fill:#17a2b8,stroke:#117a8b,stroke-width:2px,color:#fff;

    subgraph Fitur_Penggajian [📦 Fitur Penggajian]
        GajiRouter[penggajian/presentation/routes.ts]
    end

    subgraph Fitur_Karyawan [📦 Feature: Karyawan]
        Gate[🚪 karyawan/index.ts <br>Public API]:::public
        Private_Code[Isi perut fitur backend: <br>Domain / Data / SQL Query]:::private
    end

    %% Jalur Komunikasi Yang Benar
    GajiRouter -->|✅ BOLEH <br>Gunakan Express Router Fitur Lain| Gate
    Gate --> Private_Code

    %% Jalur Yang Dilarang (Tight Coupling)
    GajiRouter x-.->|❌ DILARANG TEROBOS! <br>Ambil query SQL / UseCase langsung| Private_Code
```

---

## 🔍 Cara Membaca Alur Kerja di Backend

1. **`app.ts` Utama / Server:** Hanya mengenal dan meng-import objek router Express yang diekspos secara resmi oleh pintu gerbang `features/karyawan/index.ts`.
2. **Presentation Layer (`KaryawanController`):** Menerima objek request (`req`) dan response (`res`) Express. Ketika butuh mengeksekusi logika bisnis, controller memanggil instansiasi UseCase yang sudah disediakan oleh **DI Layer (`container.ts`)**.
3. **DI Layer (`container.ts`):** Bertindak sebagai pabrik perakitan. Layer ini menggabungkan `KaryawanRepositoryImpl` (Data) ke dalam `GetKaryawanUseCase` (Domain) sehingga Presentation tinggal memakainya dalam bentuk objek jadi.
4. **Data Layer (`KaryawanMapper`):** Bertindak sebagai penyaring. Mengubah data kotor `snake_case` hasil query SQL murni dari database (`KaryawanDTO`) menjadi objek entitas `camelCase` bersih (`Karyawan.ts`) yang dipahami oleh layer Domain.
