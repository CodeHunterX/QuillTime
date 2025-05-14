import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { saveDocContent } from '../services/googleDocSync';

const SavePlugin = ({ fileId }) => {
  const [editor] = useLexicalComposerContext();

  const handleSave = async () => {
    editor.update(() => {
      const root = $getRoot();
      const text = root.getTextContent();
      if (fileId) {
        saveDocContent(fileId, text).then(() =>
          console.log('[SavePlugin] Saved to Google Doc')
        );
      }
    });
  };

  return (
    <button onClick={handleSave} style={{ marginLeft: '1rem' }}>
      Save to Google Docs
    </button>
  );
};

export default SavePlugin;
