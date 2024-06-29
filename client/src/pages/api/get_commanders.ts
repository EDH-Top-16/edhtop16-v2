import { getCommandersApi } from "../../lib/server/legacy_api";

export const config = {
    api: {
      responseLimit: false,
    },
  }

export default getCommandersApi;
