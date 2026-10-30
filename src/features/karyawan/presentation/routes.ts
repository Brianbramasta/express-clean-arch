import { Router } from "express";
import { KaryawanController } from "./controllers/KaryawanController";
import { KaryawanValidator } from "./middlewares/KaryawanValidator";

const router = Router();

/**
 * @swagger
 * /api/v1/karyawan:
 *   get:
 *     summary: Mendapatkan semua data karyawan
 *     description: Mengambil daftar semua karyawan dari database
 *     tags: [Karyawan]
 *     responses:
 *       200:
 *         description: Berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Karyawan'
 *       500:
 *         description: Error internal server
 */
router.get("/", KaryawanController.getAll);

/**
 * @swagger
 * /api/v1/karyawan/{id}:
 *   get:
 *     summary: Mendapatkan karyawan berdasarkan ID
 *     description: Mengambil detail karyawan berdasarkan ID yang diberikan
 *     tags: [Karyawan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID karyawan
 *     responses:
 *       200:
 *         description: Berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Karyawan'
 *       404:
 *         description: Karyawan tidak ditemukan
 *       500:
 *         description: Error internal server
 */
router.get("/:id", KaryawanController.getById);

/**
 * @swagger
 * /api/v1/karyawan:
 *   post:
 *     summary: Membuat data karyawan baru
 *     description: Menambahkan karyawan baru ke database
 *     tags: [Karyawan]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - namaLengkap
 *               - jabatan
 *             properties:
 *               namaLengkap:
 *                 type: string
 *                 example: John Smith
 *               jabatan:
 *                 type: string
 *                 example: Manager
 *     responses:
 *       201:
 *         description: Berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Karyawan'
 *       400:
 *         description: Data tidak valid
 *       500:
 *         description: Error internal server
 */
router.post("/", KaryawanValidator.validateCreate, KaryawanController.create);

/**
 * @swagger
 * /api/v1/karyawan/{id}:
 *   put:
 *     summary: Mengupdate data karyawan
 *     description: Mengubah data karyawan yang ada
 *     tags: [Karyawan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID karyawan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namaLengkap:
 *                 type: string
 *                 example: Jane Doe
 *               jabatan:
 *                 type: string
 *                 example: Staff
 *     responses:
 *       200:
 *         description: Berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Karyawan'
 *       404:
 *         description: Karyawan tidak ditemukan
 *       500:
 *         description: Error internal server
 */
router.put("/:id", KaryawanValidator.validateUpdate, KaryawanController.update);

/**
 * @swagger
 * /api/v1/karyawan/{id}:
 *   delete:
 *     summary: Menghapus data karyawan
 *     description: Menghapus karyawan berdasarkan ID
 *     tags: [Karyawan]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID karyawan
 *     responses:
 *       200:
 *         description: Berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Karyawan berhasil dihapus
 *       404:
 *         description: Karyawan tidak ditemukan
 *       500:
 *         description: Error internal server
 */
router.delete("/:id", KaryawanController.delete);

/**
 * @swagger
 * components:
 *   schemas:
 *     Karyawan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID unik karyawan
 *           example: "1"
 *         namaLengkap:
 *           type: string
 *           description: Nama lengkap karyawan
 *           example: John Smith
 *         jabatan:
 *           type: string
 *           description: Jabatan karyawan
 *           example: Manager
 *         tanggalGabung:
 *           type: string
 *           format: date-time
 *           description: Tanggal karyawan bergabung
 *           example: "2024-01-15T10:30:00.000Z"
 */

export { router as karyawanRouter };