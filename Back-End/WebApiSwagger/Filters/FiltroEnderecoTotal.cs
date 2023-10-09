using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApiSwagger.Filters
{
    public class FiltroEnderecoTotal
    {
        public string? UF { get; set; }
        public string? Estacao { get; set; }
        public string? Municipio { get; set; }
        public string? CodSurvey { get; set; }
        public string? CDO { get; set; }
        public string? EstadoOperacional { get; set; }
        public string? EstadoControle { get; set; }
        public string? EstadoProjeto { get; set; }
        
    }
}