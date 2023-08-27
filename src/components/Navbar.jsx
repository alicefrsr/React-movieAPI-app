import Logo from './Logo';
const Navbar = ({ children }) => {
  return (
    <nav className='navBar'>
      <Logo />
      {/* <Search />
          <NumResults movies={movies} /> */}
      {children}
    </nav>
  );
};

export default Navbar;
