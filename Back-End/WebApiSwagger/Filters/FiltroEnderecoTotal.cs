using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApiSwagger.Filters
{
    public class FiltroEnderecoTotal
    {
        public int? Pagina { get; set; }
        public string? CHAVE {get; set;}
        public string? ChaveCelula { get; set; }
        public int TotalSurveyList {get; set;} 
        public int? Id_StatusGanho { get; set; }
        public int? Id_StatusGanhoDia { get; set; }
        public int? Id_Disponibilidade { get; set; }
        public string? AnoMes { get; set; }
        public bool AnoMesBool { get; set; }
        public bool SemCdo { get; set; }
        public string? UF { get; set; }
        public string? SiglaEstacao { get; set; }
        public string? Estacao { get; set; }
        public string? Logradouro { get; set; }
        public string? NumeroFachada { get; set; }
        public string? CEP { get; set; }
        public string? Bairro { get; set; }
        public string? Municipio { get; set; }
        public string? Cod_Survey { get; set; }
        public string? CDO { get; set; }
        public string? Disp_Comercial { get; set; }
        public string? Cod_Viabilidade { get; set; }
        public string? DataEstadoOperacional_Mt { get; set; }
        public string? EstadoOperacional { get; set; }
        public string? DataEstadoControle_Mt { get; set; }
        public string? EstadoControle { get; set; }
        public string? EstadoProjeto { get; set; }
        public string? GrupoOperacional { get; set; }
        
    }
}