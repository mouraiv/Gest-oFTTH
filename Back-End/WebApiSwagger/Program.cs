using Microsoft.OpenApi.Models;
using WebApiSwagger.Context;
using WebApiSwagger.Repository;
using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http.Features;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IEnderecoTotalRepository, EnderecoTotalRepository>();
builder.Services.AddScoped<IServicoAssociadoRepository, ServicoAssociadoRepository>();
builder.Services.AddScoped<IMaisDeUmaCDORepository, MaisDeUmaCDORepository>();
builder.Services.AddScoped<IInfoRepository, InfoRepository>();
builder.Services.AddScoped<ITesteOpticoRepository, TesteOpticoRepository>();
builder.Services.AddScoped<IMaterialRedeRepository, MaterialRedeRepository>();
builder.Services.AddScoped<ILigacaoRepository, LigacaoRepository>();
builder.Services.AddScoped<IBaseRepository, BaseRepository>();
builder.Services.AddScoped<IAnaliseRepository, AnaliseRepository>();
builder.Services.AddScoped<IEmpresaRepository, EmpresaRepository>();
builder.Services.AddScoped<ICargoRepository, CargoRepository>();
builder.Services.AddScoped<ITecnicoRepository, TecnicoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IDiretorioRepository, DiretorioRepository>();
builder.Services.AddScoped<IStatusAnaliseRepository, StatusAnaliseRepository>();
builder.Services.AddScoped<IStatusNetwinRepository, StatusNetwinRepository>();
builder.Services.AddScoped<IStatusControleRepository, StatusControleRepository>();
builder.Services.AddScoped<IStatusProjetoRepository, StatusProjetoRepository>();
builder.Services.AddScoped<IAnaliseCDOIARepository, AnaliseCDOIARepository>();
builder.Services.AddScoped<IValidacaoRepository, ValidacaoRepository>();
builder.Services.AddScoped<IStatusLoginRepository, StatusLoginRepository>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton<UploadXlsx>();
builder.Services.AddSingleton<ConversorDwg>();
builder.Services.AddSingleton<Paginacao>();
builder.Services.AddSingleton<PainelGanho>();
builder.Services.AddSingleton<IProgressoRepository, ProgressoRepository>();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDirectoryBrowser();

builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Gestão FTTH API",
                    Description = "API para execução de testes e gestão em telecomunição",
                    Contact = new OpenApiContact
                    {
                        Name = "Logictel S/A",
                        Url = new Uri("https://www.logictel.com.br"),
                    },
                    License = new OpenApiLicense
                    {
                        Name = "Microsoft .NET Framework",
                        Url = new Uri("https://www.microsoft.com/")
                    }
                });
                options.ResolveConflictingActions(x => x.First());
            });

builder.Services.AddDbContext<AppDbContext>
    (options => options.UseMySql(builder.Configuration.GetConnectionString("AppDbContext"), 
        new MySqlServerVersion(new Version(8, 0, 38))));

var key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("AppSettings:Secret").Value ?? "");    

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("E8c6jFXyTh#9Qaw$M*d5nJL2zR@WvbUZ")),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.Configure<FormOptions>(options => {
    options.MultipartBodyLengthLimit = 10737418240;
});

// Configura CORS
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

if (allowedOrigins == null || allowedOrigins.Length == 0)
{
    throw new Exception("Nenhum IP configurado no CORS");
}

// Adiciona a configuração CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options =>
    {
        options.SerializeAsV2 = false;
    });

    // Use SwaggerUI
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseCors("AllowSpecificOrigins");

app.UseAuthorization();

app.MapHub<ProgressoHub>("/progressoHub");

app.MapHub<ProgressoHubBase>("/progressoBase");

app.MapControllers();

app.Run();
