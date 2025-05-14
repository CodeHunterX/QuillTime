import React, { useEffect, useState } from 'react';
import { useAuth } from '../services/AuthContext';
import './WordCountDisplay.css';

const WordCountDisplay = ({ fileId }) => {
  const { accessToken } = useAuth();
  const [wordCount, setWordCount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval = null;

    const fetchWordCount = async () => {
      console.log('[WordCount] accessToken:', accessToken);
      console.log('[WordCount] fileId:', fileId);
      console.log('[WordCount] gapi.client.docs loaded:',
        !!window.gapi?.client?.docs);

      if (!accessToken || !fileId || !window.gapi?.client?.docs) {
        console.warn('[WordCount] Cannot fetch — missing input or API');
        return;
      }

      setLoading(true);

      try {
        const res = await window.gapi.client.docs.documents.get({
          documentId: fileId,
        });

        console.log('[WordCount] Document fetched:', res);

        const content = res.result.body.content || [];

        const text = content
          .flatMap(block =>
            block.paragraph?.elements?.map(el => el.textRun?.content || '') || []
          )
          .join('');

        const words = text.trim().split(/\s+/).filter(Boolean);
        setWordCount(words.length);
      } catch (err) {
        console.error('[WordCount] Error fetching doc:', err);
        setWordCount(null);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken && fileId) {
      fetchWordCount(); // initial run
      interval = setInterval(fetchWordCount, 5000); // every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [accessToken, fileId]);

  return (
    <div className="word-count-box">
      {loading && 'Loading word count...'}
      {!loading && wordCount !== null && `Word Count: ${wordCount}`}
      {!loading && wordCount === null && 'Unable to fetch word count.'}
    </div>
  );
};

export default WordCountDisplay;
