/**
 * @generated SignedSource<<843520215d516e291e3d4a76744f172f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_EntryTableData$data = ReadonlyArray<{
  readonly decklist: string | null | undefined;
  readonly draws: number;
  readonly id: string;
  readonly losses: number;
  readonly player: {
    readonly name: string;
  } | null | undefined;
  readonly standing: number;
  readonly tournament: {
    readonly name: string;
  };
  readonly wins: number;
  readonly " $fragmentType": "Commander_EntryTableData";
}>;
export type Commander_EntryTableData$key = ReadonlyArray<{
  readonly " $data"?: Commander_EntryTableData$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_EntryTableData">;
}>;

const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "Commander_EntryTableData",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Player",
      "kind": "LinkedField",
      "name": "player",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Tournament",
      "kind": "LinkedField",
      "name": "tournament",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
  "type": "Entry",
  "abstractKey": null
};
})();

(node as any).hash = "f7e540277287e401b2c28880a3a01af7";

export default node;
