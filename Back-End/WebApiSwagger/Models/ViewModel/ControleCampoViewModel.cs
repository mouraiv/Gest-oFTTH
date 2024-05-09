namespace WebApiSwagger.Models.ViewModel
{
    public class ControleCampoViewModel
    {
        public string? CHAVE { get; set; }
        public string? UF { get; set; }
        public string? SiglaEstacao { get; set; }
        public string? Estacao { get; set; }
        public string? TipoObra { get; set; }
        public string? Cabo { get; set; }
        public string? Celula { get; set; }
        public string? CDO { get; set; }
        public string? Capacidade { get; set; }
        public int? TotalUMs { get; set; }
        public string? Endereco { get; set; }
        public string? Construtora { get; set; }
        public string? EstadoProjeto { get; set; }
        public string? EstadoControle { get; set; }
        public DateTime? DataRecebimento { get; set; }
        public DateTime? AceitacaoData { get; set; }
        public IEnumerable<AnaliseViewModel> Analises { get; set; } = new List<AnaliseViewModel>();
        public MaterialRedeViewModel MaterialRede { get; set; } = new MaterialRedeViewModel();

        public class AnaliseViewModel
        {
            public DateTime? DataAnalise { get; set; }
            public string? Status { get; set; }
            public string? Analista { get; set; }
            public string? AnaliseObservacao { get; set; }
        }

        public class MaterialRedeViewModel
        {
            public string? EstadoOperacional_Mt { get; set; }
            public string? GrupoOperacional_Mt { get; set; }
            public string? EstadoControle_Mt { get; set; }
             public string? Endereco_Mt { get; set; }
            public IEnumerable<EnderecoTotalViewModel> EnderecoTotal { get; set; } = new List<EnderecoTotalViewModel>();
            public IEnumerable<LigacaoViewModel> Ligacao { get; set; } = new List<LigacaoViewModel>();
        }

        public class EnderecoTotalViewModel
        {
            public string? AnoMes { get; set; }
            public string? TipoViabilidade { get; set; }
            public string? Cod_Viabilidade { get; set; }
        }

        public class LigacaoViewModel
        {
            public string? DGO_ls { get; set; }
            public string? FibraDgo_ls { get; set; }
            public string? PortaCdo_ls { get; set; }
             public string? EstadoCicloVida_ls { get; set; }
        }
    }
}
