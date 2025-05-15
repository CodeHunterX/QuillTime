import React, { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../services/AuthContext';
import './SocialTab.css';

const SocialTab = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    await addDoc(collection(db, 'messages'), {
      text: input.trim(),
      user: user.name || 'Anonymous',
      timestamp: Timestamp.now(),
    });

    setInput('');
  };

  return (
    <div className="social-tab">
      <h3>Quill Chat</h3>
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message and press Enter"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default SocialTab;
