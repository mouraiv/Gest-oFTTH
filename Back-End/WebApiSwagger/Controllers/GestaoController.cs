using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/Gestao")]
   public class GestaoController : Controller
    {
        private readonly IGestaoRepository _GestaoRepository;
  
        public GestaoController(IGestaoRepository GestaoRepository)
        {
            _GestaoRepository = GestaoRepository;
        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(Gestao Gestao)
        {
            try
            {
                var resultado = await _GestaoRepository.Inserir(Gestao);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, Gestao Gestao)
        {
            try
            {
                
                var resultado = await _GestaoRepository.Editar(id, Gestao);
                          
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
                var resultado = await _GestaoRepository.Deletar(id);

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
                var resultado = await _GestaoRepository.Listar();

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
       