console.log('[googleDocSync] module loaded');

/**
 * Load a Google Doc's plain text content via the Docs API
 */
export async function loadDocContent(fileId) {
  console.log('[googleDocSync] loadDocContent called with fileId:', fileId);
  if (!window.gapi?.client?.docs) {
    throw new Error("Google Docs API not loaded");
  }

  const res = await window.gapi.client.docs.documents.get({
    documentId: fileId,
  });

  const content = res.result.body.content || [];

  const text = content
    .flatMap(block =>
      block.paragraph?.elements?.map(el => el.textRun?.content || '') || []
    )
    .join('');

  return text.trim();
}

/**
 * Overwrite a Google Doc with new content
 */
export async function saveDocContent(fileId, newText) {
  console.log('[googleDocSync] saveDocContent called with fileId:', fileId);
  if (!window.gapi?.client?.docs) {
    throw new Error("Google Docs API not loaded");
  }

  const doc = await window.gapi.client.docs.documents.get({
    documentId: fileId,
  });

  const endIndex = doc.result.body.content?.at(-1)?.endIndex || 1;

  const requests = [];

  if (endIndex > 1) {
    requests.push({
      deleteContentRange: {
        range: {
          startIndex: 1,
          endIndex: endIndex - 1,
        },
      },
    });
  }

  if (newText.trim()) {
    requests.push({
      insertText: {
        text: newText,
        location: {
          index: 1,
        },
      },
    });
  }

  if (requests.length === 0) {
    console.log('[saveDocContent] No changes to apply.');
    return;
  }

  await window.gapi.client.docs.documents.batchUpdate({
    documentId: fileId,
    resource: { requests },
  });
}
