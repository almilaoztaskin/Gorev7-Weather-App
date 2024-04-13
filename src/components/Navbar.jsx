import NavButton from "./NavbarButton";
import "./Navbar.css";
import PropTypes from "prop-types";

const Navbar = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="navBar">
      <h6 className="navBar-header">Hava Durumu Sorgulama</h6>
      <NavButton isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
    </div>
  );
};

Navbar.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  onToggleDarkMode: PropTypes.func.isRequired,
};
export default Navbar;
