import { TripBudgets } from "@/constants";
import { FC } from "react";
import SelectableButtonWithIconAndSub from "../Cards/SelectableButtonWithIconAndSub";

type Step4BudgetProps = {
  selectedBudget: string;
  setSelectedBudget: React.Dispatch<React.SetStateAction<string>>;
};




const Step4Budget: FC<Step4BudgetProps> = ({ selectedBudget, setSelectedBudget }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  return (
    <div className="">
      <h2 className="DescriptionHeading">
        <strong>Set your trip budget</strong>
      </h2>
      <p style={{ color: "rgb(102, 102, 102)", marginBottom: "16px" }}>
        Let us know your budget preference, and we'll craft an itinerary that suits your financial comfort.

      </p>

      <div className={`grid  ${isMobile ? 'grid-cols-1' : 'grid-cols-2 gap-4'}`}>
        {TripBudgets.map((budget) => (
          <SelectableButtonWithIconAndSub
            icon={budget.icon}
            key={budget.label}
            label={budget.label}
            description={budget.description}
            isSelected={selectedBudget === budget.label} // Check if the option is selected
            onClick={() => setSelectedBudget(budget.label)} // Update selected budget
          />
        ))}
      </div>
    </div>
  );
};

export default Step4Budget;
