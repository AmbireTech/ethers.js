
import { TypedDataDomain, TypedDataField } from "../hash/index.js";
import { JsonRpcProvider } from "../providers/provider-jsonrpc";

import type { SignatureLike } from "../crypto/index.js";
import type { BytesLike } from "./index.js";


export declare function verifyUniversalMessage(signerAddress: string, message: BytesLike, signature: SignatureLike, provider: JsonRpcProvider): Promise<boolean>;
export declare function verifyTypedData(signer: string, domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, typedDataMessage: Record<string, any>, signature: SignatureLike, provider: JsonRpcProvider): Promise<boolean>;
export declare function verifyFinalDigest(signerAddress: string, finalDigest: BytesLike, signature: SignatureLike, provider: JsonRpcProvider): Promise<boolean>;
export declare function _verifyTypedDataFinalDigest(signer: string, finalDigest: BytesLike, signature: SignatureLike, provider: JsonRpcProvider): Promise<boolean>;