import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Checklist from '@editorjs/checklist';
import Warning from '@editorjs/warning';
import Embed from '@editorjs/embed';
import Underline from '@editorjs/underline';
import ColorPlugin from 'editorjs-text-color-plugin';
import AlignmentTuneTool from 'editorjs-text-alignment-blocktune';
import DragDrop from 'editorjs-drag-drop';
import AttachesTool from '@editorjs/attaches';

import PdfEmbedTool from './tools/PdfEmbedTool';
import PdfLinkTool from './tools/PdfLinkTool';
import GalleryTool from './tools/GalleryTool';
import ImageTextHighlightTool from './tools/ImageTextHighlightTool';
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
      onReady: () => {
        new DragDrop(editor);
      },
      tools: {
        alignment: {
          class: AlignmentTuneTool,
          config: {
            default: "left",
          }
        },
        Color: {
          class: ColorPlugin,
          config: {
            colorCollections: ['#0266b0', '#fdc300', '#008668', '#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#333333'],
            defaultColor: '#333333',
            type: 'text', 
          }
        },
        Marker: {
          class: ColorPlugin,
          config: {
            defaultColor: '#fef08a',
            type: 'marker',
            icon: `<svg viewBox="0 0 20 20" width="16" height="16"><path fill="currentColor" d="M10 2L2 10l8 8 8-8-8-8zM4.83 10l5.17-5.17L15.17 10 10 15.17 4.83 10z"/></svg>`
          }
        },
        underline: Underline,
        
        // --- ORDEM VISUAL NO MENU (+) ---
        header: {
          class: Header,
          inlineToolbar: ['link', 'bold', 'italic', 'underline', 'Color', 'Marker'],
          tunes: ['alignment'],
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2
          }
        },
        paragraph: {
          class: Paragraph,
          inlineToolbar: ['link', 'bold', 'italic', 'underline', 'Color', 'Marker'],
          tunes: ['alignment']
        },
        list: {
          class: List,
          inlineToolbar: ['link', 'bold', 'italic', 'underline', 'Color', 'Marker'],
          tunes: ['alignment']
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
              uploadByUrl(url) {
                return new Promise((resolve) => {
                  resolve({ success: 1, file: { url: url } });
                });
              }
            }
          }
        },
        table: {
          class: Table,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+O',
          config: {
            quotePlaceholder: 'Digite a citação',
            captionPlaceholder: 'Autor da citação',
          },
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        delimiter: Delimiter,
        warning: {
          class: Warning,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+W',
          config: {
            titlePlaceholder: 'Título',
            messagePlaceholder: 'Mensagem',
          },
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              twitter: true,
              instagram: true
            }
          }
        },
        attaches: {
          class: AttachesTool,
          config: {
            endpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/upload?folder=${uploadFolder}`,
            additionalRequestHeaders: {
              'Authorization': `Bearer ${localStorage.getItem('acic_access_token')}`
            },
            errorMessage: 'Erro ao enviar o anexo',
          }
        },
        // --- CUSTOM ACIC PLUGINS ---
        gallery: {
          class: GalleryTool
        },
        imageTextHighlight: {
          class: ImageTextHighlightTool
        },
        pdfEmbed: {
          class: PdfEmbedTool
        },
        pdfLink: {
          class: PdfLinkTool
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