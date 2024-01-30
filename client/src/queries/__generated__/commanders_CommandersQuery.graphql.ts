/**
 * @generated SignedSource<<dd966cfff4814b0201edf5482d29fe16>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommandersQuery$variables = Record<PropertyKey, never>;
export type commanders_CommandersQuery$data = {
  readonly commanders: ReadonlyArray<{
    readonly " $fragmentSpreads": FragmentRefs<"commanders_CommandersTableData">;
  }>;
};
export type commanders_CommandersQuery = {
  response: commanders_CommandersQuery$data;
  variables: commanders_CommandersQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "commanders_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "CommanderType",
        "kind": "LinkedField",
        "name": "commanders",
        "plural": true,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "commanders_CommandersTableData"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "commanders_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "CommanderType",
        "kind": "LinkedField",
        "name": "commanders",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "colorID",
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
            "name": "winsSwiss",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "winsBracket",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "draws",
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
            "name": "lossesSwiss",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "lossesBracket",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "count",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "winRate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "winRateSwiss",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "winRateBracket",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "topCuts",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "conversionRate",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "476fe80bb06fa974568ac452725d9615",
    "id": null,
    "metadata": {},
    "name": "commanders_CommandersQuery",
    "operationKind": "query",
    "text": "query commanders_CommandersQuery {\n  commanders {\n    ...commanders_CommandersTableData\n  }\n}\n\nfragment commanders_CommanderTableRow on CommanderType {\n  name\n  colorID\n  wins\n  winsSwiss\n  winsBracket\n  draws\n  losses\n  lossesSwiss\n  lossesBracket\n  count\n  winRate\n  winRateSwiss\n  winRateBracket\n  topCuts\n  conversionRate\n}\n\nfragment commanders_CommandersTableData on CommanderType {\n  name\n  ...commanders_CommanderTableRow\n}\n"
  }
};

(node as any).hash = "d8e3ca0b585246776158522be9fa821e";

export default node;
