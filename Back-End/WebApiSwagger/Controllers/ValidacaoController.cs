using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using Microsoft.AspNetCore.Mvc;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/Validacao")]
   public class ValidacaoController : Controller
    {
        private readonly IValidacaoRepository _ValidacaoRepository;
  
        public ValidacaoController(IValidacaoRepository ValidacaoRepository)
        {
            _ValidacaoRepository = ValidacaoRepository;
        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(ValidateView Validacao)
        {
            try
            {
                var modelo = new Validacao {
                    DataValidacao = Validacao.DataValidacao,
                    Tecnico = Validacao.Tecnico,
                    Id_TesteOptico = Validacao.Id_TesteOptico,
                    Status = Validacao.Status
                    
                };

                var resultado = await _ValidacaoRepository.Inserir(modelo);
                          
                return Ok("Validado com sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao validar: " + ex.Message);
            }
            
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromQuery] Validacao Validacao)
        {
            try
            {
                var resultado = await _ValidacaoRepository.Editar(id, Validacao);
                          
                return Ok("Validado com sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao atualizar: " + ex.InnerException);
            }
            
        }
        [HttpDelete("Deletar/{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            try
            {
                var resultado = await _ValidacaoRepository.Deletar(id);

                return Ok("Deletado com sucesso!");
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao deletar: " + ex.Message);
            }
            
        }
        [HttpGet("Detalhe")]
        public async Task<IActionResult> Detalhe([FromQuery] int id)
        {
            try
            {
                var resultado = await _ValidacaoRepository.CarregarId(id);

                if (resultado == null)
                {
                    return NotFound("Nenhum resultado."); 
                }
                
                return Ok(resultado);
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao carregar: " + ex.InnerException);
            }

        }
        [HttpGet("Listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var resultado = await _ValidacaoRepository.Listar();

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
       