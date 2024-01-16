import Api from '../services/api';

const DownloadArquivo = async () => {
try {
  const response = await Api.get('Base/DownloadArquivo', {
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

const GetVisualizarArquivo = async (filtro) => {
  const response = await Api.get('/Base/VisualizarImagem', {
    params: filtro,
  });

  return response;
};

const DeleteImagem = async (url) => {
  const response = await Api.delete("Base/DeletarArquivo", {
    params:{url}
  });
  return response;
};

// Função para fazer o upload de um arquivo para o backend
// Função para fazer o upload de arquivos para o backend
const FazerUploadDeArquivo = async (files, filtro) => {
  try {
    const formData = new FormData();
  
    for (let i = 0; i < files.length; i++) {
      formData.append("path", files[i]); // Use uma chave única para cada arquivo
    }
    const response = await Api.post("Base/UploadArquivo", formData, {
      params: filtro,
    });

    return response;
    
  } catch (error) {
    console.log(error); // Lança o erro para que possa ser tratado no chamador
  }
};

export {
  DownloadArquivo,
  GetVisualizarArquivo,
  DeleteImagem,
  FazerUploadDeArquivo
}


