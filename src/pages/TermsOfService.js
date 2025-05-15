import React from 'react';
import './TermsOfService.css';
import NavBar from '../components/NavBar';

const TermsOfService = () => {
  return (
    <>
    <NavBar />
    <div className="privacy-container">
      <h1>Terms of Service</h1>
      <p>Last updated: [Insert Date]</p>

      <p>
        Welcome to QuillTime! By accessing or using our application, you agree to be bound by these Terms of Service.
        If you do not agree to all of the terms, then you may not access the application.
      </p>

      <h2>1. Use of Service</h2>
      <p>
        QuillTime provides tools to help users focus and write productively. You agree to use the service only for lawful purposes.
      </p>

      <h2>2. User Content</h2>
      <p>
        You retain ownership of the content you create. However, by using the service, you grant us permission to access
        your Google Docs content to enable app features such as editing and word count tracking.
      </p>

      <h2>3. Data & Privacy</h2>
      <p>
        Please refer to our <a href="/privacy">Privacy Policy</a> for information on how we collect, use, and protect your data.
      </p>

      <h2>4. Termination</h2>
      <p>
        We reserve the right to suspend or terminate access to the service at our discretion, especially if you violate these terms.
      </p>

      <h2>5. Changes to Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the service means you accept the updated terms.
      </p>

      <p>If you have any questions, contact us at <a href="mailto:authormichaelreynolds@gmail.com">authormichaelreynolds@gmail.com</a>.</p>
    </div>
    </> 
  );
};

export default TermsOfService;
