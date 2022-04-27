import "./MenuHeader.css"
const MenuHeader = () => {
  return (
    <div className="menuHeader">
            <img
        className="siteLogo"
        src={require("../images/panda.jpeg")}
        alt="This a placeholder"
      ></img>
      <a href="home" className="logoutLink">Logout</a>

    </div>
  )
}

export default MenuHeader