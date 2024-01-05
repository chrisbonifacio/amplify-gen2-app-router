import { client } from "@/utils/client";
import { type Schema } from "@/amplify/data/resource";

type Question = Schema["Question"];

type QuestionProps = {
  id: Question["id"];
};

export default async function Question({ id }: QuestionProps) {
  const { data: question } = await client.models.Question.get(
    { id },
    { selectionSet: ["languages.id", "languages.language.shortName"] }
  );

  console.log("from sub component:", question);

  return (
    <div>
      <h2 className="font-bold">SubComponent</h2>
      <pre>{JSON.stringify(question, null, 2)}</pre>;
    </div>
  );
}
