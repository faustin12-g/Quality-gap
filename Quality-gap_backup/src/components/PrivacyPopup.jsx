import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';



const PrivacyPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if consent cookie exists
    const consent = Cookies.get('privacyConsent');
    if (!consent) {
      const timer = setTimeout(() => setShowPopup(true), 5000); // Show popup after 5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setShowPopup(false);
    // Save consent in cookies
    Cookies.set('privacyConsent', 'accepted', { expires: 365, sameSite: 'Lax' });

    // Set default preferences for the user (e.g., dark mode off initially)
    Cookies.set('userPreferences', JSON.stringify({ darkMode: false }), {
      expires: 365,
      sameSite: 'Lax',
    });
  };

  const handleDecline = () => {
    setShowPopup(false);
    // Save declined consent in cookies
    Cookies.set('privacyConsent', 'declined', { expires: 365, sameSite: 'Lax' });
  };

  if (!showPopup) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50">
      <p className="text-sm">
        We use cookies to personalize your experience. Read our{' '}
        <a
          href="/PrivacyPolicy.html"
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
        .
      </p>
      <div className="flex justify-end mt-2">
        <button
          onClick={handleDecline}
          className="mr-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg"
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default PrivacyPopup;
