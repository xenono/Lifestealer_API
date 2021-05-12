import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    *,*&{
        box-sizing: border-box;
        font-family: 'Montserrat', sans-serif;

    }
    html{
        margin: 0;
        padding: 0;
        font-size: 62.5%;
    }
    body {
        margin: 0;
        padding: 0;
    }
    
    @media (max-width: 1024px){
      html {
        font-size: 50%;
      }
    }
    @media (max-width: 800px){
      html {
        font-size: 35%;
      }
    }
    @media (max-width: 600px){
      html {
        font-size: 30%;
      }
    }
`;

export default GlobalStyle;