using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApiSwagger.Filters
{
    public class FiltroTesteOptico
    {
        public string? UF { get; set; }
        public string? Construtora { get; set; }
        public string? Estacao { get; set; }
        public string? CDO { get; set; }
        public int? Tecnico { get; set; }
        public DateTime? DataTeste { get; set; }
        public DateTime? DataRecebimento { get; set; }

    }
}