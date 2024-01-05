"use server";

import { client } from "@/utils/client";
  
export const getTodos = async () => {

  const todos = await client.models.Todo.list();

  console.log(todos);
};

export const createTodo = async (formData: FormData) => {
  const todo = await client.models.Todo.create({
    content: formData.get("content") as string,
  });

  console.log(todo);
};