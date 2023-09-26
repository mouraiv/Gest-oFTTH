import { Container } from "./style";

export default function ButtonDefaut({event, text}) {
      return (
        <>
          <Container>
            <button onClick={event}>{text}</button>
          </Container>
        </>
      )
  }