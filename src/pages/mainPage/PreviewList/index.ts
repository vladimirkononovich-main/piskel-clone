import CryptoJS from "crypto-js";
import { Matrix } from "../DrawingCanvas/models";

// export const createHashSHA256 = (matrix: Matrix) => {
//   let resultHash = "";

//   for (const key in matrix) {
//     const uint8 = matrix[key as keyof typeof matrix];
//     const wordArray = CryptoJS.lib.WordArray.create(uint8);
//     const hash = CryptoJS.SHA256(wordArray);
//     resultHash += hash.toString(CryptoJS.enc.Hex);
//   }

//   return resultHash;
// };
