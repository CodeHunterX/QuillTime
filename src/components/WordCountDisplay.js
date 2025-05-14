import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getRoot } from 'lexical';

const WordCountDisplay = ({ isSaving, lastSavedTime }) => {
    const [wordCount, setWordCount] = useState(0);
  
    const countWords = (editorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        const words = text.trim().split(/\\s+/).filter(Boolean);
        setWordCount(words.length);
      });
    };
  
    const getStatus = () => {
      if (isSaving) return 'Saving...';
      if (lastSavedTime) return 'All changes saved';
      return '';
    };
  
    return (
      <div style={{ 
        marginTop: '0.5rem', 
        borderTop: '1px solid #ccc', 
        paddingTop: '0.5rem', 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '0.9rem',
        color: '#666' 
      }}>
        <div><strong>Word Count:</strong> {wordCount}</div>
        <div>{getStatus()}</div>
        <OnChangePlugin onChange={countWords} />
      </div>
    );
  };
  

export default WordCountDisplay;
