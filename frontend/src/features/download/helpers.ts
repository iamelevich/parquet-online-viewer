function escapeValueForCsv(value: any) {
  return typeof value === 'string' ? `"${value.replace('"', '""')}"` : value;
}

export function downloadCSV(
  data: Record<string, any>[] = [],
  filename: string = 'parquet',
) {
  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += data.length
    ? Object.keys(data[0]).map(escapeValueForCsv).join(',') + '\n'
    : '';
  csvContent += data
    .map((item) => Object.values(item).map(escapeValueForCsv).join(','))
    .join('\n')
    .replace(/(^\[)|(]$)/gm, '');
  const csvData = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', csvData);
  link.setAttribute('download', `${filename}.csv`);
  link.click();
}

export function downloadJSON(
  data: Record<string, any>[] = [],
  filename: string = 'parquet',
) {
  let jsonContent = 'data:text/json;charset=utf-8,';
  jsonContent += JSON.stringify(data, null, 2);
  const jsonData = encodeURI(jsonContent);
  const link = document.createElement('a');
  link.setAttribute('href', jsonData);
  link.setAttribute('download', `${filename}.json`);
  link.click();
}
