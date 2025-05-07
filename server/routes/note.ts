import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Note } from "../entities/Note";
import { ulid } from "ulid";

const router = Router();
const noteRepo = () => AppDataSource.getRepository(Note);

/**
 * @openapi
 * /api/notes:
 *   get:
 *     summary: 获取全部笔记
 *     tags:
 *       - 笔记
 *     responses:
 *       200:
 *         description: 笔记列表
 */
router.get("/", async (req, res) => {
  const notes = await noteRepo().find();
  res.json(notes);
});

/**
 * @openapi
 * /api/notes:
 *   post:
 *     summary: 新建笔记
 *     tags:
 *       - 笔记
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 新建成功，返回笔记
 */
router.post("/", async (req, res) => {
  const note = noteRepo().create({ ...req.body, id: ulid() });
  await noteRepo().save(note);
  res.json(note);
});

/**
 * @openapi
 * /api/notes/{id}:
 *   put:
 *     summary: 更新笔记
 *     tags:
 *       - 笔记
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 笔记ID（ulid）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 更新后的笔记
 */
router.put("/:id", async (req, res) => {
  const id = req.params.id;
  await noteRepo().update(id, req.body);
  const updated = await noteRepo().findOneBy({ id });
  res.json(updated);
});

/**
 * @openapi
 * /api/notes/{id}:
 *   delete:
 *     summary: 删除笔记
 *     tags:
 *       - 笔记
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 笔记ID（ulid）
 *     responses:
 *       200:
 *         description: 删除成功
 */
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  await noteRepo().delete(id);
  res.json({ success: true });
});

export default router;
