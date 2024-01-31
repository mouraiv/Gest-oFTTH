import { styled } from "@stitches/react";

export const Container = styled("div", {
    position: 'relative',
    display:'flex',
    height: '100%',
    alignItems: 'center',
    
".progress-bar" : { 
    border: '1px solid #13293d',
    width: '500px',
    height: '5px',
    backgroundColor: 'whitesmoke'

  },

".sleep" : {
    position: 'absolute',
    marginLeft: '0.1rem',
    marginRight: '0.1rem',
    background: `linear-gradient(to right, rgba(19, 41, 61, 0), #13293d, rgba(19, 41, 61, 0))`,
    //width: '200px',
    height: '3px',
  },

  ".blank" : { 
    backgroundColor: 'whitesmoke', 
    width: '160px',
    height: '5px',
    zIndex: 1
  }

  
});