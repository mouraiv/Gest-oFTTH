import { TableGrid, TableGridMenu } from "./style";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

export default function DataGrid({ columns, rows, paginacao, pagina, left, right }) {
  return (
    <>
      <TableGridMenu>
        <div className="total"><p>{paginacao.total} Registros</p></div>
        <p>{pagina == 1 ? 1 : pagina - 1}</p>
        <p>&nbsp;-&nbsp;</p>
        <p>{paginacao.paginasCorrentes - 1}</p>
        <p>&nbsp;de&nbsp;</p>
        <p>{paginacao.totalPaginas}</p>
        <FaAngleLeft onClick={left} className="leftAngle" />
        <FaAngleRight onClick={right} className="rightAngle" />
      </TableGridMenu>
      <TableGrid>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name}>{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (         
            <tr key={rowIndex}>
              <td>{rowIndex + 1 * pagina}</td>
              {columns.slice(1).map((column) => (
                <td key={column.key}>{row[column.key] || "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </TableGrid>
    </>
  );
}
