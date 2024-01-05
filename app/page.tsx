import { createAndGetQuestion } from "@/actions/questions";
import Question from "@/components/ui/question";
import { client } from "@/utils/client";

export default async function Home() {
  const newQuestion = await createAndGetQuestion();
  const { data: question } = await client.models.Question.get(
    {
      id: newQuestion.id,
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2 className="font-bold">Parent Component</h2>

      <div>
        <pre>{JSON.stringify(question, null, 2)}</pre>
      </div>

      <Question id={newQuestion.id} />
    </main>
  );
}
