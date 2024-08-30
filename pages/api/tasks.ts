import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

// IMPLEMENTAÇÃO DOS MÉTODOS HTTP
type Task = {
  _id?: string | ObjectId;
  title: string;
  description: string;
  completed: boolean;
};

type ResponseData = {
  message: string;
  data?: Task | Task[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const client = await clientPromise;
    const db = client.db("tarefas");
    const collection = db.collection<Task>("tasks");
    switch (req.method) {
      //POST -- para criar uma nova tarefa
      case "POST": {
        const { title, description } = req.body;
        if (!title || !description) {
          return res
            .status(400)
            .json({ message: "Informe o título e a descrição!" });
        }
        const newTask: Task = { title, description, completed: false };
        const result = await collection.insertOne(newTask);
        return res.status(201).json({
          message: "A tarefa foi adicionada com sucesso!",
          data: { ...newTask, _id: result.insertedId },
        });
      }

      //GET -- para listar todas tarefas
      case "GET": {
        const tasks = await collection.find({}).toArray();
        return res
          .status(200)
          .json({ message: "Tarefas recuperadas com sucesso!", data: tasks });
      }
      //PUT -- para atualizar uma tarefas
      case "PUT": {
        const { id, title, description, completed } = req.body;
        if (!id || typeof id != "string" || !ObjectId.isValid(id)) {
          return res.status(400).json({ message: "ID inválido." });
        }
        const updateData: Partial<Task> = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (completed !== undefined) updateData.completed = completed;
        console.log(updateData);
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Tarefa não encontrada." });
        }

        return res
          .status(200)
          .json({ message: "tarefa atualizada com sucesso!" });
      }
      //DELETE -- para excluir uma tarefa
      case "DELETE": {
        const { id } = req.body;
        if (!id || !ObjectId.isValid(id)) {
          return res.status(400).json({ message: "ID inválido." });
        }
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Tarefa não encontrada." });
        }
        return res
          .status(200)
          .json({ message: "Tarefa excluída com sucesso!" });
      }
      // lida com métodos inváldos
      default:
        res.status(500).json({ message: "Método não permitido." });
    }
  } catch (error) {}
}
