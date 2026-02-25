function Modal({ title, text, showModal }) {
  return (
    <>
      {showModal && (
        <div className="fixed z-1 left-0 top-0 w-full h-full overflow-auto bg-[rgba(0,0,0,0.4)]">
          <div className="bg-[#fefefe] my-[15%] mx-auto p-5 border border-solid border-[#888] w-4/5">
            <h1 className="route-title">{title}</h1>
            <p>{text}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
