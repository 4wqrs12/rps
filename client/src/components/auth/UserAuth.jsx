function UserAuth({ title, user, userHandler, pass, passHandler, fetchFunc }) {
  return (
    <div className="route-content">
      <div className="route-title">{title}</div>
      <div className="bg-[#C19A6B] w-64 rounded-md">
        <form onSubmit={fetchFunc} className="p-5">
          <div className="mb-5">
            <input
              type="text"
              placeholder="Username..."
              value={user}
              onChange={userHandler}
              className="input-field"
            />
          </div>
          <div className="mb-5">
            <input
              type="text"
              placeholder="Password..."
              value={pass}
              onChange={passHandler}
              className="input-field"
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn bg-[#6E260E] p-3 hover:bg-[#571E0B]"
            >
              {title}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserAuth;
