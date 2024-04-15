using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Models;
using WebApiSwagger.Models.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

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
        
        [HttpGet("TestarUsuario")]
        public async Task<IActionResult> TestarUsuario([FromQuery] string? login)
        {
            try
            {
                var resultado = await _UsuarioRepository.VerificarUsuario(login ?? "");

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

        [HttpPost("Verificar")]
        public async Task<IActionResult> VerificarUsuario([FromBody] UsuarioView usuario)
        {
            Usuario usuarioExiste = await _UsuarioRepository.VerificarUsuario(usuario.Login ?? "");

            if (usuarioExiste.Login == usuario.Login)
            {
                if(usuarioExiste.Senha == usuario.Senha){
                // Crie as claims do usuário
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name, usuario.Login ?? ""), // Adicione outras informações do usuário, se necessário
                };

                // Configure a chave e as credenciais para a geração do token
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("E8c6jFXyTh#9Qaw$M*d5nJL2zR@WvbUZ"));
                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                // Configure as informações do token
                var token = new JwtSecurityToken(
                    issuer: "gestao_ftth",
                    audience: "gestao_ftth_react",
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(1), // Defina o tempo de expiração do token
                    signingCredentials: credentials
                );

                var chave = new JwtSecurityTokenHandler().WriteToken(token);

                var user = new {
                    id = usuarioExiste.Id_Usuario,
                    login = usuarioExiste.Login,
                    nome = usuarioExiste.GetTecnico?.Nome,
                    email = usuarioExiste.GetTecnico?.Email,
                    cargo = usuarioExiste.GetTecnico?.GetCargo?.Nome,
                    empresa = usuarioExiste.GetTecnico?.GetEmpresa?.Nome,
                    tipo = usuarioExiste.Tipo,
                    online = usuarioExiste.StatusLogin?.Status,
                    error = usuarioExiste.Error,
                    token = chave
                };
                
                return Ok(user);

                }else{
                    return Ok(new { pws = false });

                }
            
            }
            else
            {
                // O usuário não existe
                return Ok(new { login = false });
            }
        }
    }
}
       