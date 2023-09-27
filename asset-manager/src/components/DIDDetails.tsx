import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { KILTService } from "../services/KILTService";
import { AccountInfo } from "../services/dto/accountInfo";

interface DIDDetailsProps {
  mnemonic: { seed: string };
}

function DIDDetails({ mnemonic }: DIDDetailsProps) {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (mnemonic.seed !== "") {
      setIsLoading(true);
      KILTService.getAccountInfo(mnemonic.seed).then((x) => {
        setAccountInfo(x);
        setIsLoading(false);
      });
    }
  }, [mnemonic]);

  const createFullDID = () => {
    setIsLoading(true);
    KILTService.createFullDID(mnemonic.seed).then((x) => {
      setAccountInfo(x);
      setIsLoading(false);
    });
  };

  if (mnemonic.seed === "") {
    return null;
  }

  if (accountInfo?.error) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row">
          There was an error loading the account, incorrect mnemonic
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex">
          <h3>Account information</h3>
        </div>
        <div className="flex flex-row w-full">
          <table className="w-full border">
            <tbody>
              <tr className="border">
                <th className="text-xs p-1 align-top  bg-blue-gray-100">
                  Address
                </th>
                <td className="text-xs p-1 break-all text-left">
                  {accountInfo?.account?.address}
                </td>
              </tr>
              <tr className="border">
                <th className="text-xs p-1 align-top bg-blue-gray-100">
                  DID URI
                </th>
                <td className="text-xs break-all text-left p-1">
                  {accountInfo?.account?.didUri}
                </td>
              </tr>
              <tr className="border">
                <th className="text-xs p-1 align-top bg-blue-gray-100">
                  Balance
                </th>
                <td className="text-xs break-all text-left p-1">
                  {accountInfo?.account?.balance} PILT
                </td>
              </tr>
              <tr className="border">
                <th className="text-xs p-1 align-top bg-blue-gray-100">
                  Has full DID
                </th>
                <td className="text-xs break-all text-left p-1">
                  {accountInfo?.account?.hasDocument ? "Yes" : "No"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {!accountInfo?.account?.hasDocument && (
          <div className="flex mt-2 w-full">
            <div className="w-full mt-2">
              <p className="text-xs text-center">
                The given account does not posses a Full DID anchored to the
                KILT blockchain, do you wish to create and publish it?
              </p>
              {accountInfo?.account?.balance !== "0" && (
                <p>
                  {" "}
                  <Button
                    size="sm"
                    className="ml-2 mt-2"
                    onClick={createFullDID}
                  >
                    Create Full DID
                  </Button>
                </p>
              )}
              {accountInfo?.account?.balance === "0" && (
                <p>
                  Looks like you don't have enough balance to create a full DID,
                  get some PILT from the{" "}
                  <a
                    href="https://faucet.peregrine.kilt.io/"
                    target="_blank"
                    className="text-blue-500"
                  >
                    Peregrine Faucet
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default DIDDetails;
