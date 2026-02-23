import Logout from "./auth/Logout";

function Navbar() {
  return (
    <div className="bg-[#6E260E] m-2 rounded-md">
      <nav className="flex">
        {/*links on left side go here*/}
        <a href="/" className="navbar-routes">
          Home
        </a>
        <div className="ml-auto flex">
          <a href="/login" className="navbar-routes">
            Login
          </a>
          <a href="/register" className="navbar-routes">
            Register
          </a>
          <Logout />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
