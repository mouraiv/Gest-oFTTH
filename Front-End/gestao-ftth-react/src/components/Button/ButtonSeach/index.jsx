import { Container } from "./style";

export default function ButtonSearch({event}) {
      return (
        <>
          <Container>
            <button onClick={event}>Pesquisar</button>
          </Container>
        </>
      )
  }
  