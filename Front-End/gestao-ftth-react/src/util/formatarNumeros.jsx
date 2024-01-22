export const formatarNumero = (numero) => {
    // Converte o número para uma string
    const numeroString = numero.toString();
  
    // Divide a string em grupos de 3 caracteres
    const grupos = [];
    for (let i = numeroString.length; i > 0; i -= 3) {
      grupos.unshift(numeroString.substring(Math.max(0, i - 3), i));
    }
  
    // Junta os grupos usando o ponto como separador e retorna
    return grupos.join('.');
  }