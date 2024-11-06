import React, { useState } from "react";
import { Effect, Exit } from "effect";
import { parseMnemonic, useEvolu } from "@evolu/react";

const MnemonicForm: React.FC = () => {
  const { getOwner, restoreOwner } = useEvolu();
  const owner = getOwner();
  const [mnemonic, setMnemonic] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);

  const handleRestore = () => {
    parseMnemonic(mnemonic)
      .pipe(Effect.runPromiseExit)
      .then(
        Exit.match({
          onFailure: (error) => {
            alert(JSON.stringify(error, null, 2));
          },
          onSuccess: (mnemonic) => {
            restoreOwner(mnemonic);
            setMnemonic("");
          },
        })
      );
  };

  const copyToClipboard = () => {
    if (owner?.mnemonic) {
      navigator.clipboard.writeText(owner.mnemonic).then(
        () => {
          alert("Mnemonic copied to clipboard!");
        },
        (err) => {
          alert("Failed to copy mnemonic: " + err);
        }
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Mnemonic Management</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Current Mnemonic:</h3>
        <div className="flex items-center">
          <span className="mr-2">
            {showMnemonic ? owner?.mnemonic : "••••••••••••••••"}
          </span>
          <button
            onClick={() => setShowMnemonic(!showMnemonic)}
            className="text-blue-500 hover:text-blue-700 mr-2"
          >
            {showMnemonic ? "Hide" : "Show"}
          </button>
          <button
            onClick={copyToClipboard}
            className="text-blue-500 hover:text-blue-700"
          >
            Copy
          </button>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Restore Mnemonic:</h3>
        <input
          type="text"
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
          placeholder="Enter mnemonic"
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={handleRestore}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={!mnemonic}
        >
          Restore
        </button>
      </div>
    </div>
  );
};

export default MnemonicForm;
