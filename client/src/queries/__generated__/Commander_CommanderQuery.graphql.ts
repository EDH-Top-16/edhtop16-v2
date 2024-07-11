/**
 * @generated SignedSource<<ae1ba298953304a5d99c9945a0263ea7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderQuery$variables = {
  commander: string;
};
export type Commander_CommanderQuery$data = {
  readonly commander: {
    readonly entries: ReadonlyArray<{
      readonly " $fragmentSpreads": FragmentRefs<"Commander_EntryTableData">;
    }>;
  };
};
export type Commander_CommanderQuery = {
  response: Commander_CommanderQuery$data;
  variables: Commander_CommanderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "commander"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  },
  (v2/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Commander_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Entry",
            "kind": "LinkedField",
            "name": "entries",
            "plural": true,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "Commander_EntryTableData"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "Commander_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Entry",
            "kind": "LinkedField",
            "name": "entries",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Player",
                "kind": "LinkedField",
                "name": "player",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Tournament",
                "kind": "LinkedField",
                "name": "tournament",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "decklist",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "standing",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "wins",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "losses",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "draws",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "c6500a8737a7fb0422803adece691fb5",
    "id": null,
    "metadata": {},
    "name": "Commander_CommanderQuery",
    "operationKind": "query",
    "text": "query Commander_CommanderQuery(\n  $commander: String!\n) {\n  commander(name: $commander) {\n    entries {\n      ...Commander_EntryTableData\n      id\n    }\n    id\n  }\n}\n\nfragment Commander_EntryTableData on Entry {\n  player {\n    name\n    id\n  }\n  tournament {\n    name\n    id\n  }\n  id\n  decklist\n  standing\n  wins\n  losses\n  draws\n}\n"
  }
};
})();

(node as any).hash = "90bcff625daff5f95e5a2165f0f25266";

export default node;
