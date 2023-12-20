import { Environment, Network, RecordSource, Store } from "relay-runtime";

const baseUrl = new URL("http://localhost:8000");

export function createClientNetwork() {
  return Network.create(async (params, variables) => {
    const response = await fetch(new URL("/api/v2/graphql", baseUrl), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: params.text,
        variables,
      }),
    });

    const json = await response.text();
    return JSON.parse(json);
  });
}

let clientEnv: Environment | undefined;
export function getClientEnvironment() {
  if (typeof window === "undefined") return null;

  if (clientEnv == null) {
    clientEnv = new Environment({
      network: createClientNetwork(),
      store: new Store(new RecordSource()),
      isServer: false,
    });
  }

  return clientEnv;
}