import { PDFPage, rgb } from 'pdf-lib';

export interface TableColumn {
  title: string;
  x: number;
  width: number;
}

export interface TableRow {
  values: string[];
}

export interface TableOptions {
  page: PDFPage;
  startX: number;
  startY: number;
  rowHeight: number;
  columns: TableColumn[];
  rows: TableRow[];
}

export default function drawTable(options: TableOptions) {
  const {
    page,
    startX,
    startY,
    rowHeight,
    columns,
    rows,
  } = options;

  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
  let cursorY = startY;

  // Draw header row background
  page.drawRectangle({
    x: startX,
    y: cursorY - rowHeight,
    width: tableWidth,
    color: rgb(0.9,0.9,0.9),
  });

  // Draw Header text
  columns.forEach((col, i) => {
    page.drawText(col.title, {
      x: startX + col.x + 4,
      y: cursorY - rowHeight + 8,
      size: 12,
    });
  });

  // Draw header borders
  page.drawLine({ start: { x: startX, y: cursorY }, end: { x: startX + tableWidth, y: cursorY } });
  page.drawLine({ start: { x: startX, y: cursorY - rowHeight }, end: { x: startX + tableWidth, y: cursorY - rowHeight } });
  columns.forEach((col) => {
    page.drawLine({
      start: { x: startX + col.x, y: cursorY },
      end: { x: startX + col.x, y: cursorY - rowHeight },
    });
  });
  page.drawLine({
    start: { x: startX + tableWidth, y: cursorY },
    end: { x: startX + tableWidth, y: cursorY - rowHeight },
  });

  cursorY -= rowHeight;

  // draws row data
  rows.forEach((row) => {
    page.drawLine({ start: { x: startX, y: cursorY }, end: { x: startX + tableWidth, y: cursorY } });
    page.drawLine({ start: { x: startX, y: cursorY - rowHeight }, end: { x: startX + tableWidth, y: cursorY - rowHeight } });

    columns.forEach((col, i) => {
      page.drawLine({
        start: { x: startX + col.x, y: cursorY },
        end: { x: startX + col.x, y: cursorY - rowHeight },
      });
      page.drawText(row.values[i], {
        x: startX + col.x + 4,
        y: cursorY - rowHeight + 8,
        size: 12,
      });

    });

    page.drawLine({
      start: { x: startX + tableWidth, y: cursorY },
      end: { x: startX + tableWidth, y: cursorY - rowHeight },
    });

    cursorY -= rowHeight;
  });
}

