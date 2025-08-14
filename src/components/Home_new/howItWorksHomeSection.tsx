import { UserPlus, Search, MessageCircle, MapPin } from "lucide-react";
import "../../../styles/home/howitworks-home.css"; // Import your custom CSS

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Tell us about your travel style, interests, and preferences to help us find your perfect match.",
    step: "01",
  },
  {
    icon: Search,
    title: "Discover Trips & Travelers",
    description:
      "Browse existing trips or create your own. Our smart algorithm shows you compatible travel companions.",
    step: "02",
  },
  {
    icon: MessageCircle,
    title: "Connect & Chat",
    description:
      "Start conversations with potential travel companions and get to know each other before committing.",
    step: "03",
  },
  {
    icon: MapPin,
    title: "Plan & Travel Together",
    description:
      "Collaborate on your itinerary, book accommodations, and embark on your amazing adventure together.",
    step: "04",
  },
];

export function HowItWorksSectionHome() {
  return (
    <section id="how-it-works" className="howitworks-home-section container-custom">
        
        {/* Heading */}
        <div className="howitworks-home-heading">
          <h2>How It Works</h2>
          <p>
            Getting started is simple. Follow these four easy steps to find
            your travel companion and start planning your next adventure.
          </p>
        </div>

        {/* Steps */}
        <div className="howitworks-home-grid">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="howitworks-home-step">
                
                {/* Card */}
                <div className="howitworks-home-card">
                  <div className="howitworks-home-card-content">
                    
                    {/* Step Number */}
                    {/* <div className="howitworks-home-stepnum">{step.step}</div> */}
                    
                    {/* Icon */}
                    <div className="howitworks-home-icon">
                      <IconComponent />
                    </div>
                    
                    {/* Text */}
                    <div className="howitworks-home-text">
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <div className="howitworks-home-arrow">
                    <div className="howitworks-home-arrow-line"></div>
                    <div className="howitworks-home-arrow-tip"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
    </section>
  );
}
