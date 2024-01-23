import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

export const UserGroup = {
  SUPERADMIN: "SuperAdmin",
  ADMIN: "Admin",
  TEACHER: "Teacher",
  STUDENT: "Student",
} as const;

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rules below
specify that owners, authenticated via your Auth resource can "create",
"read", "update", and "delete" their own records. Public users,
authenticated via an API key, can only "read" records.
=========================================================================*/

const schema = a.schema({
  Difficulty: a.enum(["EASY", "MEDIUM", "HARD"]),
  Task: a
    .model({
      title: a.string(),
      description: a.string(),
      difficulty: a.ref("Difficulty"),
    })
    .authorization([a.allow.public()]),
  Location: a.customType({
    name: a.string(),
  }),
  Todo: a
    .model({
      name: a.string().required(),
      completed: a.boolean().default(false),
    })
    .authorization([a.allow.public()]),
  Institution: a
    .model({
      id: a.string().required(),
      name: a.string().required(),
      teachers: a.hasMany("Teacher"),
      stats: a.hasMany("Stats"),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow.groupDefinedIn("adminRole").to(["read"]),
      a.allow.groupDefinedIn("teacherRole").to(["read"]),
      a.allow.groupDefinedIn("studentRole").to(["read"]),
    ]),
  Profile: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      bio: a.string(),
      profileImage: a.url(),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow.owner().inField("id").to(["read", "update", "create"]),
      a.allow.groupDefinedIn("adminRole"),
      a.allow.groupDefinedIn("teacherRole").to(["read"]),
      a.allow.groupDefinedIn("studentRole").to(["read"]),
    ]),
  Teacher: a
    .model({
      subject: a.string(),
      profile: a.hasOne("Profile"),
      institution: a.belongsTo("Institution"),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow.groupDefinedIn("adminRole"),
      a.allow.groupDefinedIn("teacherRole").to(["read"]),
      a.allow.groupDefinedIn("studentRole").to(["read"]),
    ]),
  Stats: a
    .model({
      key: a.string().required(),
      value: a.integer().required(),
      time: a.datetime().required(),
      institution: a.belongsTo("Institution"),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow.groupDefinedIn("adminRole").to(["read"]),
      a.allow.groupDefinedIn("teacherRole").to(["read"]),
      a.allow.groupDefinedIn("studentRole").to(["read"]),
    ])
    .identifier(["key", "time"]),
  Subject: a
    .model({
      name: a.string().required(),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow
        .specificGroups([UserGroup.ADMIN, UserGroup.TEACHER, UserGroup.STUDENT])
        .to(["read"]),
    ]),
  Grade: a
    .model({
      name: a.string().required(),
      score: a.integer().required(),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow
        .specificGroups([UserGroup.ADMIN, UserGroup.TEACHER, UserGroup.STUDENT])
        .to(["read"]),
    ]),
  Language: a
    .model({
      name: a.string().required(),
      shortName: a.string().required(),
      flag: a.url(),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow
        .specificGroups([UserGroup.ADMIN, UserGroup.TEACHER, UserGroup.STUDENT])
        .to(["read"]),
    ]),
  Question: a
    .model({
      excerpt: a.string().required(),
      grade: a.hasOne("Grade").required(),
      subject: a.hasOne("Subject").required(),
      languages: a.hasMany("QuestionLanguage"),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow
        .specificGroups([UserGroup.ADMIN, UserGroup.TEACHER, UserGroup.STUDENT])
        .to(["read"]),
    ]),
  QuestionLanguage: a
    .model({
      content: a.json().required(),
      question: a.belongsTo("Question"),
      language: a.hasOne("Language"),
      options: a.hasMany("QuestionOption"),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow
        .specificGroups([UserGroup.ADMIN, UserGroup.TEACHER, UserGroup.STUDENT])
        .to(["read"]),
    ]),
  QuestionOption: a
    .model({
      content: a.json().required(),
      question: a.belongsTo("QuestionLanguage"),
    })
    .authorization([
      a.allow.specificGroup(UserGroup.SUPERADMIN),
      a.allow
        .specificGroups([UserGroup.ADMIN, UserGroup.TEACHER, UserGroup.STUDENT])
        .to(["read"]),
    ]),
  CreateUserResponse: a.customType({
    id: a
      .string()
      .required()
      .authorization([
        a.allow.specificGroups([UserGroup.SUPERADMIN, UserGroup.ADMIN]),
      ]),
  }),
  ApiBaseResponse: a.customType({
    success: a
      .boolean()
      .authorization([a.allow.specificGroup(UserGroup.SUPERADMIN)]),
  }),
  createInstitutionGroups: a
    .mutation()
    .arguments({ institution: a.string().required() })
    .returns(a.ref("ApiBaseResponse"))
    .function("adminActions")
    .authorization([a.allow.specificGroup(UserGroup.SUPERADMIN)]),
  createUser: a
    .mutation()
    .arguments({
      email: a.string().required(),
      password: a.string().required(),
      group: a.string().required(),
      institution: a.string(),
    })
    .returns(a.ref("CreateUserResponse"))
    .function("adminActions")
    .authorization([
      a.allow.specificGroups([UserGroup.SUPERADMIN, UserGroup.ADMIN]),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
