import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Input,
  Select,
  Typography,
} from "@material-tailwind/react";
import SelectOption from "@material-tailwind/react/components/Select/SelectOption";
import { useEffect, useRef, useState } from "react";
import { KILTService } from "../services/KILTService";
import { ICredential } from "@kiltprotocol/sdk-js";

interface CredentialAttestationProps {
  mnemonic: { seed: string };
}

function CredentialAttestation({ mnemonic }: CredentialAttestationProps) {
  const [type, setType] = useState<string>("");
  const [pvType, setPVType] = useState<string>("");
  const [isLoding, setIsLoading] = useState<boolean>(false);
  const [success, setSucess] = useState<boolean>(false);
  const [attestations, setAttestations] = useState<
    {
      status: string;
      credential: object;
      attester: string;
      id: string;
      challenges: object[];
    }[]
  >([]);

  const countryPV = useRef<HTMLInputElement>(null);
  const capacityPV = useRef<HTMLInputElement>(null);
  const countryWP = useRef<HTMLInputElement>(null);
  const capacityWP = useRef<HTMLInputElement>(null);
  const assetDidPV = useRef<HTMLInputElement>(null);
  const assetDidWP = useRef<HTMLInputElement>(null);

  const onSubmitRequest = () => {
    if (isLoding || type === "") return;

    setIsLoading(true);
    setSucess(false);

    let claimContent = null;

    if (type === "PV") {
      claimContent = {
        assetDID: assetDidPV.current!.value,
        country: countryPV.current!.value,
        nameplateCapacity: parseInt(capacityPV.current!.value),
        technology: "Solar",
        type: pvType,
      };
    } else {
      claimContent = {
        assetDID: assetDidPV.current!.value,
        country: countryWP.current!.value,
        nameplateCapacity: parseInt(capacityWP.current!.value),
        technology: "Wind",
      };
    }

    KILTService.generateClaim(
      mnemonic.seed,
      claimContent,
      type === "PV" ? "PV" : "WG"
    ).then((claim) => {
      fetch("http://127.0.0.1:3434/requestAttestation", {
        method: "POST",
        body: JSON.stringify({
          credential: claim.credential,
          claimer: claim.claimer,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          setSucess(true);
          refreshAttestations();
          if (countryPV.current) countryPV.current.value = "";
          if (capacityPV.current) capacityPV.current.value = "";
          if (countryWP.current) countryWP.current.value = "";
          if (capacityWP.current) capacityWP.current.value = "";
          if (assetDidPV.current) assetDidPV.current.value = "";
          if (assetDidWP.current) assetDidWP.current.value = "";
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  };

  const refreshAttestations = () => {
    KILTService.getAccountInfo(mnemonic.seed).then((accountInfo) => {
      fetch(
        "http://127.0.0.1:3434/getAttestations/" + accountInfo.account?.didUri,
        {
          method: "GET",
        }
      )
        .then((x) => x.json())
        .then((attestations) => {
          setAttestations(attestations);
        });
    });
  };

  const onVerify = (id: string, credential: object, challenge: string) => {
    KILTService.generatePresentation(
      mnemonic.seed,
      credential as ICredential,
      challenge
    ).then((presentation) => {
      fetch("http://127.0.0.1:3434/submitVerification", {
        method: "POST",
        body: JSON.stringify({
          id,
          presentation,
          challenge,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(console.log);
    });
  };

  useEffect(() => {
    refreshAttestations();
  }, [mnemonic]);

  if (mnemonic.seed === "") return null;

  return (
    <div className="flex flex-row w-full">
      <div className="flex w-1/3">
        <Card className="w-full">
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Request Attestation
            </Typography>
            <div>
              <Select
                label="Attestation type"
                onChange={(selection: string) => {
                  setType(selection);
                }}
              >
                <SelectOption value="PV">PV</SelectOption>
                <SelectOption value="WP">Wind Power Generator</SelectOption>
              </Select>
              {type === "PV" && (
                <>
                  <div className="mt-2">
                    <Input label="AssetDID" inputRef={assetDidPV} />
                  </div>
                  <div className="mt-2">
                    <Input label="Country of location" inputRef={countryPV} />
                  </div>
                  <div className="mt-2">
                    <Input
                      label="Nameplate capacity in KW"
                      inputRef={capacityPV}
                    />
                  </div>
                  <div className="mt-2">
                    <Input label="Technology" value="Solar" disabled />
                  </div>
                  <div className="mt-2">
                    <Select
                      label="Type"
                      onChange={(selection: string) => {
                        setPVType(selection);
                      }}
                    >
                      <SelectOption value="Rooftop">Rooftop</SelectOption>
                      <SelectOption value="Open space">Open space</SelectOption>
                    </Select>
                  </div>
                </>
              )}
              {type === "WP" && (
                <>
                  <div className="mt-2">
                    <Input label="AssetDID" inputRef={assetDidWP} />
                  </div>
                  <div className="mt-2">
                    <Input label="Country of location" inputRef={countryWP} />
                  </div>
                  <div className="mt-2">
                    <Input
                      label="Nameplate capacity in KW"
                      inputRef={capacityWP}
                    />
                  </div>
                  <div className="mt-2">
                    <Input label="Technology" value="Wind" disabled />
                  </div>
                </>
              )}
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button onClick={onSubmitRequest}>
              {isLoding ? "Loading..." : "Request"}
            </Button>
            {success && (
              <p className="mt-5">Correctly created attestation request</p>
            )}
          </CardFooter>
        </Card>
      </div>
      <div className="flex w-2/3">
        <div className="flex flex-col w-full pl-5">
          <h3 className="text-left">Attestation history</h3>
          {attestations.map((attestation) => (
            <>
              <div className="flex flex-row w-full p-2 border">
                <div className="flex w-1/4 break-all text-xs">
                  - {attestation.id.substring(0, 5)} ...{" "}
                  {attestation.id.substring(60)}
                </div>
                <div className="flex w-2/4 break-all text-xs">
                  ({attestation.credential.claim.contents.country} +{" KW"}
                  {attestation.credential.claim.contents.nameplateCapacity} KW)
                </div>
                <div className="flex w-1/4">
                  <p className="w-full text-xs">{attestation.status}</p>
                </div>
              </div>
              {attestation.challenges && attestation.challenges.length > 0 && (
                <div className="w-full">
                  {attestation.challenges
                    .filter((x) => x !== null)
                    .map((challenge) => (
                      <div className="flex w-full flex-row bg-blue-gray-100 p-2">
                        {" "}
                        <div className="flex w-3/4 break-all text-xs">
                          - Verification request from: {challenge.verifier}
                        </div>
                        <div className="flex w-1/4 break-all text-xs align-center justify-center ">
                          {!challenge.verified && (
                            <Button
                              size="sm"
                              className="p-1 text-xs capitalize"
                              onClick={() => {
                                onVerify(
                                  attestation.id,
                                  attestation.credential,
                                  challenge.challenge
                                );
                              }}
                            >
                              Verify
                            </Button>
                          )}
                          {challenge.verified && <p>VERIFIED</p>}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CredentialAttestation;
