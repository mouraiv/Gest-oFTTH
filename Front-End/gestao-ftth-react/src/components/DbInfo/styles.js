import { styled } from "@stitches/react"

export const InfoData = styled("div", {
    display: 'flex',
    fontSize: '0.6rem',
    width: '100%',
    justifyContent: 'center',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    backgroundColor: '#D6DBDF',
    fontWeight: '600',
    
   ".info":{
        display: 'flex',
        margin: '0.5rem',
        alignItems: 'center',
        marginLeft: '0.8rem',
        backgroundColor: '#EAEDED',
        width: '180px',
        padding: '0.2rem',
        borderRadius: '0.3rem',
        border: '1px solid #616A6B',

   }
});

 export const InputImport = styled("input", {
     border: '1px solid #5D6D7E',
     borderRadius: '0.3rem',
     fontSize: '0.8rem',
     fontWeight: '500',
     width: '350px',
     height: '29px',
     color: '#5D6D7E' 
 });
 
 export const ButtonUpload = styled("button", {
     backgroundColor: '#D6DBDF',
     border: '1px solid #5D6D7E',
     borderRadius: '0.3rem',
     fontSize: '0.8rem',
     fontWeight: '500',
     marginLeft:'0.5rem',
     width: '80px',
     height: '30px',
     color: '#13293d',
     cursor: 'pointer',
 
 
     '&:active' : {
         backgroundColor: '#5D6D7E',   
     }
     
 });

 export const ImportArea = styled("div", {
    display: "flex",
    alignItems: 'flex-end',
    height: '30px',
    fontSize: '0.8rem',
    fontWeight: '700',

    'input[type=file]::file-selector-button':{
        backgroundColor: '#D6DBDF',
        border: 'none',
        borderRight: '1px solid #5D6D7E',
        borderTopLeftRadius: '0.3rem',
        borderBottomLeftRadius: '0.3rem',
        fontSize: '0.8rem',
        fontWeight: '500',
        width: '110px',
        height: '29px',
        color: '#13293d',
        cursor: 'pointer',

    },

    'input[type=file]::file-selector-button:active' : {
        backgroundColor: '#5D6D7E',   
    }

});