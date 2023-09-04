using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using WebApiSwagger.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/Tecnico")]
   public class TecnicoController : Controller
    {
        private readonly ITecnicoRepository _TecnicoRepository;
  
        public TecnicoController(ITecnicoRepository TecnicoRepository)
        {
            _TecnicoRepository = TecnicoRepository;
        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(TecnicoView Tecnico)
        {
            try
            {
                var modelo = new Tecnico{
                    Nome = Tecnico.Nome,
                    Email = Tecnico.Email,
                    Id_Cargo = Tecnico.Id_Cargo,
                    Id_Empresa = Tecnico.Id_Empresa,        
                };

                var resultado = await _TecnicoRepository.Inserir(modelo);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, TecnicoView Tecnico)
        {
            try
            {
                var modelo = new Tecnico{
                    Nome = Tecnico.Nome,
                    Email = Tecnico.Email,
                    Id_Cargo = Tecnico.Id_Cargo,
                    Id_Empresa = Tecnico.Id_Empresa
                };

                var resultado = await _TecnicoRepository.Editar(id, modelo);
                          
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
                var resultado = await _TecnicoRepository.Deletar(id);

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
                var resultado = await _TecnicoRepository.Listar();

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
       