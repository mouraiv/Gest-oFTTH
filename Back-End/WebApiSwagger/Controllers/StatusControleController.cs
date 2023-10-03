using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/StatusControle")]
   public class StatusControleController : Controller
    {
        private readonly IStatusControleRepository _StatusControleRepository;
  
        public StatusControleController(IStatusControleRepository StatusControleRepository)
        {
            _StatusControleRepository = StatusControleRepository;
        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(StatusControle StatusControle)
        {
            try
            {
                var resultado = await _StatusControleRepository.Inserir(StatusControle);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, StatusControle StatusControle)
        {
            try
            {
                
                var resultado = await _StatusControleRepository.Editar(id, StatusControle);
                          
                return Ok("Atualizado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao atualizar: " + ex.Message);
            }
            
        }
        [HttpDelete("Deletar/{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            try
            {
                var resultado = await _StatusControleRepository.Deletar(id);

                return Ok("Deletado com sucesso!");
            }
            catch (Exception ex)
            {
               return BadRequest("Ocorreu um erro ao deletar: " + ex.Message);
            }
            
        }
        [HttpGet("Listar")]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var resultado = await _StatusControleRepository.Listar();

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
       