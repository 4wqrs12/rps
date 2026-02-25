function Modal({ title, text, showModal, setShowModal }) {
  return (
    <>
      {showModal && (
        <div
          className="fixed z-1 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.4)]"
          onClick={() => setShowModal(false)}
        >
          <div className="bg-[#CD7F32] my-[15%] mx-auto p-5 border-2 border-solid border-[#EADDCA] w-4/5 text-[#6E260E] rounded-md">
            <div>
              <button
                className="cursor-pointer text-3xl p-1 float-right"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h1 className="route-title">{title}</h1>
            </div>
            <p>{text}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
