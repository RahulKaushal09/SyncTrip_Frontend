import React from 'react';

const DeleteAccount: React.FC = () => {
  return (
    <div className="paddingTopAndSide !pb-10 m-animate m-fade-in">
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Header Section */}
        <h1 className="h2 text-secondary-1" style={{ marginBottom: '16px' }}>
          We're sorry to see you go.
        </h1>
        <p className="r2 text-neutral-1" style={{ marginBottom: '20px', lineHeight: '1.6' }}>
          We would love to keep you around, but if you are ready to say goodbye, you can securely <strong>delete your account</strong> directly through the SyncTrip Mobile App.
        </p>

        {/* Instructions Card */}
        <div 
          className="bg-secondary-5 m-animate m-slide-up" 
          style={{ 
            padding: '40px', 
            borderRadius: '16px', 
            textAlign: 'left',
            border: '1px solid var(--secondary-3)',
          }}
        >
          <h2 className="h4 text-secondary-1" style={{ marginBottom: '24px' }}>
            How to delete your account?
          </h2>
          
          <ol style={{ paddingLeft: '24px', margin: 0, lineHeight: '1.8', listStyle: 'decimal' }} className="r2 text-black">
            <li style={{ marginBottom: '16px' }}>
              <strong>Download our App:</strong> If you haven't already, download the SyncTrip app on your mobile device and Log into the account that you want to delete.
            </li>
            <li style={{ marginBottom: '16px' }}>
              <strong>Go to Profile:</strong> Navigate to the <strong>Profile</strong> section from the main menu.
            </li>
            <li style={{ marginBottom: '16px' }}>
              <strong>Open your Passport:</strong> Tap on your <strong>Passport</strong> to view your account details.
            </li>
            <li style={{ marginBottom: '16px' }}>
              <strong>Scroll to More Actions:</strong> Scroll all the way down to find the <strong>More Actions</strong> section.
            </li>
            <li style={{ marginBottom: '16px' }}>
              <strong>Delete Account:</strong> Choose <span className="text-error-1" style={{ fontWeight: 700 }}>"Delete Account"</span> and follow the final on-screen confirmation prompts. Your data will be deleted according to our <a className='!underline' href="/policies/privacy-policies">privacy policies</a>.
            </li>
          </ol>
        </div>

        {/* Support Section */}
        <div className="m-animate m-slide-up" style={{ marginTop: '20px', animationDelay: '0.2s' }}>
          <p className="r2 text-neutral-1" style={{ marginBottom: '10px' }}>
            Having trouble or need assistance with your data?
          </p>
          <a href="mailto:synctripofficial@gmail.com" className="btn btn-secondary-border flexbtn" style={{ width: 'fit-content', margin: '0 auto' }}>
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
};

export default DeleteAccount;