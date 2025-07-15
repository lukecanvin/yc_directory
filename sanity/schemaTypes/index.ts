import { type SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { startup } from "./startup";
import { playlist } from "./playlist";
import { vote } from "./vote";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author, startup, playlist, vote],
};
