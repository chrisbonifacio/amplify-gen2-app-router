"use server";

import { client } from "@/utils/client";

export const createAndGetQuestion = async () => {
  const { data: grade } = await client.models.Grade.create({
    score: 10,
  });

  const { data: subject } = await client.models.Subject.create({
    name: "Math",
  });

  const { data: question } = await client.models.Question.create({
    excerpt: "What is 2 + 2?",
    grade,
    subject,
  });

  const { data: language } = await client.models.Language.create({
    name: "English",
    shortName: "en",
  });

  const { data: questionLanguage } =
    await client.models.QuestionLanguage.create({
      content: JSON.stringify({
        shortName: "en",
      }),
      question,
      language,
    });

  //   const { data: questionOption } = await client.models.QuestionOption.create({
  //     content: JSON.stringify({ name: "Option #1" }),
  //   });

  const { data: updatedQuestion } = await client.models.Question.get(
    {
      id: question.id,
    },
    {
      selectionSet: [
        "id",
        "grade.id",
        "subject.id",
        "languages.language.shortName",
      ],
    }
  );

  console.log(updatedQuestion);

  return updatedQuestion;
};
