using WebApiSwagger.Models;
using Microsoft.EntityFrameworkCore;

namespace WebApiSwagger.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            //Database.SetCommandTimeout(1800);
        }

        public DbSet<Cargo> Cargos => Set<Cargo>();
        public DbSet<Analise> Analises => Set<Analise>();
        public DbSet<Empresa> Empresas => Set<Empresa>();
        public DbSet<EnderecoTotal> EnderecosTotais => Set<EnderecoTotal>();
        public DbSet<Tecnico> Tecnicos => Set<Tecnico>();
        public DbSet<TesteOptico> TestesOpticos => Set<TesteOptico>();
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<StatusAnalise> StatusAnalises => Set<StatusAnalise>();
        public DbSet<AnaliseCDOIA> AnaliseCDOIAs => Set<AnaliseCDOIA>();
        public DbSet<StatusControle> StatusControles => Set<StatusControle>();
        public DbSet<StatusNetwin> StatusNetwins => Set<StatusNetwin>();
        public DbSet<StatusProjeto> StatusProjetos => Set<StatusProjeto>();

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
                .HasMany(t => t.Analises)
                .WithOne()
                .HasForeignKey(a => a.Id_TesteOptico);

            modelBuilder.Entity<Analise>()
                .HasMany(a => a.AnaliseCDOIAs)
                .WithOne()
                .HasForeignKey(ac => ac.Id_Analise);
                                  
            modelBuilder.Entity<Usuario>()
                 .HasOne(p => p.GetTecnico)
                 .WithOne()
                 .HasForeignKey<Tecnico>(p => p.Id_Tecnico);

            modelBuilder.Entity<Tecnico>()
                 .HasOne(p => p.GetCargo)
                 .WithMany()
                 .HasForeignKey(p => p.Id_Cargo);

            modelBuilder.Entity<Tecnico>()
                 .HasOne(p => p.GetEmpresa)
                 .WithMany()
                 .HasForeignKey(p => p.Id_Empresa); 

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
