import { Dialog } from 'primereact/dialog';
import { ButtonConfirma, ButtonCancelar } from './style';

export default function DialogAlert({header, text, visibleDiag, visibleHide, buttonConfirmar}) {
      return (
        <>
        <Dialog header={<div style={{
            borderLeft: '5px solid #13293d', 
            paddingLeft: '0.5rem'
        }}>{header}</div>} visible={visibleDiag} style={{ 
              minWidth: '25vw', 
              border: '1px solid #5D6D7E',
              padding:'1rem',
              marginTop: '1rem',
              backgroundColor: 'whitesmoke',
              fontWeight: '500',
              
              }} 
              closable={false}
              position={'top'}
              contentStyle={{
                marginTop: '1rem'
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
                    <ButtonCancelar onClick={visibleHide}>Cancelar</ButtonCancelar>
                    <ButtonConfirma onClick={buttonConfirmar}>Confirmar</ButtonConfirma>
                </div>
            </Dialog>
        </>
      )
  }
  