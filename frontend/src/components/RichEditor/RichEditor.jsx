import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import PdfEmbedTool from './tools/PdfEmbedTool';
import GalleryTool from './tools/GalleryTool';
import './RichEditor.css';

const RichEditor = forwardRef(({ value, uploadFolder = 'geral' }, ref) => {
  const editorInstance = useRef(null);
  const wrapperRef = useRef(null);

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (editorInstance.current) {
        try {
          return await editorInstance.current.save();
        } catch (error) {
          console.error('[RichEditor] Falha ao salvar o conteúdo do EditorJS:', error);
          return null;
        }
      }
      return null;
    }
  }));

  useEffect(() => {
    if (!wrapperRef.current) return;

    // Cria um elemento DOM único e isolado para esta montagem específica.
    // Isso blinda o EditorJS contra a montagem/desmontagem rápida do React 18 Strict Mode.
    const editorElement = document.createElement('div');
    editorElement.id = `editorjs-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    wrapperRef.current.appendChild(editorElement);

    let initialData = undefined;
    if (value && typeof value === 'object') {
      initialData = value;
    }

    const editor = new EditorJS({
      holder: editorElement, // Passa o elemento DOM direto, não o ID
      data: initialData || {},
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
        pdfEmbed: {
          class: PdfEmbedTool
        },
        gallery: {
          class: GalleryTool
        },
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/upload?folder=${uploadFolder}`,
            },
            field: 'file',
            additionalRequestHeaders: {
              'Authorization': `Bearer ${localStorage.getItem('acic_access_token')}`
            },
            uploader: {
              // Intercepta a colagem de URLs (uploadByUrl) para não enviar POST para o backend/frontend
              // Apenas retorna a própria URL para ser renderizada imediatamente
              uploadByUrl(url) {
                return new Promise((resolve) => {
                  resolve({
                    success: 1,
                    file: {
                      url: url
                    }
                  });
                });
              }
            }
          }
        }
      }
    });

    editorInstance.current = editor;

    return () => {
      editorInstance.current = null;
      if (editor.isReady) {
        editor.isReady
          .then(() => {
            try {
              editor.destroy();
            } catch (e) {
              console.error('Erro ao destruir EditorJS isolado:', e);
            }
            // Remove o elemento isolado do DOM após a destruição
            if (editorElement.parentNode) {
              editorElement.parentNode.removeChild(editorElement);
            }
          })
          .catch(e => console.error(e));
      }
    };
  }, []); // Executa apenas na montagem

  return <div ref={wrapperRef} className="rich-editor-container" />;
});

export default RichEditor;