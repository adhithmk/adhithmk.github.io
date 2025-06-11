// Initialize Quill editor for rich text content
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean']
];

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: toolbarOptions
  }
});

// Admin System - Section Management

// Define section schemas
class SectionSchema {
  static profile = {
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'tagline', type: 'text', label: 'Tagline', required: true },
      { name: 'academic_background', type: 'textarea', label: 'Academic Background', required: true },
      { name: 'about_text', type: 'textarea', label: 'About Text', required: true }
    ]
  };

  static certifications = {
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'institution', type: 'text', label: 'Institution', required: true },
      { name: 'date', type: 'date', label: 'Date', required: true }
    ]
  };

  static education = {
    fields: [
      { name: 'degree', type: 'text', label: 'Degree', required: true },
      { name: 'institution', type: 'text', label: 'Institution', required: true },
      { name: 'startDate', type: 'date', label: 'Start Date', required: true },
      { name: 'endDate', type: 'date', label: 'End Date', required: true }
    ]
  };

  static awards = {
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'institution', type: 'text', label: 'Institution', required: true },
      { name: 'date', type: 'date', label: 'Date', required: true }
    ]
  };

  static publications = {
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'authors', type: 'text', label: 'Authors', required: true },
      { name: 'journal', type: 'text', label: 'Journal', required: true },
      { name: 'year', type: 'number', label: 'Year', required: true }
    ]
  };

  static blog = {
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'category', type: 'select', label: 'Category', required: true, options: [
        'research', 'technology', 'fieldwork', 'data-science', 'conservation', 'diy'
      ]},
      { name: 'tags', type: 'text', label: 'Tags (comma-separated)', required: true },
      { name: 'content', type: 'richtext', label: 'Content', required: true }
    ]
  };

  static projects = {
    fields: [
      { name: 'title', type: 'text', label: 'Title', required: true },
      { name: 'description', type: 'textarea', label: 'Description', required: true },
      { name: 'technologies', type: 'text', label: 'Technologies', required: true },
      { name: 'duration', type: 'text', label: 'Duration', required: true },
      { name: 'status', type: 'text', label: 'Status', required: true }
    ]
  };

  static extracurricular = {
    fields: [
      { name: 'name', type: 'text', label: 'Name', required: true },
      { name: 'role', type: 'text', label: 'Role', required: true },
      { name: 'duration', type: 'text', label: 'Duration', required: true },
      { name: 'description', type: 'textarea', label: 'Description', required: true }
    ]
  };

  static contact = {
    fields: [
      { name: 'email', type: 'email', label: 'Email', required: true },
      { name: 'phone', type: 'text', label: 'Phone', required: true },
      { name: 'location', type: 'text', label: 'Location', required: true },
      { name: 'social_links', type: 'text', label: 'Social Links', required: true }
    ]
  };
}

// CRUD Operations
class SectionManager {
  constructor() {
    this.sections = [
      'certifications',
      'education',
      'awards',
      'publications',
      'blog',
      'profile',
      'projects',
      'extracurricular',
      'contact'
    ];
  }

  // Initialize section
  async initSection(section) {
    try {
      const response = await fetch(`http://localhost:8000/${section}`);
      if (!response.ok) {
        throw new Error('Failed to initialize section');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error initializing section:', error);
      return [];
    }
  }

  // Get all items
  async getAll(section) {
    try {
      const response = await fetch(`http://localhost:8000/${section}`);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  }

  // Add item
  async add(section, item) {
    try {
      const response = await fetch(`http://localhost:8000/${section}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

  // Update item
  async update(section, id, updates) {
    try {
      const response = await fetch(`http://localhost:8000/${section}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  // Delete item
  async delete(section, id) {
    try {
      const response = await fetch(`http://localhost:8000/${section}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
}

// UI Components
class SectionUI {
  constructor() {
    this.manager = new SectionManager();
    this.initializeTabs();
    this.initializeForms();
  }

  // Initialize tabs
  initializeTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => this.showTab(tab.dataset.tab));
    });
  }

  // Show tab
  showTab(tabId) {
    // Hide all panels
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    // Show selected panel
    document.getElementById(tabId).classList.add('active');
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // Load data for this section
    this.loadSectionData(tabId);
  }

  // Initialize forms
  initializeForms() {
    this.manager.sections.forEach(section => {
      const form = document.getElementById(`${section}-form`);
      if (form) {
        form.addEventListener('submit', (e) => this.handleSubmit(e, section));
      }
    });
  }

  // Handle form submission
  async handleSubmit(e, section) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const item = {};

    // Get schema for this section
    const schema = SectionSchema[section];
    if (!schema) return;

    // Validate and collect data
    for (const field of schema.fields) {
      const value = formData.get(field.name);
      if (field.required && !value) {
        alert(`Please fill in ${field.label}`);
        return;
      }
      item[field.name] = value;
    }

    try {
      // Add unique ID
      item.id = Date.now().toString();

      // Save to backend API
      await this.manager.add(section, item);
      
      // Update UI
      this.loadSectionData(section);
      
      // Show success message
      if (section === 'profile') {
        const successAlert = document.createElement('div');
        successAlert.className = 'alert success';
        successAlert.textContent = 'Profile updated successfully!';
        document.body.appendChild(successAlert);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
          successAlert.remove();
        }, 3000);
      } else {
        alert('Item added successfully!');
      }
      
      // Reset form
      e.target.reset();
    } catch (error) {
      console.error('Error adding item:', error);
      const errorAlert = document.createElement('div');
      errorAlert.className = 'alert error';
      errorAlert.textContent = 'Error adding item. Please try again.';
      document.body.appendChild(errorAlert);
      
      // Remove alert after 3 seconds
      setTimeout(() => {
        errorAlert.remove();
      }, 3000);
    }
  }

  // Load section data
  async loadSectionData(section) {
    try {
      const items = await this.manager.getAll(section);
      const container = document.getElementById(`${section}-items`);
      if (!container) return;

      // Clear existing items
      container.innerHTML = '';

      // Get schema for this section
      const schema = SectionSchema[section];
      if (!schema) return;

      // Create items
      items.forEach(item => {
        const itemElement = this.createItemElement(item, schema);
        container.appendChild(itemElement);
      });
    } catch (error) {
      console.error('Error loading section data:', error);
      alert('Error loading data. Please try again.');
    }
  }

  // Create item element
  createItemElement(item, schema) {
    const itemElement = document.createElement('div');
    itemElement.className = 'item-card';

    // Create content based on schema
    let content = '';
    schema.fields.forEach(field => {
      if (field.name in item) {
        content += `<p class="item-${field.name}">${item[field.name]}</p>`;
      }
    });

    itemElement.innerHTML = `
      <div class="item-content">${content}</div>
      <div class="item-actions">
        <button class="edit-btn" onclick="editItem('${item.id}', '${section}')">Edit</button>
        <button class="delete-btn" onclick="deleteItem('${item.id}', '${section}')">Delete</button>
      </div>
    `;

    return itemElement;
  }
}

// Initialize admin system
const admin = new SectionUI();

// Edit item function
function editItem(id, section) {
  admin.manager.getAll(section).then(items => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    // Populate form with item data
    const form = document.getElementById(`${section}-form`);
    if (form) {
      const schema = SectionSchema[section];
      if (schema) {
        schema.fields.forEach(field => {
          const input = form.querySelector(`[name="${field.name}"]`);
          if (input) {
            input.value = item[field.name];
          }
        });
      }
    }
  });
}

// Delete item function
function deleteItem(id, section) {
  if (confirm('Are you sure you want to delete this item?')) {
    admin.manager.delete(section, id).then(() => {
      admin.loadSectionData(section);
      alert('Item deleted successfully!');
    });
  }
}

// Initialize all sections
async function initializeAdmin() {
  await initializeProfile();
  await initializeProjects();
  await initializeExtraCurricular();
  await initializeContact();
  await initializeBlog();
  await initializeCertifications();
  await initializeEducation();
  await initializeAwards();
  await initializePublications();
}

// Projects section
async function initializeProjects() {
  try {
    const projects = await fetchProjects();
    displayProjects(projects);
    setupProjectForm();
  } catch (error) {
    displayError("Failed to load projects");
  }
}

async function fetchProjects() {
  const response = await fetch('http://localhost:8000/api/projects');
  if (!response.ok) throw new Error('Failed to fetch projects');
  return await response.json();
}

function displayProjects(projects) {
  const container = document.getElementById('projects-items');
  container.innerHTML = projects.map(project => `
    <div class="item-card">
      <h3>${project.title}</h3>
      <p>Status: ${project.status}</p>
      <p>Technologies: ${project.technologies.join(', ')}</p>
      <button onclick="editProject(${project.id})" class="btn btn-secondary">Edit</button>
      <button onclick="deleteProject(${project.id})" class="btn btn-danger">Delete</button>
    </div>
  `).join('');
}

function setupProjectForm() {
  const form = document.getElementById('project-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const project = {
      title: formData.get('title'),
      description: formData.get('description'),
      technologies: formData.get('technologies').split(','),
      duration: formData.get('duration'),
      status: formData.get('status')
    };
    
    try {
      await createProject(project);
      form.reset();
      displaySuccess("Project added successfully!");
      await initializeProjects();
    } catch (error) {
      displayError("Failed to add project");
    }
  });
}

async function createProject(project) {
  const response = await fetch('http://localhost:8000/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(project)
  });
  if (!response.ok) throw new Error('Failed to create project');
}

// Extra-Curricular section
async function initializeExtraCurricular() {
  try {
    const activities = await fetchExtraCurricular();
    displayExtraCurricular(activities);
    setupExtraCurricularForm();
  } catch (error) {
    displayError("Failed to load extra-curricular activities");
  }
}

async function fetchExtraCurricular() {
  const response = await fetch('http://localhost:8000/api/extracurricular');
  if (!response.ok) throw new Error('Failed to fetch extra-curricular activities');
  return await response.json();
}

function displayExtraCurricular(activities) {
  const container = document.getElementById('extracurricular-items');
  container.innerHTML = activities.map(activity => `
    <div class="item-card">
      <h3>${activity.name}</h3>
      <p>Role: ${activity.role}</p>
      <p>Duration: ${activity.duration}</p>
      <button onclick="editActivity(${activity.id})" class="btn btn-secondary">Edit</button>
      <button onclick="deleteActivity(${activity.id})" class="btn btn-danger">Delete</button>
    </div>
  `).join('');
}

function setupExtraCurricularForm() {
  const form = document.getElementById('extracurricular-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const activity = {
      name: formData.get('name'),
      role: formData.get('role'),
      duration: formData.get('duration'),
      description: formData.get('description')
    };
    
    try {
      await createExtraCurricular(activity);
      form.reset();
      displaySuccess("Activity added successfully!");
      await initializeExtraCurricular();
    } catch (error) {
      displayError("Failed to add activity");
    }
  });
}

async function createExtraCurricular(activity) {
  const response = await fetch('http://localhost:8000/api/extracurricular', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(activity)
  });
  if (!response.ok) throw new Error('Failed to create extra-curricular activity');
}

// Contact section
async function initializeContact() {
  try {
    const contactInfo = await fetchContact();
    displayContact(contactInfo);
    setupContactForm();
  } catch (error) {
    displayError("Failed to load contact information");
  }
}

async function fetchContact() {
  const response = await fetch('http://localhost:8000/api/contact');
  if (!response.ok) throw new Error('Failed to fetch contact information');
  return await response.json();
}

function displayContact(contactInfo) {
  const container = document.getElementById('contact-items');
  container.innerHTML = contactInfo.map(contact => `
    <div class="item-card">
      <p>Email: ${contact.email}</p>
      <p>Phone: ${contact.phone}</p>
      <p>Location: ${contact.location}</p>
      <p>Social Links: ${JSON.stringify(contact.social_links)}</p>
      <button onclick="editContact(${contact.id})" class="btn btn-secondary">Edit</button>
    </div>
  `).join('');
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const contact = {
      email: formData.get('email'),
      phone: formData.get('phone'),
      location: formData.get('location'),
      social_links: JSON.parse(formData.get('social_links'))
    };
    
    try {
      await updateContact(contact);
      form.reset();
      displaySuccess("Contact information updated successfully!");
      await initializeContact();
    } catch (error) {
      displayError("Failed to update contact information");
    }
  });
}

async function updateContact(contact) {
  const response = await fetch('http://localhost:8000/api/contact/1', {  // Assuming we only have one contact entry
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  });
  if (!response.ok) throw new Error('Failed to update contact information');
}

// Load initial data from home page
window.addEventListener('load', () => {
  // Initialize all sections if they don't exist in backend API
  const sections = [
    'certifications',
    'experience',
    'awards',
    'education',
    'publications',
    'blog',
    'profile',
    'projects',
    'extracurricular',
    'contact'
  ];

  sections.forEach(section => {
    admin.manager.initSection(section);
  });

  // Load all sections
  admin.manager.sections.forEach(section => {
    admin.loadSectionData(section);
  });
});

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding panel
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

// Load and display items for each section
function loadItems(section) {
  const container = document.querySelector(`.${section}-list`);
  if (!container) return;

  // Get items from backend API
  admin.manager.getAll(section).then(items => {
    // Sort items by date (newest first)
    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Clear container
    container.innerHTML = '';

    // Create item cards
    items.forEach((item, index) => {
      const itemCard = document.createElement('div');
      itemCard.className = 'item-card';
      
      // Set different content based on section
      let content = '';
      switch(section) {
        case 'blog':
          content = `
            <h3>${item.title}</h3>
            <p class="item-date">${new Date(item.date).toLocaleDateString()}</p>
            <p class="item-category">Category: ${item.category}</p>
            <p class="item-tags">Tags: ${item.tags}</p>
            <p class="item-author">Author: ${item.author}</p>
            <p class="item-reading-time">Reading Time: ${item.readingTime} minutes</p>
          `;
          break;
        case 'certifications':
          content = `
            <h3>${item.title}</h3>
            <p>${item.institution}</p>
            <p class="item-date">${new Date(item.date).toLocaleDateString()}</p>
          `;
          break;
        case 'experience':
          content = `
            <h3>${item.title}</h3>
            <p>${item.company}</p>
            <p class="item-date">${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}</p>
          `;
          break;
        case 'awards':
          content = `
            <h3>${item.title}</h3>
            <p>${item.institution}</p>
            <p class="item-date">${new Date(item.date).toLocaleDateString()}</p>
          `;
          break;
        case 'education':
          content = `
            <h3>${item.degree}</h3>
            <p>${item.institution}</p>
            <p class="item-date">${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}</p>
          `;
          break;
        case 'publications':
          content = `
            <h3>${item.title}</h3>
            <p>${item.journal}</p>
            <p class="item-date">${new Date(item.date).toLocaleDateString()}</p>
          `;
          break;
        case 'profile':
          content = `
            <h3>${item.name}</h3>
            <p>${item.title}</p>
            <p>${item.tagline}</p>
            <p>${item.academic_background}</p>
            <p>${item.about_text}</p>
          `;
          break;
        case 'projects':
          content = `
            <h3>${item.title}</h3>
            <p>Status: ${item.status}</p>
            <p>Technologies: ${item.technologies.join(', ')}</p>
          `;
          break;
        case 'extracurricular':
          content = `
            <h3>${item.name}</h3>
            <p>Role: ${item.role}</p>
            <p>Duration: ${item.duration}</p>
          `;
          break;
        case 'contact':
          content = `
            <p>Email: ${item.email}</p>
            <p>Phone: ${item.phone}</p>
            <p>Location: ${item.location}</p>
            <p>Social Links: ${JSON.stringify(item.social_links)}</p>
          `;
          break;
      }

      itemCard.innerHTML = `
        <div class="item-content">${content}</div>
        <div class="item-actions">
          <button class="edit-btn" onclick="editItem('${section}', ${index})">Edit</button>
          <button class="delete-btn" onclick="deleteItem('${section}', ${index})">Delete</button>
        </div>
      `;
      
      container.appendChild(itemCard);
    });
  });
}

// Delete functionality
function deleteItem(section, index) {
  if (confirm('Are you sure you want to delete this item?')) {
    admin.manager.delete(section, index).then(() => {
      loadItems(section);
    });
  }
}

// Edit functionality
function editItem(section, index) {
  admin.manager.getAll(section).then(items => {
    const item = items[index];

    // Create form based on section
    let formContent = '';
    switch(section) {
      case 'blog':
        formContent = `
          <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${item.title}" required>
          </div>
          <div class="form-group">
            <label>Category</label>
            <select name="category" required>
              <option value="">Select category</option>
              <option value="research" ${item.category === 'research' ? 'selected' : ''}>Research Updates</option>
              <option value="technology" ${item.category === 'technology' ? 'selected' : ''}>Technology</option>
              <option value="fieldwork" ${item.category === 'fieldwork' ? 'selected' : ''}>Fieldwork</option>
              <option value="data-science" ${item.category === 'data-science' ? 'selected' : ''}>Data Science</option>
              <option value="conservation" ${item.category === 'conservation' ? 'selected' : ''}>Conservation</option>
              <option value="diy" ${item.category === 'diy' ? 'selected' : ''}>DIY Science</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tags</label>
            <input type="text" name="tags" value="${item.tags}" required>
          </div>
          <div class="form-group">
            <label>Featured Image URL</label>
            <input type="url" name="featured-image" value="${item.featuredImage}" required>
          </div>
          <div class="form-group">
            <label>Lead Paragraph</label>
            <textarea name="lead" rows="3" required>${item.lead}</textarea>
          </div>
          <div class="form-group">
            <label>Main Content</label>
            <div id="editor-container">
              <div id="editor"></div>
            </div>
          </div>
          <div class="form-group">
            <label>Author</label>
            <input type="text" name="author" value="${item.author}" required>
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" name="date" value="${item.date}" required>
          </div>
          <div class="form-group">
            <label>Reading Time (minutes)</label>
            <input type="number" name="reading-time" value="${item.readingTime}" required min="1">
          </div>
        `;
        break;
      case 'certifications':
        formContent = `
          <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${item.title}" required>
          </div>
          <div class="form-group">
            <label>Institution</label>
            <input type="text" name="institution" value="${item.institution}" required>
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" name="date" value="${item.date}" required>
          </div>
        `;
        break;
      case 'experience':
        formContent = `
          <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${item.title}" required>
          </div>
          <div class="form-group">
            <label>Company</label>
            <input type="text" name="company" value="${item.company}" required>
          </div>
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value="${item.startDate}" required>
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" value="${item.endDate}" required>
          </div>
        `;
        break;
      case 'awards':
        formContent = `
          <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${item.title}" required>
          </div>
          <div class="form-group">
            <label>Institution</label>
            <input type="text" name="institution" value="${item.institution}" required>
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" name="date" value="${item.date}" required>
          </div>
        `;
        break;
      case 'education':
        formContent = `
          <div class="form-group">
            <label>Degree</label>
            <input type="text" name="degree" value="${item.degree}" required>
          </div>
          <div class="form-group">
            <label>Institution</label>
            <input type="text" name="institution" value="${item.institution}" required>
          </div>
          <div class="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value="${item.startDate}" required>
          </div>
          <div class="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" value="${item.endDate}" required>
          </div>
        `;
        break;
      case 'publications':
        formContent = `
          <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${item.title}" required>
          </div>
          <div class="form-group">
            <label>Journal</label>
            <input type="text" name="journal" value="${item.journal}" required>
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" name="date" value="${item.date}" required>
          </div>
        `;
        break;
      case 'profile':
        formContent = `
          <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" value="${item.name}" required>
          </div>
          <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${item.title}" required>
          </div>
          <div class="form-group">
            <label>Tagline</label>
            <input type="text" name="tagline" value="${item.tagline}" required>
          </div>
          <div class="form-group">
            <label>Academic Background</label>
            <textarea name="academic_background" rows="3" required>${item.academic_background}</textarea>
          </div>
          <div class="form-group">
            <label>About Text</label>
            <textarea name="about_text" rows="3" required>${item.about_text}</textarea>
          </div>
        `;
        break;
      case 'projects':
        formContent = `
          <div class="form-group">
            <label>Title</label>
            <input type="text" name="title" value="${item.title}" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" required>${item.description}</textarea>
          </div>
          <div class="form-group">
            <label>Technologies</label>
            <input type="text" name="technologies" value="${item.technologies.join(', ')}" required>
          </div>
          <div class="form-group">
            <label>Duration</label>
            <input type="text" name="duration" value="${item.duration}" required>
          </div>
          <div class="form-group">
            <label>Status</label>
            <input type="text" name="status" value="${item.status}" required>
          </div>
        `;
        break;
      case 'extracurricular':
        formContent = `
          <div class="form-group">
            <label>Name</label>
            <input type="text" name="name" value="${item.name}" required>
          </div>
          <div class="form-group">
            <label>Role</label>
            <input type="text" name="role" value="${item.role}" required>
          </div>
          <div class="form-group">
            <label>Duration</label>
            <input type="text" name="duration" value="${item.duration}" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea name="description" rows="3" required>${item.description}</textarea>
          </div>
        `;
        break;
      case 'contact':
        formContent = `
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" value="${item.email}" required>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value="${item.phone}" required>
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" name="location" value="${item.location}" required>
          </div>
          <div class="form-group">
            <label>Social Links</label>
            <input type="text" name="social_links" value="${JSON.stringify(item.social_links)}" required>
          </div>
        `;
        break;
    }

    // Create form
    const form = document.createElement('div');
    form.className = 'edit-item-form';
    form.innerHTML = `
      <h3>Edit ${section.charAt(0).toUpperCase() + section.slice(1)}</h3>
      <form id="${section}-edit-form">
        ${formContent}
        <div class="form-actions">
          <button type="submit" class="btn primary-btn">Save Changes</button>
          <button type="button" class="btn secondary-btn" onclick="closeForm(this)">Cancel</button>
        </div>
      </form>
    `;

    // Add event listener before appending to DOM
    form.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      saveEditedItem(section, form);
    });

    document.querySelector(`#${section}`).appendChild(form);

    // Initialize Quill editor for blog content
    if (section === 'blog') {
      const editorContainer = form.querySelector('#editor-container');
      const editor = new Quill(editorContainer.querySelector('#editor'), {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        }
      });
      
      // Set the editor content
      editor.root.innerHTML = item.content;
    }
  });
}

// Save edited item functionality
function saveEditedItem(section, form) {
  const formData = new FormData(form);
  const index = parseInt(formData.get('index'));
  const items = admin.manager.getAll(section);

  // Update the item
  for (const [key, value] of formData.entries()) {
    if (key !== 'index') {
      items.then(data => {
        data[index][key] = value;
        admin.manager.update(section, data[index].id, data[index]);
      });
    }
  }

  // If it's a blog post, save the Quill editor content
  if (section === 'blog') {
    const editor = form.querySelector('#editor');
    const quillEditor = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions
      }
    });
    items.then(data => {
      data[index].content = quillEditor.root.innerHTML;
      admin.manager.update(section, data[index].id, data[index]);
    });
  }

  // Reload the section
  admin.loadSectionData(section);

  // Close the form
  closeForm(form.querySelector('.secondary-btn'));
}

// Add new item functionality
function showAddItemForm(section) {
  // Create form based on section
  let formContent = '';
  switch(section) {
    case 'blog':
      formContent = `
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="title" required>
        </div>
        <div class="form-group">
          <label>Category</label>
          <select name="category" required>
            <option value="">Select category</option>
            <option value="research">Research Updates</option>
            <option value="technology">Technology</option>
            <option value="fieldwork">Fieldwork</option>
            <option value="data-science">Data Science</option>
            <option value="conservation">Conservation</option>
            <option value="diy">DIY Science</option>
          </select>
        </div>
        <div class="form-group">
          <label>Tags</label>
          <input type="text" name="tags" required>
        </div>
        <div class="form-group">
          <label>Featured Image URL</label>
          <input type="url" name="featured-image" required>
        </div>
        <div class="form-group">
          <label>Lead Paragraph</label>
          <textarea name="lead" rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label>Main Content</label>
          <div id="editor-container">
            <div id="editor"></div>
          </div>
        </div>
        <div class="form-group">
          <label>Author</label>
          <input type="text" name="author" required>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" name="date" required>
        </div>
        <div class="form-group">
          <label>Reading Time (minutes)</label>
          <input type="number" name="reading-time" required min="1">
        </div>
      `;
      break;
    case 'certifications':
      formContent = `
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="title" required>
        </div>
        <div class="form-group">
          <label>Institution</label>
          <input type="text" name="institution" required>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" name="date" required>
        </div>
      `;
      break;
    case 'experience':
      formContent = `
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="title" required>
        </div>
        <div class="form-group">
          <label>Company</label>
          <input type="text" name="company" required>
        </div>
        <div class="form-group">
          <label>Start Date</label>
          <input type="date" name="startDate" required>
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="date" name="endDate" required>
        </div>
      `;
      break;
    case 'awards':
      formContent = `
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="title" required>
        </div>
        <div class="form-group">
          <label>Institution</label>
          <input type="text" name="institution" required>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" name="date" required>
        </div>
      `;
      break;
    case 'education':
      formContent = `
        <div class="form-group">
          <label>Degree</label>
          <input type="text" name="degree" required>
        </div>
        <div class="form-group">
          <label>Institution</label>
          <input type="text" name="institution" required>
        </div>
        <div class="form-group">
          <label>Start Date</label>
          <input type="date" name="startDate" required>
        </div>
        <div class="form-group">
          <label>End Date</label>
          <input type="date" name="endDate" required>
        </div>
      `;
      break;
    case 'publications':
      formContent = `
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="title" required>
        </div>
        <div class="form-group">
          <label>Journal</label>
          <input type="text" name="journal" required>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input type="date" name="date" required>
        </div>
      `;
      break;
    case 'profile':
      formContent = `
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="title" required>
        </div>
        <div class="form-group">
          <label>Tagline</label>
          <input type="text" name="tagline" required>
        </div>
        <div class="form-group">
          <label>Academic Background</label>
          <textarea name="academic_background" rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label>About Text</label>
          <textarea name="about_text" rows="3" required></textarea>
        </div>
      `;
      break;
    case 'projects':
      formContent = `
        <div class="form-group">
          <label>Title</label>
          <input type="text" name="title" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea name="description" rows="3" required></textarea>
        </div>
        <div class="form-group">
          <label>Technologies</label>
          <input type="text" name="technologies" required>
        </div>
        <div class="form-group">
          <label>Duration</label>
          <input type="text" name="duration" required>
        </div>
        <div class="form-group">
          <label>Status</label>
          <input type="text" name="status" required>
        </div>
      `;
      break;
    case 'extracurricular':
      formContent = `
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Role</label>
          <input type="text" name="role" required>
        </div>
        <div class="form-group">
          <label>Duration</label>
          <input type="text" name="duration" required>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea name="description" rows="3" required></textarea>
        </div>
      `;
      break;
    case 'contact':
      formContent = `
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" required>
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="text" name="phone" required>
        </div>
        <div class="form-group">
          <label>Location</label>
          <input type="text" name="location" required>
        </div>
        <div class="form-group">
          <label>Social Links</label>
          <input type="text" name="social_links" required>
        </div>
      `;
      break;
  }

  // Create form
  const form = document.createElement('div');
  form.className = 'add-item-form';
  form.innerHTML = `
    <h3>Add New ${section.charAt(0).toUpperCase() + section.slice(1)}</h3>
    <form id="${section}-form">
      ${formContent}
      <div class="form-actions">
        <button type="submit" class="btn primary-btn">Save</button>
        <button type="button" class="btn secondary-btn" onclick="closeForm(this)">Cancel</button>
      </div>
    </form>
  `;

  document.querySelector(`#${section}`).appendChild(form);

  // Initialize Quill editor for blog posts
  if (section === 'blog') {
    const quill = new Quill('#editor', {
      theme: 'snow'
    });
    
    // Add Quill instance to form data
    form.querySelector('form').quill = quill;
  }

  form.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    saveItem(section, form);
  });
}

function saveItem(section, form) {
  const formData = new FormData(form);
  const item = {};
  
  // Convert form data to object
  for (const [key, value] of formData.entries()) {
    item[key] = value;
  }

  // If this is a blog post, get content from Quill editor
  if (section === 'blog' && form.querySelector('form').quill) {
    item.content = form.querySelector('form').quill.root.innerHTML;
  }
  
  // Save to backend API
  admin.manager.add(section, item).then(() => {
    // Reload the section
    admin.loadSectionData(section);
    // Close the form
    closeForm(form.querySelector('.secondary-btn'));
  });
}

function closeForm(button) {
  button.closest('.add-item-form').remove();
  button.closest('.edit-item-form').remove();
}

// Add click handlers for add buttons
document.getElementById('add-certification').addEventListener('click', () => showAddItemForm('certifications'));
document.getElementById('add-experience').addEventListener('click', () => showAddItemForm('experience'));
document.getElementById('add-award').addEventListener('click', () => showAddItemForm('awards'));
document.getElementById('add-education').addEventListener('click', () => showAddItemForm('education'));
document.getElementById('add-publication').addEventListener('click', () => showAddItemForm('publications'));
document.getElementById('add-blog').addEventListener('click', () => showAddItemForm('blog'));
document.getElementById('add-profile').addEventListener('click', () => showAddItemForm('profile'));
document.getElementById('add-project').addEventListener('click', () => showAddItemForm('projects'));
document.getElementById('add-extracurricular').addEventListener('click', () => showAddItemForm('extracurricular'));
document.getElementById('add-contact').addEventListener('click', () => showAddItemForm('contact'));

// Form submission handling
document.getElementById('blog-post-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
    featuredImage: document.getElementById('featured-image').value,
    lead: document.getElementById('lead').value,
    content: quill.root.innerHTML,
    author: document.getElementById('author').value,
    date: document.getElementById('date').value,
    readingTime: parseInt(document.getElementById('reading-time').value)
  };

  try {
    // Create a new blog post file
    const postSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const postDate = new Date(formData.date);
    const postYear = postDate.getFullYear();
    const postMonth = String(postDate.getMonth() + 1).padStart(2, '0');
    const postDay = String(postDate.getDate()).padStart(2, '0');
    
    const postFileName = `${postYear}-${postMonth}-${postDay}-${postSlug}.html`;
    const postPath = `blog-posts/${postFileName}`;

    // Create the blog post content
    const postContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${formData.title} - Adhith M K</title>
      <meta name="description" content="${formData.lead}">
      <meta property="og:title" content="${formData.title}">
      <meta property="og:description" content="${formData.lead}">
      <meta property="og:image" content="${formData.featuredImage}">
      
      <!-- Stylesheets -->
      <link rel="stylesheet" href="../css/styles.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Nunito:wght@300;400;600&display=swap" rel="stylesheet">
      
      <!-- Scripts -->
      <script src="../js/animations.js" defer></script>
      <script src="../js/scripts.js" defer></script>
    </head>
    <body>
      <!-- Navigation -->
      <nav class="navbar">
        <div class="navbar-container">
          <a href="../index.html" class="navbar-logo">AMK</a>
          <div class="navbar-toggle" id="mobile-menu">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
          <ul class="navbar-menu">
            <li class="navbar-item">
              <a href="../index.html" class="navbar-link">Home</a>
            </li>
            <li class="navbar-item">
              <a href="../index.html#about" class="navbar-link">About</a>
            </li>
            <li class="navbar-item">
              <a href="../index.html#research" class="navbar-link">Research</a>
            </li>
            <li class="navbar-item">
              <a href="../index.html#publications" class="navbar-link">Publications</a>
            </li>
            <li class="navbar-item">
              <a href="../trends.html" class="navbar-link">Trends</a>
            </li>
            <li class="navbar-item">
              <a href="../blog.html" class="navbar-link">Blog</a>
            </li>
            <li class="navbar-item">
              <a href="../admin.html" class="navbar-link">Admin</a>
            </li>
            <li class="navbar-item">
              <a href="../index.html#contact" class="navbar-link">Contact</a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <div class="container">
          <div class="page-header">
            <h1 class="page-title">${formData.title}</h1>
            <div class="post-meta">
              <span class="post-date">${postDate.toLocaleDateString()}</span>
              <span class="reading-time">${formData.readingTime} min read</span>
            </div>
          </div>

          <div class="blog-post-container">
            <div class="blog-post-image" style="background-image: url('${formData.featuredImage}')"></div>
            
            <div class="blog-post-content">
              <p class="lead-paragraph">${formData.lead}</p>
              ${formData.content}
            </div>

            <div class="blog-post-footer">
              <div class="post-categories">
                <span class="category-label">Categories:</span>
                <a href="#" class="category-link">${formData.category}</a>
              </div>
              
              <div class="post-tags">
                <span class="tag-label">Tags:</span>
                ${formData.tags.map(tag => `<a href="#" class="tag-link">${tag}</a>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-content">
            <div class="footer-section">
              <h3 class="footer-title">Adhith M K</h3>
              <p class="footer-description">Ecological Informatics Student & Researcher</p>
              <p class="footer-location"><i class="fas fa-map-marker-alt"></i> Kerala, India</p>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">Quick Links</h3>
              <ul class="footer-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../index.html#about">About</a></li>
                <li><a href="../index.html#research">Research</a></li>
                <li><a href="../index.html#publications">Publications</a></li>
                <li><a href="../trends.html">Trends</a></li>
                <li><a href="../blog.html">Blog</a></li>
                <li><a href="../index.html#contact">Contact</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h3 class="footer-title">Connect</h3>
              <div class="footer-social">
                <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-github"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-researchgate"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-orcid"></i></a>
              </div>
              <p class="footer-email"><i class="fas fa-envelope"></i> adhith@example.com</p>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p class="copyright">&copy; 2025 Adhith M K. All rights reserved.</p>
            <p class="credits">Designed with <i class="fas fa-heart"></i> and ecological mindfulness</p>
          </div>
        </div>
      </footer>
    </body>
    </html>
    `;

    // Create the blog post file
    try {
      await fetch(postPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/html'
        },
        body: postContent
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      showNotification('Error creating blog post. Please try again.', 'error');
      return;
    }

    // Update the blog index
    try {
      await updateBlogIndex(formData);
    } catch (error) {
      console.error('Error updating blog index:', error);
      showNotification('Error updating blog index. Please try again.', 'error');
      return;
    }

    // Show success message
    showNotification('Blog post created successfully!', 'success');

    // Reset form
    document.getElementById('blog-post-form').reset();
    quill.root.innerHTML = '';
  } catch (error) {
    console.error('Error creating blog post:', error);
    showNotification('Error creating blog post. Please try again.', 'error');
  }
});

// Preview button handling
document.getElementById('preview-btn').addEventListener('click', () => {
  const previewContent = `
    <div class="blog-post-preview">
      <h2>Preview</h2>
      <div class="preview-content">
        ${quill.root.innerHTML}
      </div>
    </div>
  `;

  const previewModal = document.createElement('div');
  previewModal.className = 'preview-modal';
  previewModal.innerHTML = previewContent;
  document.body.appendChild(previewModal);

  const closePreview = () => {
    previewModal.remove();
  };

  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      closePreview();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePreview();
    }
  });
});

// Notification function
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Update blog index function
async function updateBlogIndex(postData) {
  const blogIndex = await fetch('blog.html').then(response => response.text());
  const parser = new DOMParser();
  const doc = parser.parseFromString(blogIndex, 'text/html');

  // Find the blog posts container
  const postsContainer = doc.querySelector('.blog-posts');
  if (!postsContainer) return;

  // Create new blog post element
  const newPost = document.createElement('article');
  newPost.className = 'blog-post';
  newPost.innerHTML = `
    <div class="blog-post-image" style="background-image: url('${postData.featuredImage}')"></div>
    <div class="blog-post-content">
      <h3 class="blog-post-title">${postData.title}</h3>
      <p class="blog-post-meta">
        <span class="post-date">${new Date(postData.date).toLocaleDateString()}</span>
        <span class="reading-time">${postData.readingTime} min read</span>
      </p>
      <p class="blog-post-excerpt">${postData.lead}</p>
      <a href="blog-posts/${postSlug}.html" class="read-more">Read More</a>
    </div>
  `;

  // Add new post to the beginning of the container
  postsContainer.insertBefore(newPost, postsContainer.firstChild);

  // Update the blog index file
  await fetch('blog.html', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/html'
    },
    body: doc.documentElement.outerHTML
  });
}
