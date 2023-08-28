using OfficeOpenXml;

namespace WebApiSwagger.Utils
{
    public class UploadXlsx
    {
        public int IndexColumn {get; set;} 
        public int IndexRow {get; set;} 
        public int LinhasPreenchidas {get; set;}
        public ExcelWorksheet? Worksheet {get; set;}

        public void Carregar(Stream stream, int IndexColumn, int IndexRow){
            
            LinhasPreenchidas = 0;

            var package = new ExcelPackage(stream);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            Worksheet = package.Workbook.Worksheets[0];

            //Validar arquivo xlsx de importar
            var totalRows = Worksheet.Dimension.End.Row;
            var totalColumns = IndexColumn;

            //Verificar celulas correspondentes
            for (int row = IndexRow; row <= totalRows; row++)
            {
                bool TamanhoTotalXlsx = false;

                for (int col = IndexColumn; col <= totalColumns; col++)
                {
                    var cellValue = Worksheet.Cells[row, col].Value;
                    if (cellValue != null && !string.IsNullOrWhiteSpace(cellValue.ToString()))
                    {
                        TamanhoTotalXlsx = true;
                        break;
                    }
                }
                if (TamanhoTotalXlsx)
                {
                    LinhasPreenchidas++;
                }

            }

        }

    }

}