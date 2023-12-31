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
        private readonly PainelGanho _painelGanho;

        public EnderecoTotalController(IEnderecoTotalRepository enderecoTotalRepository, Paginacao paginacao,  PainelGanho painelGanho)
        {
            _enderecoTotalRepository = enderecoTotalRepository;
            _paginacao = paginacao;
            _painelGanho = painelGanho;

        }

        [HttpGet("Listar")]
        public async Task<IActionResult> Listar([FromQuery]FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

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
        [HttpGet("BaseAcumulada")]
        public async Task<IActionResult> BaseAcumulada([FromQuery]FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.BaseAcumulada(filtro,_paginacao);

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
        [HttpGet("GanhoSurvey")]
        public async Task<IActionResult> GanhoSurvey([FromQuery]FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.ListarGanho(filtro,_paginacao, _painelGanho);

                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(
                    new {
                            Paginacao = _paginacao,
                            Painel = _painelGanho,
                            Resultado = resultado
                        });
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
           
        }

        /*[HttpGet("GanhoSurveyDia")]
        public async Task<IActionResult> GanhoSurveyDia([FromQuery]FiltroEnderecoTotal filtro, int? pagina)
        {
            try
            {
                _paginacao.Pagina = pagina ?? 1;
                _paginacao.Tamanho = 100;
                _paginacao.PaginasCorrentes = filtro.Pagina * 100 ?? 100;

                var resultado = await _enderecoTotalRepository.ListarGanhoDia(filtro,_paginacao, _painelGanho);
                
                _paginacao.TotalPaginas = (int)Math.Ceiling((double)_paginacao.Total / _paginacao.Tamanho);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(
                    new {
                            Paginacao = _paginacao,
                            Painel = _painelGanho,
                            Resultado = resultado
                        });
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
           
        }*/

        [HttpGet("Carregar")]
        public async Task<IActionResult> Carregar([FromQuery] int id)
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
        [HttpGet("ListarCarregarId")]
        public async Task<IActionResult> ListarCarregarId([FromQuery] int? id)
        {
            try
            {
                var resultado = await _enderecoTotalRepository.ListarCarregarId(id);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(resultado);
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao listar: " + ex.Message);
            }
           
        }
        [HttpGet("ListaUnica")]
        public async Task<IActionResult> ListaUnica()
        {
            try
            {
                var resultado = await _enderecoTotalRepository.ListaUnica();

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
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