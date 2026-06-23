import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import ImageTool from '@editorjs/image';
import './RichEditor.css';

const RichEditor = ({ value, onChange }) => {
  const editorInstance = useRef(null);
  const editorHolderId = useRef(`editorjs-${Date.now()}-${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    if (!editorInstance.current) {
      initEditor();
    }

    return () => {
      if (editorInstance.current) {
        if (typeof editorInstance.current.destroy === 'function') {
          try {
            editorInstance.current.destroy();
          } catch (e) {
            console.error('EditorJS destroy error:', e);
          }
        }
        editorInstance.current = null;
      }
    };
  }, []); // Run once on mount

  const initEditor = () => {
    let initialData = undefined;

    if (value && typeof value === 'object') {
      initialData = value;
    }

    const editor = new EditorJS({
      holder: editorHolderId.current,
      data: initialData || {},
      onChange: async () => {
        if (onChange && editorInstance.current) {
          try {
            const outputData = await editorInstance.current.save();
            onChange(outputData); 
          } catch (error) {
            console.error('Saving EditorJS data failed:', error);
          }
        }
      },
      tools: {
        header: {
          class: Header,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: true
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/upload`,
            },
            field: 'file',
            additionalRequestHeaders: {
              'Authorization': `Bearer ${localStorage.getItem('acic_access_token')}`
            }
          }
        }
      }
    });

    editorInstance.current = editor;
  };

  return <div id={editorHolderId.current} className="rich-editor-container" />;
};

export default RichEditor;