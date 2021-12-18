import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from "remix";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";

const schema = require("../schema");

const graphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new SchemaLink({ schema }),
});

const IndexQuery = gql`
  query IndexQuery {
    currentUser {
      id
      name
    }
  }
`;

const UpdateNameMutation = gql`
  mutation UpdateNameMutation($name: String!) {
    currentUserUpdate(name: $name) {
      updatedUser {
        id
        name
      }
      error
    }
  }
`;

export const loader: LoaderFunction = async () => {
  const { data, error } = await graphqlClient.query({ query: IndexQuery });
  if (error) {
    throw error;
  }

  return { data };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const inputData = {} as any;
  formData.forEach((value, key) => (inputData[key] = value));

  const { data } = await graphqlClient.mutate({
    mutation: UpdateNameMutation,
    variables: inputData,
  });

  return { data };
};

export default function Index() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const transition = useTransition();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <div>Query: {JSON.stringify(loaderData.data)}</div>
      <div>Mutation: {actionData && JSON.stringify(actionData.data)}</div>
      <Form method="post">
        <fieldset disabled={transition.state === "submitting"}>
          <label>
            Name
            <input
              name="name"
              type="text"
              defaultValue={loaderData.data.currentUser.name}
            />
          </label>
          <button>Save</button>
        </fieldset>
      </Form>
      {transition.state}
    </div>
  );
}
