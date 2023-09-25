import React from "react";
import { LineWave } from 'react-loader-spinner';
import { Container } from "./style";

export default function Spinner() {
      return (
        <>
        <Container>
            <LineWave height={200} width={200} color="#13293d" />
        </Container>
        </>
      )
  }
  