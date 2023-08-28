using Microsoft.OpenApi.Models;
using WebApiSwagger.Context;
using WebApiSwagger.Repository;
using WebApiSwagger.Repository.Interface;
using WebApiSwagger.Utils;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IEnderecoTotalRepository, EnderecoTotalRepository>();
builder.Services.AddScoped<ITesteOpticoRepository, TesteOpticoRepository>();
builder.Services.AddSingleton<UploadXlsx>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:5226")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
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
    (options => options.UseSqlServer(builder.Configuration.GetConnectionString("AppDbContext")));      

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(options =>
    {
        options.SerializeAsV2 = true;
    });

    // Use SwaggerUI
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
