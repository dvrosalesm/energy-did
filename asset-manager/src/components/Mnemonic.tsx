import { Button, Input } from "@material-tailwind/react";
import { useRef } from "react";

interface MnemonicProps {
  onUpdate: (mnemonic: { seed: string }) => void;
}

function Mnemonic({ onUpdate }: MnemonicProps) {
  const mnemonicRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full bg-blue-gray-100 p-5 shadow rounded-md">
      <div className="flex flex-row">
        <Input
          label="Enter your mnemonic"
          variant="outlined"
          inputRef={mnemonicRef}
        ></Input>
        <Button
          className="ml-2"
          color="blue-gray"
          onClick={() => {
            if (mnemonicRef.current) {
              onUpdate({
                seed: mnemonicRef.current.value,
              });
            }
          }}
        >
          Search
        </Button>
      </div>
    </div>
  );
}

export default Mnemonic;
