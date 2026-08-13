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

    // Store original data for reset functionality
    const originalData = JSON.parse(JSON.stringify(data));
    const editedData = JSON.parse(JSON.stringify(data));

    // Create container
    const container = document.createElement('div');
    container.className = 'products-call-container';

    // Create controls
    const controls = document.createElement('div');
    controls.className = 'products-call-controls';

    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'products-call-grid';

    // Define render function
    const renderGrid = () => {
      grid.innerHTML = '';
      editedData.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'products-call-card';

        columns.forEach((col) => {
          const field = document.createElement('div');
          field.className = 'products-call-field';

          const label = document.createElement('div');
          label.className = 'products-call-label';
          label.textContent = col.charAt(0).toUpperCase() + col.slice(1);

          const value = document.createElement('div');
          value.className = 'products-call-value';
          value.contentEditable = 'true';
          value.role = 'textbox';
          value.setAttribute('aria-label', `Edit ${col}`);

          const currentValue = item[col];
          if (typeof currentValue === 'number' && col.toLowerCase() === 'price') {
            value.textContent = `$${currentValue.toFixed(2)}`;
          } else {
            value.textContent = currentValue;
          }

          // Track edits
          value.addEventListener('input', () => {
            value.classList.add('products-call-edited');
            let newValue = value.textContent.trim();

            if (col.toLowerCase() === 'price') {
              newValue = parseFloat(newValue.replace('$', '')) || 0;
            }

            editedData[index][col] = newValue;
          });

          value.addEventListener('blur', () => {
            // Format price on blur
            if (col.toLowerCase() === 'price') {
              const numValue = parseFloat(value.textContent.replace('$', '')) || 0;
              value.textContent = `$${numValue.toFixed(2)}`;
            }
          });

          field.append(label, value);
          card.append(field);
        });

        grid.append(card);
      });
    };

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Changes';
    saveBtn.className = 'products-call-btn products-call-btn-save';
    saveBtn.addEventListener('click', () => {
      // eslint-disable-next-line no-console
      console.log('Edited data:', editedData);
      saveBtn.textContent = 'Changes saved!';
      setTimeout(() => {
        saveBtn.textContent = 'Save Changes';
      }, 2000);
    });

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.className = 'products-call-btn products-call-btn-reset';
    resetBtn.addEventListener('click', () => {
      Object.assign(editedData, JSON.parse(JSON.stringify(originalData)));
      renderGrid();
    });

    controls.append(saveBtn, resetBtn);
    container.append(controls);

    renderGrid();
    container.append(grid);
    block.replaceChildren(container);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch table data:', error);
    block.innerHTML = '<p style="color: red;">Failed to load table data. Check console for details.</p>';
  }
}
