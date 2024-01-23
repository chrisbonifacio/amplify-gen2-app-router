import { createAndGetQuestion } from "@/actions/questions";
import Question from "@/components/ui/question";
import { client } from "@/utils/client";

export default async function Home() {
  const question = await createAndGetQuestion();

  // console.log("from parent component:", question);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2 className="font-bold">Parent Component</h2>

      <div>
        <pre>{JSON.stringify(question, null, 2)}</pre>
      </div>

      <Question id={question.id} />
    </main>
  );
}
