using WebApiSwagger.Models;
using Microsoft.EntityFrameworkCore;
using WebApiSwagger.Models.ViewModel;

namespace WebApiSwagger.Context
{
    public class AppDbContext : DbContext
    {
        public static readonly ILoggerFactory MyLoggerFactory
        = LoggerFactory.Create(builder => { builder.AddConsole(); });
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            Database.SetCommandTimeout(10800); 
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(MyLoggerFactory) 
                .EnableSensitiveDataLogging();
        }

        public DbSet<Cargo> Cargos => Set<Cargo>();
        public DbSet<Info> Infos => Set<Info>();
        public DbSet<Diretorio> Diretorios => Set<Diretorio>();
        public DbSet<Analise> Analises => Set<Analise>();
        public DbSet<Empresa> Empresas => Set<Empresa>();
        public DbSet<EnderecoTotal> EnderecosTotais => Set<EnderecoTotal>();
        public DbSet<MaterialRede> MateriaisRedes => Set<MaterialRede>();
        public DbSet<EnderecoTotalDropListView> DropEnderecosTotais  => Set<EnderecoTotalDropListView>();
        public DbSet<Ligacao> Ligacoes => Set<Ligacao>();
        public DbSet<ServicoAssociado> ServicoAssociados => Set<ServicoAssociado>();
        public DbSet<MaisDeUmaCDO> MaisDeUmaCDOs => Set<MaisDeUmaCDO>();
        public DbSet<Tecnico> Tecnicos => Set<Tecnico>();
        public DbSet<Validacao> Validacoes => Set<Validacao>();
        public DbSet<TesteOptico> TestesOpticos => Set<TesteOptico>();
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<StatusAnalise> StatusAnalises => Set<StatusAnalise>();
        public DbSet<AnaliseCDOIA> AnaliseCDOIAs => Set<AnaliseCDOIA>();
        public DbSet<StatusControle> StatusControles => Set<StatusControle>();
        public DbSet<StatusLogin> StatusLogins => Set<StatusLogin>();
        public DbSet<StatusNetwin> StatusNetwins => Set<StatusNetwin>();
        public DbSet<StatusProjeto> StatusProjetos => Set<StatusProjeto>();
        public DbSet<ViewStatusGanho> ViewStatusGanhos => Set<ViewStatusGanho>();
        
        public override int SaveChanges()
        {
            // converte todas as propriedades de string em caixa alta antes de salvar
            foreach (var entry in ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified))
            {
                foreach (var property in entry.CurrentValues.Properties.Where(p => p.ClrType == typeof(string)))
                {
                    var currentValue = (string?)entry.CurrentValues[property];
                    if (!string.IsNullOrEmpty(currentValue))
                    {
                        entry.CurrentValues[property] = currentValue.ToUpperInvariant();
                    }
                }
            }

            return base.SaveChanges();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //ENTIDADES TESTE OPTICOS
            modelBuilder.Entity<TesteOptico>()
                .HasOne(t => t.MaterialRede)
                .WithOne()
                .HasForeignKey<TesteOptico>(p => p.Id_MaterialRede);

             modelBuilder.Entity<TesteOptico>()
                .HasMany(p => p.Validacoes) 
                .WithOne()
                .HasForeignKey(v => v.Id_TesteOptico)
                .OnDelete(DeleteBehavior.Cascade);  
                
            modelBuilder.Entity<TesteOptico>()
                .HasMany(p => p.Analises)
                .WithOne()
                .HasForeignKey(a => a.Id_TesteOptico)
                .OnDelete(DeleteBehavior.Cascade);
                
             modelBuilder.Entity<TesteOptico>()
                .HasMany(p => p.AnaliseCDOIAs)
                .WithOne()
                .HasForeignKey(a => a.Id_TesteOptico)
                .OnDelete(DeleteBehavior.Cascade);

            //ENTIDADES DO NETWIN
            modelBuilder.Entity<EnderecoTotal>()
                .HasOne(t => t.MaterialRede)
                .WithMany(t => t.EnderecoTotal)
                .HasForeignKey(p => p.Id_MaterialRede);      

            modelBuilder.Entity<ServicoAssociado>()
                .HasOne(t => t.EnderecosTotais)
                .WithMany(p => p.ServicosAssociados)
                .HasForeignKey(p => p.Id_EnderecoTotal);      

            modelBuilder.Entity<Ligacao>()
                .HasOne(t => t.MaterialRede)
                .WithMany(p => p.Ligacao)
                .HasForeignKey(p => p.Id_MaterialRede);

            //ENTIDADES DO SISTEMA
            modelBuilder.Entity<Usuario>()
                 .HasOne(p => p.GetTecnico)
                 .WithOne()
                 .HasForeignKey<Tecnico>(p => p.Id_Tecnico);

            modelBuilder.Entity<Usuario>()
                 .HasOne(p => p.StatusLogin)
                 .WithOne()
                 .HasForeignKey<StatusLogin>(p => p.Id_Usuario);     

            modelBuilder.Entity<Tecnico>()
                 .HasOne(p => p.GetCargo)
                 .WithMany()
                 .HasForeignKey(p => p.Id_Cargo);

            modelBuilder.Entity<Tecnico>()
                 .HasOne(p => p.GetEmpresa)
                 .WithMany()
                 .HasForeignKey(p => p.Id_Empresa);

            modelBuilder.Entity<EnderecoTotalDropListView>()
            .HasKey(p => p.Id_DropEnderecosTotais);

            modelBuilder.Entity<ViewStatusGanho>().HasNoKey();
            
            modelBuilder.Entity<Diretorio>().HasKey(k => k.Id_Diretorio);

            modelBuilder.Entity<TesteOptico>().HasKey(k => k.Id_TesteOptico);

            base.OnModelCreating(modelBuilder);
        }
    }
}
