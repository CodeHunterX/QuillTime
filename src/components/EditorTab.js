import React, { useEffect, useState, useRef } from 'react';
import {
  LexicalComposer
} from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { loadDocContent, saveDocContent } from '../services/googleDocSync';
import './EditorTab.css';

const theme = {
  paragraph: 'editor-paragraph',
};

const WordCountDisplay = ({ isSaving, lastSavedTime }) => {
  const [wordCount, setWordCount] = useState(0);

  const countWords = (editorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      const words = text.trim().split(/\s+/).filter(Boolean);
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

const LoadDocPlugin = ({ fileId }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!fileId) return;

    const load = async () => {
      const text = await loadDocContent(fileId);
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(text));
        root.append(paragraph);
      });
    };

    load();
  }, [fileId, editor]);

  return null;
};

const AutoSavePlugin = ({ fileId, interval = 5000, setIsSaving, setLastSavedTime }) => {
  const [editor] = useLexicalComposerContext();
  const lastSavedText = useRef('');

  useEffect(() => {
    if (!fileId) return;

    const intervalId = setInterval(() => {
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const text = root.getTextContent();

        if (text !== lastSavedText.current) {
          lastSavedText.current = text;
          setIsSaving(true);
          saveDocContent(fileId, text)
            .then(() => {
              setIsSaving(false);
              setLastSavedTime(Date.now());
              console.log('[AutoSavePlugin] Auto-saved.');
            })
            .catch(err => {
              setIsSaving(false);
              console.error('[AutoSavePlugin] Save error:', err?.message || err);
            });
        }
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [fileId, editor, interval, setIsSaving, setLastSavedTime]);

  return null;
};

const EditorTab = ({ fileId }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const initialConfig = {
    namespace: 'QuillTimeEditor',
    theme,
    onError(error) {
      throw error;
    },
    nodes: [],
  };

  return (
    <div className="editor-tab" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <LexicalComposer initialConfig={initialConfig}>
        <LoadDocPlugin fileId={fileId} />
        <AutoSavePlugin
          fileId={fileId}
          setIsSaving={setIsSaving}
          setLastSavedTime={setLastSavedTime}
        />
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<div className="editor-placeholder">Start writing your doc...</div>}
              ErrorBoundary={({ error }) => <div>Error: {error.message}</div>}
            />
            <HistoryPlugin />
          </div>
          <WordCountDisplay isSaving={isSaving} lastSavedTime={lastSavedTime} />
        </div>
      </LexicalComposer>
    </div>
  );
};

export default EditorTab;
