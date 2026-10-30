-- Database: db_karyawan
CREATE DATABASE IF NOT EXISTS db_karyawan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_karyawan;

-- Tabel Karyawan
CREATE TABLE IF NOT EXISTS karyawan (
  id_karyawan INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap VARCHAR(100) NOT NULL,
  jabatan VARCHAR(50) NOT NULL,
  tanggal_gabung DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data
INSERT INTO karyawan (nama_lengkap, jabatan) VALUES
('John Smith', 'Manager'),
('Jane Doe', 'Staff'),
('Bob Johnson', 'Staff'),
('Alice Williams', 'Manager');

-- Indexes
CREATE INDEX idx_karyawan_jabatan ON karyawan(jabatan);
CREATE INDEX idx_karyawan_tanggal_gabung ON karyawan(tanggal_gabung);