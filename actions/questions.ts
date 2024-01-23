"use server";

import { client } from "@/utils/client";

export const createAndGetQuestion = async () => {
  const { data: grade } = await client.models.Grade.create({
    name: "Math Exam",
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

  const { data: firstQuery } = await client.models.Question.get(
    {
      id: question.id,
    },
    {
      selectionSet: ["id", "subject.*", "languages.language.name"],
    }
  );

  const { data: secondQuery } = await client.models.Question.get(
    {
      id: question.id,
    },
    {
      selectionSet: ["id", "grade.*", "languages.language.name"],
    }
  );

  console.log("firstQuery:", firstQuery);
  console.log("secondQuery:", secondQuery);

  return firstQuery;
};
