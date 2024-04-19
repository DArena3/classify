import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/">
          <img alt="WHRB logo" className="h-10 inline" src="https://www.whrb.org/static/feb3f90dfd15d1839b6363ee7ad2d5e7/5a46c/whrb_logo.webp"></img>
        </NavLink>
        <b>Classify: Classical Music Catalog for the WHRB (Harvard Radio) collection of CDs and LPs</b>
        <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/create">
          Insert a New Piece
        </NavLink>
      </nav>
    </div>
  );
}