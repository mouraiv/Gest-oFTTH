import { HeaderStyleUser, HeaderStyle } from "./style";
import { useAuth } from "../../contexts/auth";
import { useNavigate } from 'react-router-dom';
import { FaRightToBracket } from 'react-icons/fa6';

export default function Header({title}) {
  const { user, Logout } = useAuth();

  const refreshToken = sessionStorage.getItem("@App:token");
  let auth = { token: refreshToken};

  const navigate = useNavigate();
  
  async function handleLogout() {
    Logout();
    navigate('/');
 }

      return (
        <>
        { auth.token ? (
          <HeaderStyleUser>
            <div className="logoContainer">
              <div className="logo">
                <img src="/public/imagens/logictel.png" />
              </div>
              <div>
                <p className="title">| {title}</p>
              </div>
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
  
