import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function FilePreview({ filePath, caseDetails }) {
  const { case_id, client_id, registration_number } = caseDetails;
  let [isOpen, setIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");

  useEffect(() => {
    const fileView = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}file_preview`,
          {
            params: {
              file_path: filePath,
              case_number: case_id,
              client_id,
              registration_number,
            },
          }
        );
        const data = await res.data;
        const pdfBlob = new TextEncoder().encode(data);
        console.log(pdfBlob);
        setPdfBlobUrl(pdfBlob);

        // Cleanup: Revoke the URL when component unmounts
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    };
    fileView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  if (!pdfBlobUrl) {
    return <div>Loading PDF...</div>;
  }

  return (
    <>
      <Button
        onClick={open}
        className="bg-black/20 data-[hover]:bg-black/30 text-blue rounded-md px-4 py-2 text-sm font-medium focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white"
      >
        View
      </Button>

      <Dialog
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-medium text-white"
              >
                File
              </DialogTitle>
              <div style={{ height: "500px" }}>
                <Worker
                  workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                >
                  <Viewer fileUrl={pdfBlobUrl} />
                </Worker>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
