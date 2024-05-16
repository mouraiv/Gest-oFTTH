import { Dialog } from 'primereact/dialog';
import { FaMinus } from 'react-icons/fa6';
import { ButtonConfirma, ButtonCancelar } from './style';

export default function DialogAlert({
  header, 
  text, 
  visibleDiag, 
  visibleHide,
  minimizar,
  abilityMinimizar, 
  buttonConfirmar,
  colorType,
  ConfirmaButton,
  textCloseButton,
  CancelaButton
}) 
    {
      return (
        <>
        <Dialog
        minimizeIcon={true} 
        header={
          <>
            {abilityMinimizar &&
              <div style={{border: "1px solid", textAlign:"center", width:"24px", height:"20px", position:"absolute", right:0, marginRight:"1rem", cursor:"pointer"}} onClick={minimizar}>
                <FaMinus style={{position:"absolute", right:0 ,marginRight:"0.1rem"}} size={18} title='Recolher' />
                </div>
            }
            <div style={{
            borderLeft: `5px solid ${colorType}`, 
            paddingLeft: '0.5rem',
        }}>{header}
        </div>
        </>
        } visible={visibleDiag} style={{ 
              border: `1px solid ${colorType}`, 
              padding:'1rem',
              marginTop: '1rem',
              backgroundColor: 'whitesmoke',
              fontWeight: '500',         
              }} 
              closable={false}
              position={'top'}
              draggable={false} 
              resizable={false}
              contentStyle={{
                minWidth: '450px',
                marginTop: '1rem',
                wordBreak: 'break-all'
              }}
              maskStyle={{
                backgroundColor: 'rgba(93,109,126, 0.6)',
              }}
              >
                {text}
                <div style={{display:'flex', 
                justifyContent: 'flex-end', 
                alignItems: 'flex-end',
                borderTop: '1px solid rgb(19, 41, 61, 0.3)',
                marginTop: '1.5rem',
                paddingTop: '1rem'
                }}>
                  { !CancelaButton ? (
                    <ButtonCancelar onClick={visibleHide}>{textCloseButton}</ButtonCancelar>
                    ) : (null)
                  }
                  { ConfirmaButton ? (
                    <ButtonConfirma onClick={buttonConfirmar}>Confirmar</ButtonConfirma>
                    ) : (null)
                  }
                </div>
            </Dialog>
        </>
      )
  }
  