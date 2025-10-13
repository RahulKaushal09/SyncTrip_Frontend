import { TripPreferences } from "@/constants";
import { FC } from "react";

type step3PreferencesProps = {
  selectedPreferences: string[];
  setPreferences: React.Dispatch<React.SetStateAction<string[]>>;
};

const Step3Preferences: FC<step3PreferencesProps> = ({ selectedPreferences, setPreferences }) => (
  <div>
    <h2 className="DescriptionHeading">
      <strong>Trip preferences</strong>
    </h2>
    <p style={{ color: "rgb(102, 102, 102)", marginBottom: "16px" }}>
      Select your travel preferences to customize your trip plan.
    </p>

    {/* changed grid to flex-wrap layout */}
    <div className="chipsBox mb-6">
      {TripPreferences.map((k) => (
        <button
          key={k}
          onClick={() =>
            setPreferences((p) =>
              p.includes(k) ? p.filter((pref) => pref !== k) : [...p, k]
            )
          }
          className={`chip ${selectedPreferences.includes(k) ? "selected" : ""}`}
        >
          {k}
        </button>
      ))}
    </div>
  </div>
);

export default Step3Preferences;
