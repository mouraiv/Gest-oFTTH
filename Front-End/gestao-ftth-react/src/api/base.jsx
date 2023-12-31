import api from '../services/api';

export const DownloadArquivo = async () => {
try {
  const response = await api.get('Base/DownloadArquivo', {
    responseType: 'arraybuffer', 
    });

    const dataAtual = new Date().toLocaleDateString().split('/').join('-'); // Formatar a data atual como dd-mm-yyyy
    const nomeArquivo = `TESTES_RECEBIDOS_${dataAtual}.xlsx`;

    // Criar um URL temporário para o Blob e criar um link para iniciar o download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();

    // Limpar o URL temporário após o download
    window.URL.revokeObjectURL(url);

} catch (error) {
    return 'Erro ao baixar o arquivo:', error;
  }
};

export const getVisualizarArquivo = async (filtro) => {
  const response = await api.get('/Base/VisualizarImagem', {
    params: filtro,
  });

  return response;
};

export const deleteImagem = async (url) => {
  const response = await api.delete("Base/DeletarArquivo", {
    params:{url}
  });
  return response;
};

// Função para fazer o upload de um arquivo para o backend
// Função para fazer o upload de arquivos para o backend
export const fazerUploadDeArquivo = async (files, filtro) => {
  try {
    const formData = new FormData();
  
    for (let i = 0; i < files.length; i++) {
      formData.append("path", files[i]); // Use uma chave única para cada arquivo
    }
    const response = await api.post("Base/UploadArquivo", formData, {
      params: filtro,
    });

    return response;
    
  } catch (error) {
    console.log(error); // Lança o erro para que possa ser tratado no chamador
  }
};


