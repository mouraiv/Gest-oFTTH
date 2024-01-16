import { HeaderStyleUser, HeaderStyle} from "./style";
import { UseAuth } from "../../contexts/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRightToBracket } from 'react-icons/fa6';
import logo from "../../../public/imagens/logictel.png";

// eslint-disable-next-line react/prop-types
export default function Header({title}) {
  const { user, Logout } = UseAuth();

  const refreshToken = sessionStorage.getItem("@App:token");
  let auth = { token: refreshToken};

  const navigate = useNavigate();
  const location = useLocation();
  
  async function handleLogout() {
    Logout();
    navigate('/');
  }

  const handleInicio = () => {
    navigate(`/Home`); 
  };
  const handleTesteOptico = () => {
    navigate(`/TesteOptico`); 
  };
  const handleEnderecoTotal = () => {
    navigate(`/EnderecoTotal`); 
  };
  const handleBaseAcumulada = () => {
    navigate(`/BaseAcumulada`); 
  };
  const handleGanhoSurvey = () => {
    navigate(`/GanhoSurvey`); 
  };
      return (
        <>
        { auth.token ? (
          <HeaderStyleUser>
            <div className="logoContainer">
              <div className="logo">
                <img src={logo} />
              </div>
              <div>
                <p className="title">| {title}</p>
              </div>
            </div>

            <div className="navBar">
              <ul>
              {location.pathname !== '/Home' && (
                <li><a onClick={handleInicio}>Início</a></li>
              )}
                <li><a onClick={handleTesteOptico}>TesteOptico</a></li>
                <li><a onClick={handleGanhoSurvey}>Ganho Survey</a></li>
                <li><a>Netwin</a>
                  <ul>
                    <li><a onClick={handleEnderecoTotal}>Endereços Totais</a></li>
                    <li><a onClick={handleBaseAcumulada}>Base Acumulada</a></li>
                  </ul>
                </li>
              </ul>
            </div>  

            <div className="displayInfo">
              <div className="displayContent">
                <div className="info">
                  <p>{user.nome}</p>
                  <p>{user.cargo} - {user.empresa}</p>
                </div>
                <div className="logout">
                  <FaRightToBracket onClick={handleLogout} style={{fontSize:"1.7em", color:"white", fill:"white", cursor:"pointer" }} />
                </div>
              </div>
            </div>
          </HeaderStyleUser>
          ) : (
          <HeaderStyle>
          </HeaderStyle>
        )}
        </>
      )
  }
  
