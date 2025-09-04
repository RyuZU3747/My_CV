import { useState, useCallback, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(0);

  const onDocumentLoadSuccess = useCallback((pdf) => {
    setNumPages(pdf.numPages);
  }, []);

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 5));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.25));
  const resetZoom = () => setScale(1.0);

  useEffect(() => {
    function updateWidth() {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const padding = 32;
      const maxDesktopWidth = 1100;
      const computed = Math.min(vw - padding, maxDesktopWidth);
      setPageWidth(computed > 0 ? computed : 600);
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const pdfUrl = `${import.meta.env.BASE_URL}mycv.pdf`;
  return (
    <div style={{ margin: 0 }}>
      <div style={{ width: '100%', overflow: 'auto' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: pageWidth }}>
              <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading="불러오는 중...">
                {Array.from(new Array(numPages || 0), (_, idx) => (
                  <div
                    key={`page_${idx + 1}`}
                    style={{
                      margin: '10px auto',
                      width: '100%'
                    }}
                  >
                    <Page
                      pageNumber={idx + 1}
                      width={pageWidth}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </div>
                ))}
              </Document>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}