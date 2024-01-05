import { client } from "@/utils/client";
import { type Schema } from "@/amplify/data/resource";

type Question = Schema["Question"];

type QuestionProps = {
  id: Question["id"];
};

export default async function Question({ id }: QuestionProps) {
  const question = await client.models.Question.get(
    { id },
    { selectionSet: ["languages.id", "languages.language.shortName"] }
  );

  return (
    <div>
      <h2 className="font-bold">SubComponent</h2>
      <pre>{JSON.stringify(question, null, 2)}</pre>;
    </div>
  );
}
