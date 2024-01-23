import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource.js";
import { UserGroup, data } from "./data/resource.js";
import { CfnUserPoolGroup } from "aws-cdk-lib/aws-cognito";

const backend = defineBackend({
  auth,
  data,
});

const userPoolStack = backend.createStack("UserPoolGroupStack");

for (const groupName of Object.values(UserGroup)) {
  new CfnUserPoolGroup(userPoolStack, `${groupName}Group`, {
    userPoolId: backend.auth.resources.userPool.userPoolId,
    groupName,
  });
}
