// Select form and table body
const form = document.getElementById('job-form');
const companyInput = document.getElementById('company');
const positionInput = document.getElementById('position');
const statusSelect = document.getElementById('status');
const dateInput = document.getElementById('date');          // NEW: date field
const jobTableBody = document.querySelector('#job-list tbody');

// Track which row is being edited
let rowBeingEdited = null;

// Utility: create a cell with text
function createCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}

// Handle form submit (Add / Update)
form.addEventListener('submit', function (event) {
  event.preventDefault();

  const company = companyInput.value.trim();
  const position = positionInput.value.trim();
  const status = statusSelect.value;
  const dateValue = dateInput.value; // format: YYYY-MM-DD

  if (!company || !position || !status || !dateValue) {
    alert('Please fill all the fields.');
    return;
  }

  // Date ko readable format me dikhana
  const formattedDate = new Date(dateValue).toLocaleDateString();

  if (rowBeingEdited) {
    // ------- Update existing row -------
    const cells = rowBeingEdited.querySelectorAll('td');

    const companyCell = cells[0];
    const positionCell = cells[1];
    const statusCell = cells[2];
    const dateCell = cells[3];

    companyCell.textContent = company;
    positionCell.textContent = position;

    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    statusCell.textContent = formattedStatus;

    // purani status classes hatao
    statusCell.className = '';
    statusCell.classList.add(`status-${status}`);

    dateCell.textContent = formattedDate;

    // reset edit state
    rowBeingEdited = null;
    form.querySelector('button[type="submit"]').textContent = 'Add Application';
  } else {
    // ------- Add new row -------
    const row = document.createElement('tr');

    // Company & position cells
    const companyCell = createCell(company);
    const positionCell = createCell(position);
    row.appendChild(companyCell);
    row.appendChild(positionCell);

    // Status cell with class
    const statusCell = document.createElement('td');
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    statusCell.textContent = formattedStatus;
    statusCell.classList.add(`status-${status}`);
    row.appendChild(statusCell);

    // Date cell
    const dateCell = createCell(formattedDate);
    row.appendChild(dateCell);

    // Actions cell (Edit + Delete buttons)
    const actionsCell = document.createElement('td');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-btn');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);
    row.appendChild(actionsCell);

    // Add row to table
    jobTableBody.appendChild(row);

    // Edit button logic
    editButton.addEventListener('click', function () {
      rowBeingEdited = row;

      companyInput.value = companyCell.textContent;
      positionInput.value = positionCell.textContent;
      statusSelect.value = status.toLowerCase();

      // date ko dobara YYYY-MM-DD format me convert
      const currentDate = new Date(dateCell.textContent);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      dateInput.value = `${year}-${month}-${day}`;

      form.querySelector('button[type="submit"]').textContent = 'Update Application';
    });

    // Delete button logic
    deleteButton.addEventListener('click', function () {
      row.remove();

      // agar edit mode me tha aur wahi row delete hui
      if (rowBeingEdited === row) {
        rowBeingEdited = null;
        form.reset();
        form.querySelector('button[type="submit"]').textContent = 'Add Application';
      }
    });
  }

  // Form clear karo
  form.reset();
});
