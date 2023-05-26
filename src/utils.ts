import { EXTENSION_NAME } from "./constants";

export function getConfigName(name: string) {
  return `${EXTENSION_NAME}.${name}`;
}
