using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using WebApiSwagger.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;

namespace WebApiSwagger.Controllers
{
    [ApiController]
    [Route("Api/Usuario")]
   public class UsuarioController : Controller
    {
        private readonly IUsuarioRepository _UsuarioRepository;
  
        public UsuarioController(IUsuarioRepository UsuarioRepository)
        {
            _UsuarioRepository = UsuarioRepository;
        }

        [HttpPost("Cadastrar")]
        public async Task<IActionResult> Cadastrar(UsuarioView Usuario)
        {
            try
            {
                var modelo = new Usuario{
                    Login = Usuario.Login,
                    Senha = Usuario.Senha,
                    Tipo = Usuario.Tipo,
                    Publico = Usuario.Publico,
                };

                var resultado = await _UsuarioRepository.Inserir(modelo);
                          
                return Ok("Cadastrado com Sucesso");    
            }
            catch (Exception ex)
            {
                return BadRequest("Ocorreu um erro ao cadastrar: " + ex.Message);
            }
            
        }

        [HttpPut("Atualizar/{id}")]
        public async Task<IActionResult> Atualizar(int id, UsuarioView Usuario)
        {
            try
            {
                var modelo = new Usuario{
                    Login = Usuario.Login,
                    Senha = Usuario.Senha,
                    Tipo = Usuario.Tipo,
                    Publico = Usuario.Publico,
                };

                var resultado = await _UsuarioRepository.Editar(id, modelo);
                          
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
                var resultado = await _UsuarioRepository.Deletar(id);

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
                var resultado = await _UsuarioRepository.Listar();

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
       