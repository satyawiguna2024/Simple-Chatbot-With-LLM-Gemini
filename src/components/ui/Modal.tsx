type ModalPropsType = {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  labelButton: string;
}

export default function Modal({ open, setOpen, labelButton, children }: ModalPropsType) {

  return (
    <>
      {/* Button Modal */}
      <button
        onClick={() => setOpen(!open)}
        type="button"
        className="fixed bottom-6 right-6 bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-5 py-3 rounded-full shadow-2xl backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 z-50 flex items-center gap-2 font-medium"
      >
        ✨ {labelButton}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-5xl">
            {/* Modal Content */}
            <div className="relative bg-white rounded-base shadow-sm p-4 md:p-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}