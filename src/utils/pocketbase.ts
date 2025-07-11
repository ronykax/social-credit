import PocketBase from "pocketbase";
import getEnv from "./get-env";

const pb = new PocketBase(getEnv("POCKETBASE_URL"));
export default pb;
