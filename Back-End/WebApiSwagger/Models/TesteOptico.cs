using System.ComponentModel.DataAnnotations;

namespace WebApiSwagger.Models
{
    public class TesteOptico
    {
        [Key]
        public int Id_TesteOptico {get; set;}
        public string? CHAVE {get; set;}
        public string? UF {get; set;}
        public string? Construtora {get; set;}
        public string? Estacao {get; set;}
        public string? TipoObra {get; set;}
        public string? CDO {get; set;}
        public string? Cabo {get; set;}
        public string? Celula {get; set;}
        public string? Capacidade {get; set;}
        public int? TotalUMs {get; set;}
        public string? Endereco {get; set;}
        public string? EstadoCampo {get; set;}
        public string? EstadoProjeto {get; set;}
        public string? EstadoControle {get; set;}
        public DateTime? AceitacaoData {get; set;}
        public string? AceitacaoMesRef {get; set;}
        public string? TesteObservacao {get; set;}
        public string? Viabilidade {get; set;}
        public string? Meta {get; set;}
        public DateTime? DataConstrucao {get; set;}
        public string? EquipeConstrucao {get; set;} 
        public DateTime? DataTeste {get; set;}
        public string? Tecnico {get; set;} 
        public DateTime? DataRecebimento {get; set;}
        public string? BobinaLancamento {get; set;}
        public string? BobinaRecepcao {get; set;}
        public string? QuantidadeTeste {get; set;}
        public string? PosicaoIcxDgo {get; set;}
        public string? SplitterCEOS {get; set;}
        public string? FibraDGO {get; set;}
        public int? Sel {get; set;}
        public int? Id_EnderecoTotal { get; set; }
        public EnderecoTotal EnderecosTotais { get; set; } = null!;
        public ICollection<Analise> Analises {get;} = new List<Analise>();
        public ICollection<Validacao> Validacoes {get;} = new List<Validacao>();
    }
}