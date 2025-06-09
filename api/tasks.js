import Express from "express";
const router = Express.Router();
export default router;
import requireBody from "#middleware/requireBody";
import { createTask } from "#db/queries/tasks";
import requireUser from "#middleware/requireUser";
import { getTaskById } from "#db/queries/tasks";
import { deleteTask } from "#db/queries/tasks";

router.use(requireUser);

// all routes here will start with tasks
router.route("/").post(requireBody(["title", "done"]), async (req, res) => {
  const { title, done } = req.body;
  const task = await createTask(title, done, req.user.id);
  res.status(201).send(task);
  // Get all tasks
});

router.param("id", async (req, res, next, id) => {
  const task = await getTaskById(id);
  if (!task) {
    return res.status(404).send("Task not found");
  }
  if (task.user_id !== req.user.id) {
    return res.status(403).send("This is not your task!");
  }
  req.task = task;
  console.log(req.task);
  next();
});

router.route("/:id").delete(async (req, res) => {
  //   console.log(req.task);
  const result = await deleteTask(req.task.id);
  //   console.log("from api", result);
  res.sendStatus(204);
});
