import "./styles/header.css";

export function HeaderApp() {
  return (
    <>
      <div className="topnav">
        <span className="topnav-title">Credentials Generator</span>
        <ul>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>About</a>
          </li>
          <li>
            <a>Help</a>
          </li>
        </ul>
      </div>
    </>
  );
}
