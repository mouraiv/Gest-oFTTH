using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Filters;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Utils;

namespace WebApiSwagger.Controllers
{
     [ApiController]
    [Route("Api/EnderecoTotal")]
    public class EnderecoTotalController : Controller
    {
        private readonly IEnderecoTotalRepository _enderecoTotalRepository;
        private readonly Paginacao _paginacao;

        public EnderecoTotalController(IEnderecoTotalRepository enderecoTotalRepository, Paginacao paginacao)
        {
            _enderecoTotalRepository = enderecoTotalRepository;
            _paginacao = paginacao;

        }

        [HttpGet("Listar")]
        public async Task<IActionResult> Listar([FromQuery]FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = pagina + 100 ?? 100;

                var resultado = await _enderecoTotalRepository.Listar(filtro,_paginacao);

                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(
                    new {
                            Paginacao = _paginacao,
                            Resultado = resultado
                        });
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
           
        }
        [HttpGet("Carregar/{id}")]
        public async Task<IActionResult> Carregar(int id)
        {
            try
            {
                var resultado = await _enderecoTotalRepository.CarregarId(id);

                if (resultado == null)
                {
                    return NotFound(); 
                }

                return Ok(resultado);
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
             
        }
    }
}