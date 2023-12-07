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
            Database.SetCommandTimeout(1800);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLoggerFactory(MyLoggerFactory) 
                .EnableSensitiveDataLogging();
        }

        public DbSet<Cargo> Cargos => Set<Cargo>();
        public DbSet<Info> Infos => Set<Info>();
        public DbSet<Analise> Analises => Set<Analise>();
        public DbSet<Empresa> Empresas => Set<Empresa>();
        public DbSet<EnderecoTotal> EnderecosTotais => Set<EnderecoTotal>();
        public DbSet<MaterialRede> MateriaisRedes => Set<MaterialRede>();
        public DbSet<Ligacao> Ligacoes => Set<Ligacao>();
        public DbSet<Tecnico> Tecnicos => Set<Tecnico>();
        public DbSet<Validacao> Validacoes => Set<Validacao>();
        public DbSet<TesteOptico> TestesOpticos => Set<TesteOptico>();
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<StatusAnalise> StatusAnalises => Set<StatusAnalise>();
        public DbSet<AnaliseCDOIA> AnaliseCDOIAs => Set<AnaliseCDOIA>();
        public DbSet<StatusControle> StatusControles => Set<StatusControle>();
        public DbSet<StatusNetwin> StatusNetwins => Set<StatusNetwin>();
        public DbSet<StatusProjeto> StatusProjetos => Set<StatusProjeto>();
        public DbSet<ViewStatusGanho> ViewStatusGanhos => Set<ViewStatusGanho>();
        public DbSet<ViewStatusGanhoDia> ViewStatusGanhosDias => Set<ViewStatusGanhoDia>();

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
            modelBuilder.Entity<TesteOptico>()
                .HasOne(t => t.MaterialRede)
                .WithOne()
                .HasForeignKey<TesteOptico>(p => p.Id_MaterialRede);

             modelBuilder.Entity<TesteOptico>()
                .HasMany(p => p.Validacoes) 
                .WithOne()
                .HasForeignKey(v => v.Id_TesteOptico);   
                
            modelBuilder.Entity<TesteOptico>()
                .HasOne(t => t.Analises)
                .WithOne()
                .HasForeignKey<Analise>(a => a.Id_TesteOptico);

            modelBuilder.Entity<Analise>()
                .HasMany(a => a.AnaliseCDOIAs)
                .WithOne()
                .HasForeignKey(ac => ac.Id_Analise)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EnderecoTotal>()
                .HasOne(t => t.MaterialRede)
                .WithMany(p => p.EnderecoTotal)
                .HasForeignKey(p => p.Id_MaterialRede);  

            modelBuilder.Entity<MaterialRede>()
                .HasOne(t => t.Ligacao)
                .WithOne()
                .HasForeignKey<Ligacao>(p => p.Id_MaterialRede);
                   
            modelBuilder.Entity<Usuario>()
                 .HasOne(p => p.GetTecnico)
                 .WithOne()
                 .HasForeignKey<Tecnico>(p => p.Id_Tecnico);

            modelBuilder.Entity<Tecnico>()
                 .HasOne(p => p.GetCargo)
                 .WithOne()
                 .HasForeignKey<Tecnico>(p => p.Id_Cargo);

            modelBuilder.Entity<Tecnico>()
                 .HasOne(p => p.GetEmpresa)
                 .WithOne()
                 .HasForeignKey<Tecnico>(p => p.Id_Empresa);

            modelBuilder.Entity<ViewStatusGanho>().HasNoKey();
            
            modelBuilder.Entity<ViewStatusGanhoDia>().HasNoKey();

           /* modelBuilder.Entity<EnderecoTotal>()
                .Property(e => e.Latitude)
                .HasColumnType("decimal(9, 6)"); 

            modelBuilder.Entity<EnderecoTotal>()
                .Property(e => e.Longitude)
                .HasColumnType("decimal(9, 6)");*/

            base.OnModelCreating(modelBuilder);
        }
    }
}
