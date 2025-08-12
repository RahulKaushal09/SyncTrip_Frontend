"use client"
import { CheckCircle, ArrowRight, Users, MapPin, Calendar, Heart, MessageCircle, Search, Smartphone, Bot } from 'lucide-react';
import synctripMobileImage from "../../assets/images/syncTripMobile_old.png"; // Adjust the path as necessary
import preregisterImage from '../../assets/images/preRegisterPopupImg.png'; // Adjust the path as necessary
import { triggerLogin } from '@/utils';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import "../../../styles/miscellanous.css"
const HowItWorks = () => {
    const router = useRouter();
    const redirectUrl = (url: string) => {
        router.push(url);
    };
  const steps = [
    {
      number: "01",
      icon: Users,
      title: "Join Pre-Organized Group Trips",
      description: "Browse through exciting group trips organized by fellow travelers. Find adventures that match your interests, budget, and schedule.",
      features: ["Verified trip organizers", "Detailed itineraries", "Group size limits", "Safety protocols"]
    },
    {
      number: "02",
      icon: MapPin,
      title: "Create Your Own Trip",
      description: "Plan your dream trip with our intuitive tools. Set dates, choose destinations, and invite others to join your adventure.",
      features: ["Easy trip creation", "Flexible planning", "Invite system", "Cost sharing tools"]
    },
    {
      number: "03",
      icon: Calendar,
      title: "Build Your Itinerary",
      description: "Add places, hotels, and activities with our drag-and-drop interface. Create the perfect travel schedule that works for everyone.",
      features: ["Drag-and-drop planning", "Hotel integration", "Activity suggestions", "Time optimization"]
    },
    {
      number: "04",
      icon: Heart,
      title: "Match & Connect",
      description: "Our smart matching system connects you with travelers going to the same destinations. Swipe and chat like a social travel app.",
      features: ["Smart matching algorithm", "Interest-based connections", "Safety verification", "Chat integration"]
    },
    {
      number: "05",
      icon: MessageCircle,
      title: "Chat & Coordinate",
      description: "Connect with your travel companions through our built-in messaging system. Plan together and build friendships before you travel.",
      features: ["Group chat rooms", "Private messaging", "File sharing", "Real-time updates"]
    },
    {
      number: "06",
      icon: Search,
      title: "Discover Events & Activities",
      description: "Explore local events, hotels, and activities in your destination. Get insider tips and recommendations from the community.",
      features: ["Local event discovery", "Hotel recommendations", "Activity booking", "Community reviews"]
    }
  ]

  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First Experience",
      description: "Access all features on-the-go with our responsive mobile app. Plan, connect, and travel from anywhere."
    },
    {
      icon: Bot,
      title: "AI-Powered Planning",
      description: "Our upcoming AI assistant will help you plan trips, suggest destinations, and optimize your travel experience."
    },
    {
      icon: CheckCircle,
      title: "One-Stop Platform",
      description: "Everything you need for social travel in one place - from planning to booking to connecting with fellow travelers."
    }
  ]

  const benefits = [
    "Save money through group bookings and cost sharing",
    "Meet like-minded travelers and build lasting friendships",
    "Discover hidden gems through community recommendations",
    "Travel safely with verified companions and organizers",
    "Access exclusive group deals and discounts",
    "Get 24/7 support throughout your journey"
  ]

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  }

  const buttonStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'var(--primary-1)',
    color: 'white'
  }

  const outlineButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: 'var(--secondary-1)',
    border: '2px solid var(--secondary-1)'
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        padding: '80px 16px',
        // background: 'linear-gradient(135deg, var(--primary-5) 0%, #e6f3f9 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '24px',
              lineHeight: '1.1'
            }}>
              How <span style={{ color: 'var(--primary-1)' }}>SyncTrip</span> Works
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '800px',
              margin: '0 auto 32px',
              lineHeight: '1.6'
            }}>
              Discover how easy it is to plan, connect, and travel with SyncTrip.
              Follow our simple step-by-step process to transform your travel experience.
            </p>
            <button className='btn btn-black' onClick={() => triggerLogin(() => redirectUrl(ROUTES.EXPLORE))}>
              Start Your Journey
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{
                width: '100%',
                height: '400px',
                // backgroundColor: '#e5e7eb',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#6b7280',
                // boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundImage: `url(${synctripMobileImage.src})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'

              }}>
                {/* Travel App Interface */}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 'bold', color: '#111827' }}>
                Your Social Travel Journey Starts Here
              </h2>
              <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.6' }}>
                SyncTrip makes it incredibly simple to find travel companions, plan amazing trips,
                and create unforgettable memories. Whether you're joining existing trips or creating
                your own adventures, we've got you covered.
              </p>
              {/* <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', marginLeft: '-8px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'var(--primary-1)',
                    borderRadius: '50%',
                    border: '2px solid white',
                    marginLeft: '-8px'
                  }}></div>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#4db8c1',
                    borderRadius: '50%',
                    border: '2px solid white',
                    marginLeft: '-8px'
                  }}></div>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#80d6dd',
                    borderRadius: '50%',
                    border: '2px solid white',
                    marginLeft: '-8px'
                  }}></div>
                </div>
                <span style={{ color: '#6b7280' }}>Join 10,000+ happy travelers</span>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '24px'
            }}>
              6 Simple Steps to Social Travel
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              From discovering trips to making lifelong friends, here's how SyncTrip transforms
              your travel experience step by step.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '48px',
                alignItems: 'center',
                flexDirection: index % 2 === 1 ? 'row-reverse' : 'row'
              }}
              className="step-row">
                <div style={{ order: index % 2 === 1 ? 2 : 1 }} 
                className="step-text">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      backgroundColor: 'var(--secondary-1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '16px'
                    }}>
                      <Icon size={32} color="white" />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#000' }}>
                      {step.number}
                    </div>
                  </div>
                  <h3 style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '16px'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: '18px',
                    color: '#6b7280',
                    marginBottom: '24px',
                    lineHeight: '1.6'
                  }}>
                    {step.description}
                  </p>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle size={20} color="#10b981" style={{ marginRight: '12px', flexShrink: 0 }} />
                        <span style={{ color: '#374151' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ order: index % 2 === 1 ? 1 : 2 }}
                className="step-box">
                  <div style={{
                    ...cardStyle,
                    background: 'linear-gradient(135deg, var(--primary-5) 0%, var(--primary-5) 100%)',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '96px',
                      height: '96px',
                      backgroundColor: 'var(--secondary-1)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {step.number}
                    </div>
                    <h4 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#000',
                      marginBottom: '16px'
                    }}>
                      {step.title}
                    </h4>
                    <p style={{ color: '#000', lineHeight: '1.6' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 16px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '24px'
            }}>
              Upcoming Features
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              We're constantly innovating to make your travel experience even better.
              Here's what's coming next to SyncTrip.
            </p>
          </div>

          <div  style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px'
          }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
              <div key={index} style={{ ...cardStyle, textAlign: 'center' }}>
                <Icon size={48} color="var(--primary-1)" style={{ margin:"0 auto", marginBottom: "24px" }} />
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#111827'
                }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{feature.description}</p>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            alignItems: 'center'
          }}>
            <div>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '24px'
              }}>
                Why Travelers Love SyncTrip
              </h2>
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                Join thousands of travelers who have discovered the benefits of social travel.
                From cost savings to lifelong friendships, SyncTrip offers more than just trip planning.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {benefits.map((benefit, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <CheckCircle size={24} color="#10b981" style={{ marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: '#374151', lineHeight: '1.5' }}>{benefit}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                <button style={primaryButtonStyle} onClick={() => triggerLogin(() => redirectUrl(ROUTES.EXPLORE))}>
                  Get Started Now
                </button>
                <button style={outlineButtonStyle} onClick={() => redirectUrl(ROUTES.TRIPS)}>
                  Explore trips
                </button>
              </div>
            </div>
            <div>
              <div style={{
                width: '100%',
                height: '400px',
                // backgroundColor: '#e5e7eb',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#6b7280',
                // boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundImage: `url(${preregisterImage.src})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}>
                {/* App Features Image */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow Section */}
      <section style={{ padding: '80px 16px', background: 'linear-gradient(135deg, var(--primary-5) 0%, var(--primary-5) 100%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              color: 'black',
              marginBottom: '24px'
            }}>
              Your Journey in Numbers
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#000',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              See how quickly you can go from idea to adventure with SyncTrip's streamlined process.
            </p>
          </div>

          <div className='timeToCreate-grid-box' style={{
           
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--secondary-1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>2</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Minutes</h3>
              <p style={{ color: '#000' }}>To create your profile and start browsing trips</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--secondary-1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>5</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Minutes</h3>
              <p style={{ color: '#000' }}>To plan a complete itinerary with our tools</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--secondary-1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>24</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Hours</h3>
              <p style={{ color: '#000' }}>Average time to find travel companions</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                backgroundColor: 'var(--secondary-1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>∞</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000', marginBottom: '8px' }}>Memories</h3>
              <p style={{ color: '#000' }}>Created through social travel experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 16px',
        background: 'linear-gradient(135deg, var(--primary-5) 0%, var(--primary-5) 100%)',
        marginBottom: "0px"
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 'bold',
            color: 'black',
            marginBottom: '24px'
          }}>
            Ready to Experience Social Travel?
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#000',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Join SyncTrip today and discover how easy it is to plan amazing trips,
            meet incredible people, and create unforgettable memories.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              <button style={{
                ...buttonStyle,
                backgroundColor: 'var(--primary-1)',
                color: 'white',
                padding: '16px 32px'
              }} onClick={() =>redirectUrl(ROUTES.EXPLORE)}>
                Start Planning Your Trip
                <ArrowRight size={20} />
              </button>
              <button style={{
                ...buttonStyle,
                backgroundColor: 'transparent',
                color: 'var(--secondary-1)',
                border: '2px solid var(--secondary-1)',
                padding: '16px 32px'
              }} onClick={() => triggerLogin(() => redirectUrl(ROUTES.EXPLORE))}>
                Download Mobile App
              </button>
            </div>
          </div>
          <p style={{ color: '#000' }}>
            Free to join • No hidden fees • 24/7 support
          </p>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks