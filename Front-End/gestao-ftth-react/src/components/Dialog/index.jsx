import { Dialog } from 'primereact/dialog';
import { ButtonConfirma, ButtonCancelar } from './style';

export default function DialogAlert({
  header, 
  text, 
  visibleDiag, 
  visibleHide, 
  buttonConfirmar,
  colorType,
  ConfirmaButton,
  textCloseButton
}) 
    {
      return (
        <>
        <Dialog header={<div style={{
            borderLeft: `5px solid ${colorType}`, 
            paddingLeft: '0.5rem',
        }}>{header}</div>} visible={visibleDiag} style={{ 
              border: `1px solid ${colorType}`, 
              padding:'1rem',
              marginTop: '1rem',
              backgroundColor: 'whitesmoke',
              fontWeight: '500',         
              }} 
              closable={false}
              position={'top'}
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
                  
                    <ButtonCancelar onClick={visibleHide}>{textCloseButton}</ButtonCancelar>
                  { ConfirmaButton ? (
                    <ButtonConfirma onClick={buttonConfirmar}>Confirmar</ButtonConfirma>
                    ) : (null)
                  }
                </div>
            </Dialog>
        </>
      )
  }
  