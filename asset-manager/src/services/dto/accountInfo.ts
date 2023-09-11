import { DidDocument } from "@kiltprotocol/sdk-js";
import { BaseResponse } from "./baseResponse";

export interface AccountInfo extends BaseResponse {
  account: {
    address: string;
    didUri: string;
    hasDocument: boolean;
    document?: DidDocument;
    balance: string;
  } | null;
}
