
namespace WebApiSwagger.Models.ViewModel
{
    public class MaterialRedeView
    {
        public string? CHAVE { get; set; }
        public string? NomeFederativa_Mt { get; set; }
        public string? NomeAbastecedora_Mt { get; set; }
        public string? GrupoOperacional_Mt { get; set; }
        public string? EstadoControle_Mt { get; set; }
        public string? EstadoOperacional_Mt { get; set; }
        public List<EnderecoTotal> EnderecosTotais { get; set; } = new List<EnderecoTotal>();

        public class EnderecoTotal
        {
            public string? UF { get; set; }
            public string? AnoMes { get; set; }
            public int? Id_StatusGanho { get; set; }
            public int? Id_Disponibilidade { get; set; }
            public string? Celula { get; set; }
            public string? Municipio { get; set; }
            public string? Localidade { get; set; }
            public string? Logradouro { get; set; }
            public string? NumeroFachada { get; set; }
            public string? Cod_Survey { get; set; }
            public string? SiglaEstacao { get; set; }
            public string? NomeCdo { get; set; }
            public string? Bairro { get; set; }
            public string? CEP { get; set; }
            public string? ChaveCelula { get; set; }
            public int? QuantidadeUMS { get; set; }
            public string? Cod_Viabilidade { get; set; }
            public string? TipoViabilidade { get; set; }
            public string? TipoRede { get; set; }
            public string? Disp_Comercial { get; set; }
            public string? UCS_Residenciais { get; set; }
            public string? UCS_Comerciais { get; set; }
            public List<MaisDeUmaCDO> MaisDeUmaCDOs { get; set; } = new List<MaisDeUmaCDO>();
        }

        public class MaisDeUmaCDO
        {
            public int? Id_Associacao { get; set;}
            public string? Associacao_CDO { get; set; }
            public string? Data_de_associacao { get; set; }
        }
    }

}
