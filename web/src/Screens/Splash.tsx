import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import "./splash.css";
import splash_man from "../assets/images/splash_man.png";
import splash_building from "../assets/images/splash_building.png";
import login_profile from "../assets/images/login_profile.png";
import RoutePaths from "../config";

const Splash: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(RoutePaths.signin);
  };
  return (
    <div className="div">
      <div className="macbook-pro-14-3">
        <div className="macbook-pro-14-1">
          <img className="pngegg-1-icon" alt="" src={splash_building} />
          <img className="pointing-left-icon" alt="" src={splash_man} />
          <div className="macbook-pro-14-1-child" />
          <b className="welcome-to-autox-container">
            <p className="welcome-to-autox">
              <span className="welcome-to-auto">WELCOME TO AUTO</span>
              <span className="x">X</span>
              <span>{` `}</span>
            </p>
            <p className="welcome-to-autox">{`CONSTRUCTIONS `}</p>
          </b>
          <div className="macbook-pro-14-1-item" />
          <div className="introducing-autox-procurement-container">
            <p className="welcome-to-autox">
              <span className="introducing-autox">
                <span className="welcome-to-auto">Introducing Auto</span>
                <span className="x1">X</span>
              </span>
              <span>
                <span className="introducing-autox">{` Procurement Service: `}</span>
              </span>
            </p>
            <p className="welcome-to-autox">
              <span>
                <span className="introducing-autox">&nbsp;</span>
              </span>
            </p>
            <p className="welcome-to-our-construction-pr">
              <span>
                <span className="welcome-to-our">
                  Welcome to our Construction Procurement App! Streamline your
                  construction project procurement with our user-friendly
                  software. Empower Site Managers to request materials
                  effortlessly, while enabling seamless approval workflows and
                  supplier interactions. Take control of your construction
                  procurement process with our powerful, intuitive solution.
                </span>
              </span>
            </p>
          </div>
          <div className="wwwautoxconstrunctionscom">
            www.autoxconstrunctions.com | copyright 2023
          </div>
          <div className="macbook-pro-14-1-inner" />
          <a
            className="login"
            onClick={handleNavigate}
            target="_blank"
          >{`LOGIN `}</a>
          <b className="forget-password">Forget Password?</b>
          <img className="user-1077114-1-icon" alt="" src={login_profile} />
        </div>
      </div>
    </div>
  );
};

export default Splash;
