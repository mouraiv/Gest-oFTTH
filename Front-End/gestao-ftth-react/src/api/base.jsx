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

