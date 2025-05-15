import React from 'react';
import NavBar from '../components/NavBar';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <>
    <NavBar />
    <div className="privacy-container">
      <h1>Privacy Policy for QuillTime</h1>
      <p><strong>Effective Date:</strong> 05-15-2025</p>
      <p><strong>Last Updated:</strong> 05-15-2025</p>

      <h2>Overview</h2>
      <p>
        QuillTime is a focused writing application that helps users manage writing sessions by integrating a timer, word count tracking, and live document editing. To provide these features, QuillTime accesses user-selected Google Docs through secure Google APIs.
      </p>

      <h2>Data We Access</h2>
      <ul>
        <li>Your name, email address, and profile image</li>
        <li>Documents you explicitly select using the Google Picker</li>
        <li>File metadata (e.g., document title and ID)</li>
        <li>Document content for editing and autosaving</li>
      </ul>

      <h2>How We Use Your Data</h2>
      <p>
        QuillTime uses your data solely to provide core features, including loading, editing, and saving Google Docs, and displaying your name and profile image. We do not access other files or store, sell, or share your data.
      </p>

      <h2>How We Protect Your Data</h2>
      <ul>
        <li>Secure OAuth 2.0 authentication</li>
        <li>No password storage</li>
        <li>No document content stored on our servers</li>
        <li>Session-based access only</li>
      </ul>

      <h2>Third-Party Sharing</h2>
      <p>We do not share your data with any third parties or use it for advertising or analytics.</p>

      <h2>User Control</h2>
      <p>
        You can revoke access at any time by visiting{' '}
        <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
          Google Account Permissions
        </a>.
      </p>

      <h2>Contact</h2>
      <p>
        <strong>Michael Reynolds</strong><br />
        Email: <a href="mailto:authormichaelreynolds@gmail.com">authormichaelreynolds@gmail.com</a>
      </p>

      <h2>Hosting</h2>
      <p>This app is hosted at: https://quilltime.com</p>
    </div>
    </>
  );
};

export default PrivacyPolicy;
