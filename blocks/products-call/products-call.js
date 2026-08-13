export default async function decorate(block) {
  // Extract URL from block content
  const link = block.querySelector('a');
  const paragraph = block.querySelector('p');
  const url = link?.href || paragraph?.textContent?.trim();

  if (!url) {
    block.innerHTML = '<p style="color: red;">No URL provided for table data</p>';
    return;
  }

  // Show loading state
  block.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      block.innerHTML = '<p>No data to display</p>';
      return;
    }

    // Extract column names from first object
    const columns = Object.keys(data[0]);

    // Create table structure
    const table = document.createElement('table');
    table.className = 'products-call-table';

    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    columns.forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col.charAt(0).toUpperCase() + col.slice(1);
      headerRow.append(th);
    });
    thead.append(headerRow);
    table.append(thead);

    // Create body rows
    const tbody = document.createElement('tbody');
    data.forEach((row) => {
      const tr = document.createElement('tr');
      columns.forEach((col) => {
        const td = document.createElement('td');
        const value = row[col];
        if (typeof value === 'number' && col.toLowerCase() === 'price') {
          td.textContent = `$${value.toFixed(2)}`;
        } else {
          td.textContent = value;
        }
        tr.append(td);
      });
      tbody.append(tr);
    });
    table.append(tbody);

    // Replace block content with table
    block.replaceChildren(table);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch table data:', error);
    block.innerHTML = '<p style="color: red;">Failed to load table data. Check console for details.</p>';
  }
}
