//Fix for web3 issue with create-react-app >v5

import { Buffer } from "buffer";

window.global = window;
global.Buffer = Buffer;
global.process = {
  env: { DEBUG: undefined },
  version: "",
  nextTick: require("next-tick"),
};
