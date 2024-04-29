import { HeaderStyleUser, HeaderStyle} from "./style";
import { UseAuth } from "../../contexts/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRightToBracket } from 'react-icons/fa6';
import logo from "../../../public/imagens/logictel.png";

// eslint-disable-next-line react/prop-types
export default function Header({title, navbar = true}) {
  const { user, Logout } = UseAuth();
  const userPrivate = user?.tipo ?? 1;

  const refreshToken = sessionStorage.getItem("@App:token");
  let auth = { token: refreshToken};

  const navigate = useNavigate();
  const location = useLocation();
  
  async function handleLogout() {
    Logout();
    navigate('/');
  }

  const handleUsuario = () => {
    navigate(`/Usuario`); 
  };

  const handleInicio = () => {
    navigate(`/Home`); 
  };
  const handleTesteOptico = () => {
    navigate(`/TesteOptico`); 
  };
  const handleEnderecoTotal = () => {
    navigate(`/EnderecoTotal`); 
  };

  const handleControleCampo = () => {
    navigate(`/ControleCampo`); 
  };
      return (
        <>
        { auth.token ? (
          <HeaderStyleUser>
            <div className="logoContainer">
              <div className="logo">
                <a style={{color: 'white', fontWeight: '600', fontSize: '1.6rem', marginLeft: '0.5rem'}}>SGF</a>
              </div>
              <div>
                <p className="title">| {title}</p>
              </div>
            </div>
            {navbar && (
            <>
            <div className="navBar">
              <ul>
              {location.pathname !== '/Home' && (
                <li><a onClick={handleInicio}>Início</a></li>
              )}
              { userPrivate === 3 &&
              <li style={{position: 'relative'}}><a style={{backgroundColor: '#CB4335'}}>Administrador</a>
                  <ul>
                    <li style={{left: 0, marginTop: '32.5%', position:'absolute'}}><a onClick={handleUsuario}>Usuários</a></li>
                  </ul>
                </li>
                }
                <li style={{position: 'relative'}}><a>Operações</a>
                  <ul>
                    <li style={{left:0, marginTop: '40%', position:'absolute'}}><a onClick={handleTesteOptico}>Teste Óptico</a></li>
                  </ul>
                </li>
                <li style={{position: 'relative'}}><a>Monitoramento</a>
                  <ul>
                    <li style={{left:0, marginTop: '30%', position:'absolute'}}><a onClick={handleControleCampo}>Controle de campo</a></li>
                  </ul>
                </li>
                <li style={{position: 'relative'}}><a>Netwin</a>
                  <ul>
                    <li style={{left:0, marginTop: '52%', position:'absolute'}}><a onClick={handleEnderecoTotal}>Endereços Totais</a></li>
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
            </>
            )}
          </HeaderStyleUser>
          ) : (
          <HeaderStyle>
          </HeaderStyle>
        )}
        </>
      )
  }
  
