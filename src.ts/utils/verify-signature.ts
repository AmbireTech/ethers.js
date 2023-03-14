import { Contract } from "../contract/index.js";
import { TypedDataEncoder, hashMessage, TypedDataDomain, TypedDataField } from "../hash/index.js";
import { recoverAddress } from "../transaction/index.js";
import { JsonRpcProvider } from "../providers/provider-jsonrpc.js";

import type { SignatureLike } from "../crypto/index.js";
import type { BytesLike } from "./index.js";

export async function verifyUniversalMessage (signerAddress: string, message: BytesLike, signature: SignatureLike, provider: JsonRpcProvider) {
    const finalDigest = hashMessage(message);
    return verifyFinalDigest(signerAddress, finalDigest, signature, provider);
}

export async function verifyTypedData (signer: string, domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, typedDataMessage: Record<string, any>, signature: SignatureLike, provider: JsonRpcProvider): Promise<boolean> {
    const finalDigest = TypedDataEncoder.hash(domain, types, typedDataMessage);
    return verifyFinalDigest(signer, finalDigest, signature, provider);
}

export async function verifyFinalDigest (signerAddress: string, finalDigest: BytesLike, signature: SignatureLike, provider: JsonRpcProvider): Promise<boolean> {
    // First try: Getting code from deployed smart contract to call 1271 isValidSignature
    if (await _verifyTypedDataFinalDigest(signerAddress, finalDigest, signature, provider)) { return true; }

    // 2nd try: elliptic curve signature (EOA)
    try {
        const recoveredAddr = recoverAddress(finalDigest, signature);
        if (recoveredAddr && (recoveredAddr.toLowerCase() === signerAddress.toLowerCase())) { return true; }
    } catch(e){}

    return false;
}

export async function _verifyTypedDataFinalDigest (signer: string, finalDigest: BytesLike, signature: SignatureLike, provider: JsonRpcProvider): Promise<boolean> {
    const code = await provider.getCode(signer);
    if (code && code !== '0x') {
        const contract = new Contract(signer, ["function isValidSignature(bytes32 hash, bytes signature) view returns (bytes4)"], provider);
        return (await contract.isValidSignature(finalDigest, signature)) === "0x1626ba7e";
    }
    return false;
}