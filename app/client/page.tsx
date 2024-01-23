"use client";

import { generateClient } from "aws-amplify/data";
import { post } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import config from "@/amplifyconfiguration.json";

Amplify.configure({
  ...config,
  API: {
    REST: {
      test: {
        endpoint:
          "https://abcdefghij1234567890.execute-api.us-east-1.amazonaws.com/dev",
      },
    },
  },
});

// console.log(Amplify.getConfig());

// const client = generateClient<Schema>();

// console.log(client);

export default function Client() {
  //   const run = async () => {
  //     const { data: firstQuery } = await client.models.Question.get(
  //       {
  //         id: "05a5deba-e67e-4c99-bb30-d3fc63054f1e",
  //       },
  //       {
  //         selectionSet: ["id", "subject.*", "languages.language.name"],
  //       }
  //     );
  //     const { data: secondQuery } = await client.models.Question.get(
  //       {
  //         id: "c931ba82-1ef8-4771-9069-3a7199ac5bad",
  //       },
  //       {
  //         selectionSet: ["id", "grade.*", "languages.language.name"],
  //       }
  //     );
  //     console.log("firstQuery:", firstQuery);
  //     console.log("secondQuery:", secondQuery);
  //   };

  const run = async () => {
    const response = await post({
      apiName: "test",
      path: "/test",
      options: {
        body: {
          foo: "bar",
        },
      },
    }).response;

    const data = await response.body.json();

    console.log(data);
  };

  useEffect(() => {
    // run();
  }, []);

  return (
    <div>
      <h1>Client Component</h1>
      <button onClick={run}>Run</button>
    </div>
  );
}
