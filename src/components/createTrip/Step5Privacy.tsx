import {  TripPrivacyOptions } from "@/constants";
import { FC } from "react";
import SelectableButtonWithIconAndSub from "../Cards/SelectableButtonWithIconAndSub";

type step5PrivacyProps = {
  selectedPrivacy: string;
  setSelectedPrivacy: React.Dispatch<React.SetStateAction<string>>;
};

const Step5Privacy: FC<step5PrivacyProps> = ({ selectedPrivacy, setSelectedPrivacy }) => (
  <div>
    <h2 className="DescriptionHeading">
      <strong>Choose privacy</strong>
    </h2>
    <p style={{ color: "rgb(102, 102, 102)", marginBottom: "16px" }}>
                  Make your trip private for just you and your group, or public to connect with fellow travelers.

    </p>

    {/* changed grid to flex-wrap layout */}
    <div className={`grid grid-cols-1`}>
            {TripPrivacyOptions.map((privacy) => (
              <SelectableButtonWithIconAndSub
                icon={privacy.icon}
                key={privacy.label}
                label={privacy.label}
                description={privacy.description}
                isSelected={selectedPrivacy === privacy.label} // Check if the option is selected
                onClick={() => setSelectedPrivacy(privacy.label)} // Update selected budget
              />
            ))}
          </div>
  </div>
);

export default Step5Privacy;
