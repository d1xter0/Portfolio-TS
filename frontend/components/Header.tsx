import "./styles/Header.css";

function Header() {
    return (
        <header id="head">
           <div className="head">
              <div className="head-icon">
                <img alt='logo-icon' src="/avatar-icon.png"></img>
              </div>

              <div className="research-bar">
                <button className="status-btn" onClick={() => document.getElementById("Career")?.scrollIntoView({ behavior: "smooth" }) }>
                    <div className="cNNLQk"></div>
                      Status
                </button>

                <button className="head-btn" onClick={() => document.getElementById('Home')?.scrollIntoView({ behavior: "smooth" }) }>Home</button>
                <button className="head-btn" onClick={() => document.getElementById('About-Me')?.scrollIntoView({ behavior: "smooth" }) }>About Me</button>
                <button className="head-btn" onClick={() => document.getElementById('Skills')?.scrollIntoView({ behavior: "smooth" }) }>Skills</button>
                <button className="head-btn" onClick={() => document.getElementById('Projects')?.scrollIntoView({ behavior: "smooth" }) }>Projects</button>
                <button className="head-btn" onClick={() => document.getElementById('Career')?.scrollIntoView({ behavior: "smooth" }) }>Career</button>
                <button className="head-btn" onClick={() => document.getElementById('Contact')?.scrollIntoView({ behavior: "smooth" }) }>Contact</button>
              </div>
           </div>
        </header>
    );
}

export default Header;