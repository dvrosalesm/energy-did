import { useState } from "react";
import "./App.css";
import Mnemonic from "./components/Mnemonic";
import DIDDetails from "./components/DIDDetails";
import CredentialAttestation from "./components/CredentialAttestation";

function App() {
  const [mnemonic, setMnemonic] = useState<{ seed: string }>({ seed: "" });
  return (
    <div className="w-full p-5 min-h-screen">
      <Mnemonic onUpdate={(mnemonic: { seed: "" }) => setMnemonic(mnemonic)} />
      <div className="flex flex-row flex-col">
        <div className="flex flex-col w-full mt-5">
          <DIDDetails mnemonic={mnemonic} />
        </div>
        <div className="flex flex-col w-full mt-5">
          <div className="flex flex-row w-full">
            <CredentialAttestation mnemonic={mnemonic} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
