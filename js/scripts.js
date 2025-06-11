// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

document.addEventListener('DOMContentLoaded', () => {
  // Add a small delay before scrolling to ensure content is loaded
  setTimeout(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, 100);

  // Navigation
  const navLinks = document.querySelectorAll('.navbar a');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbarMenu = document.querySelector('.nav-links');

  // Handle navigation clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Close mobile menu if open
      if (navbarMenu.classList.contains('active')) {
        navbarMenu.classList.remove('active');
      }

      // Get the href attribute
      const href = link.getAttribute('href');
      
      // For in-page links (contains #), prevent default and scroll smoothly
      if (href.includes('#')) {
        e.preventDefault();
        const targetId = href.split('#')[1]; // Get the section ID after #
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 100, // Subtract header height
            behavior: 'smooth'
          });
        }
      }
      // For external page links, let browser handle it
      else if (href.includes('.html')) {
        return;
      }
    });
  });

  // Mobile menu toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navbarMenu.classList.toggle('active');
    });
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbarMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navbarMenu.classList.remove('active');
    }
  });

  // Close mobile menu when clicking a link
  navbarMenu.addEventListener('click', () => {
    navbarMenu.classList.remove('active');
  });

  // Create a trends chart with Chart.js
  const trendsChart = document.getElementById('trends-chart');
  
  if (trendsChart) {
    const ctx = document.createElement('canvas');
    trendsChart.appendChild(ctx);
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
        datasets: [
          {
            label: 'Ecological AI',
            data: [10, 25, 45, 70, 90, 120],
            borderColor: '#00ffcc',
            backgroundColor: 'rgba(0, 255, 204, 0.1)',
            tension: 0.4
          },
          {
            label: 'Bioacoustics',
            data: [30, 40, 55, 80, 95, 110],
            borderColor: '#00ccff',
            backgroundColor: 'rgba(0, 204, 255, 0.1)',
            tension: 0.4
          },
          {
            label: 'Remote Sensing',
            data: [50, 65, 75, 85, 100, 115],
            borderColor: '#ff66cc',
            backgroundColor: 'rgba(255, 102, 204, 0.1)',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e0e0e0',
              font: {
                family: "'Nunito', sans-serif",
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 16, 35, 0.8)',
            titleColor: '#00ffcc',
            bodyColor: '#e0e0e0',
            borderColor: '#00ffcc',
            borderWidth: 1,
            padding: 10,
            titleFont: {
              family: "'Nunito', sans-serif",
              size: 14
            },
            bodyFont: {
              family: "'Nunito', sans-serif",
              size: 12
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#e0e0e0'
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#e0e0e0'
            }
          }
        }
      }
    });
  }

  // Load Awards
  function loadAwards() {
    const awardsGrid = document.getElementById('awards-grid');
    if (!awardsGrid) return;

    // Get awards from localStorage
    const awards = JSON.parse(localStorage.getItem('awards') || '[]');

    // Sort awards by date (newest first)
    awards.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create award cards
    awardsGrid.innerHTML = awards.map(award => `
      <div class="award-card">
        <div class="award-icon">
          <i class="fas fa-award"></i>
        </div>
        <h3 class="award-title">${award.title}</h3>
        <p class="award-institution">${award.institution}</p>
        <p class="award-description">${award.description}</p>
        <p class="award-date">${new Date(award.date).toLocaleDateString()}</p>
      </div>
    `).join('');

    // Add animations
    const awardCards = document.querySelectorAll('.award-card');
    awardCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 200 * index);
    });
  }

  loadAwards();

  // Enhanced education card hover animations
  const educationCards = document.querySelectorAll('.education-card');
  educationCards.forEach(card => {
    const icon = card.querySelector('.skill-icon');
    
    if (icon) {
      // Mouse enter effect
      card.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          rotate: 10,
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      // Mouse leave effect
      card.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          rotate: 0,
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
  });

  // Enhanced skill icon hover animations
  const skillIcons = document.querySelectorAll('.skill-icon');
  
  skillIcons.forEach(icon => {
    const iconElement = icon.querySelector('i');
    
    // Mouse enter effect
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        y: -5,
        rotate: 10,
        scale: 1.05,
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      if (iconElement) {
        gsap.to(iconElement, {
          scale: 1.2,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    
    // Mouse leave effect
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        y: 0,
        rotate: 0,
        scale: 1,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      if (iconElement) {
        gsap.to(iconElement, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
  });

  // Add animation to skills bars
  const skillItems = document.querySelectorAll('.skill-item');
  
  const animateSkills = () => {
    skillItems.forEach(item => {
      const dataSkill = item.getAttribute('data-skill');
      const percentage = item.querySelector('span').textContent;
      
      // Reset the width to 0
      item.style.setProperty('--skill-width', '0%');
      
      // Set a timeout to animate to the actual percentage
      setTimeout(() => {
        item.style.setProperty('--skill-width', percentage);
      }, 100);
    });
  };
  
  // Call animation when skills section is in view
  const aboutSection = document.getElementById('about');
  
  if (aboutSection) {
    const options = {
      threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkills();
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    observer.observe(aboutSection);
  }

  // Remove any cursor elements that might have been created
  const cursorElements = document.querySelectorAll('.custom-cursor, .custom-cursor-follower');
  cursorElements.forEach(el => {
    el.remove();
  });

  // Add interactive-element class to all interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .blog-card, .certification-card, .trend-card');
  
  interactiveElements.forEach(el => {
    el.classList.add('interactive-element');
  });
  
  // Add data-tooltip attributes to social icons
  const socialLinks = document.querySelectorAll('.social-links a, .footer-social a');
  
  socialLinks.forEach(link => {
    const icon = link.querySelector('i');
    if (icon) {
      const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
      if (iconClass) {
        const tooltip = iconClass.replace('fa-', '');
        link.setAttribute('data-tooltip', tooltip.charAt(0).toUpperCase() + tooltip.slice(1));
      }
    }
  });
  
  // Add hover-zoom class to images in cards
  const cardImages = document.querySelectorAll('.project-card img, .blog-card img, .certification-card img');
  
  cardImages.forEach(img => {
    const parent = img.parentElement;
    parent.classList.add('hover-zoom');
  });

  // Add animations to activity cards
  function animateActivityCards() {
    const activityCards = document.querySelectorAll('.activity-card');
    if (!activityCards) return;

    activityCards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 200 * index);
    });
  }

  animateActivityCards();

  // Edit Popup Functions
  function openEditPopup(formId) {
    const popup = document.getElementById(formId);
    if (popup) {
      popup.classList.add('active');
    }
  }

  function closeEditPopup() {
    const popups = document.querySelectorAll('.edit-popup');
    popups.forEach(popup => {
      popup.classList.remove('active');
    });
  }

  // Add event listeners for closing popups
  function initializeEditPopupListeners() {
    const popups = document.querySelectorAll('.edit-popup');
    popups.forEach(popup => {
      // Close when clicking outside the popup
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          closeEditPopup();
        }
      });

      // Close when pressing escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
          closeEditPopup();
        }
      });
    });

    // Close when clicking cancel button
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    cancelButtons.forEach(btn => {
      btn.addEventListener('click', closeEditPopup);
    });
  }

  // Content Management System
  function ContentManager() {
    // Initialize all sections
    this.initialize = async () => {
      await this.initializeProfile();
      await this.initializeResearch();
      await this.initializeCertifications();
      await this.initializeFieldExperiences();
      await this.initializeBlog();
      
      // Initialize edit popup listeners after content is loaded
      initializeEditPopupListeners();
    };

    // Profile Management
    this.initializeProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/profile`);
        const profile = await response.json();
        
        // Update profile information
        document.querySelector('.hero-content h1').textContent = profile.name;
        document.querySelector('.tagline').textContent = profile.tagline;
        document.querySelector('.subtitle').textContent = profile.title;
        
        // Update skills
        const skillsContainer = document.querySelector('.skills-container');
        skillsContainer.innerHTML = profile.skills.map(skill => 
          `<div class="skill-item" data-skill="${skill.name}">${skill.name} <span>${skill.level}%</span></div>`
        ).join('');
        
        // Update research interests
        const interestsContainer = document.querySelector('.interests-list');
        interestsContainer.innerHTML = profile.research_interests.map(interest => 
          `<li>${interest.name}</li>`
        ).join('');
        
        // Initialize profile edit
        this.initializeProfileEdit();
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    // Initialize Edit Functions
    this.initializeProfileEdit = () => {
      const editBtn = document.querySelector('.profile-edit');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openEditPopup('profileEditForm');
        });
      }
    };

    this.initializeResearchEdit = () => {
      const editBtn = document.querySelector('.research-edit');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openEditPopup('researchEditForm');
        });
      }
    };

    this.initializeCertificationsEdit = () => {
      const editBtn = document.querySelector('.certifications-edit');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openEditPopup('certificationsEditForm');
        });
      }
    };

    this.initializeFieldExperiencesEdit = () => {
      const editBtn = document.querySelector('.field-experiences-edit');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openEditPopup('fieldExperiencesEditForm');
        });
      }
    };

    this.initializeBlogEdit = () => {
      const editBtn = document.querySelector('.blog-edit');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openEditPopup('blogEditForm');
        });
      }
    };

    // Form Submission Handlers
    this.handleProfileForm = async (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });
        
        if (response.ok) {
          await this.initializeProfile();
          closeEditPopup();
          alert('Profile updated successfully!');
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
      }
    };

    this.handleResearchForm = async (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      try {
        const response = await fetch(`${API_BASE_URL}/research/projects`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });
        
        if (response.ok) {
          await this.initializeResearch();
          closeEditPopup();
          alert('Research project added successfully!');
        } else {
          throw new Error('Failed to add research project');
        }
      } catch (error) {
        console.error('Error adding research project:', error);
        alert('Error adding research project. Please try again.');
      }
    };

    this.handleCertificationsForm = async (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      try {
        const response = await fetch(`${API_BASE_URL}/certifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });
        
        if (response.ok) {
          await this.initializeCertifications();
          closeEditPopup();
          alert('Certification added successfully!');
        } else {
          throw new Error('Failed to add certification');
        }
      } catch (error) {
        console.error('Error adding certification:', error);
        alert('Error adding certification. Please try again.');
      }
    };

    this.handleFieldExperiencesForm = async (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      try {
        const response = await fetch(`${API_BASE_URL}/field-experiences`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });
        
        if (response.ok) {
          await this.initializeFieldExperiences();
          closeEditPopup();
          alert('Field experience added successfully!');
        } else {
          throw new Error('Failed to add field experience');
        }
      } catch (error) {
        console.error('Error adding field experience:', error);
        alert('Error adding field experience. Please try again.');
      }
    };

    this.handleBlogForm = async (event) => {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      try {
        const response = await fetch(`${API_BASE_URL}/blog`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData))
        });
        
        if (response.ok) {
          await this.initializeBlog();
          closeEditPopup();
          alert('Blog post added successfully!');
        } else {
          throw new Error('Failed to add blog post');
        }
      } catch (error) {
        console.error('Error adding blog post:', error);
        alert('Error adding blog post. Please try again.');
      }
    };

    // Add form submission listeners
    this.addFormListeners = () => {
      const profileForm = document.getElementById('profileForm');
      if (profileForm) {
        profileForm.addEventListener('submit', this.handleProfileForm.bind(this));
      }

      const researchForm = document.getElementById('researchForm');
      if (researchForm) {
        researchForm.addEventListener('submit', this.handleResearchForm.bind(this));
      }

      // Add listeners for other forms
      const certificationsForm = document.getElementById('certificationsForm');
      if (certificationsForm) {
        certificationsForm.addEventListener('submit', this.handleCertificationsForm.bind(this));
      }

      const fieldExperiencesForm = document.getElementById('fieldExperiencesForm');
      if (fieldExperiencesForm) {
        fieldExperiencesForm.addEventListener('submit', this.handleFieldExperiencesForm.bind(this));
      }

      const blogForm = document.getElementById('blogForm');
      if (blogForm) {
        blogForm.addEventListener('submit', this.handleBlogForm.bind(this));
      }
    };
  }

  // Initialize content management
  document.addEventListener('DOMContentLoaded', async () => {
    const contentManager = new ContentManager();
    await contentManager.initialize();
    contentManager.addFormListeners();
  });

  // Blog Post Management System
  function BlogPostManager() {
    // Load post from API
    this.loadPost = async (postId) => {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/${postId}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }
        return await response.json();
      } catch (error) {
        console.error('Error loading post:', error);
        return null;
      }
    };

    // Update post via API
    this.updatePost = async (postId, updatedPost) => {
      try {
        const response = await fetch(`${API_BASE_URL}/blog/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPost),
        });

        if (!response.ok) {
          throw new Error('Failed to update post');
        }

        return await response.json();
      } catch (error) {
        console.error('Error updating post:', error);
        throw error;
      }
    };
  }

  // Blog Post Edit Functionality
  function initializeBlogEdit() {
    console.log('Initializing blog edit functionality');
    
    // Initialize blog post manager
    const blogManager = new BlogPostManager();
    
    // Get elements
    const editBtn = document.getElementById('editBtn');
    const editPopup = document.getElementById('editPopup');
    const editForm = document.getElementById('editForm');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const categoryInput = document.getElementById('category');
    const tagsInput = document.getElementById('tags');

    if (!editBtn || !editPopup || !editForm) {
      console.error('Required elements not found for blog edit functionality');
      return;
    }

    // Get current post content
    const postId = document.querySelector('.post-title').dataset.postId;
    
    // Initialize form with current content
    async function initializeForm() {
      console.log('Initializing form with current content');
      try {
        const post = await blogManager.loadPost(postId);
        if (!post) {
          throw new Error('Post not found');
        }

        titleInput.value = post.title;
        contentInput.value = post.content;
        categoryInput.value = post.category;
        tagsInput.value = post.tags.join(', ');
      } catch (error) {
        console.error('Error initializing form:', error);
        alert('Error loading post data. Please try again.');
      }
    }

    // Open edit popup
    function openEditPopup() {
      console.log('Opening edit popup');
      initializeForm();
      editPopup.classList.add('active');
    }

    // Close edit popup
    function closeEditPopup() {
      console.log('Closing edit popup');
      editPopup.classList.remove('active');
    }

    // Save changes
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      console.log('Saving changes');
      const updatedPost = {
        title: titleInput.value,
        content: contentInput.value,
        category: categoryInput.value,
        tags: tagsInput.value.split(',').map(tag => tag.trim())
      };

      try {
        // Update the post via API
        await blogManager.updatePost(postId, updatedPost);

        // Update the post content
        document.querySelector('.post-title').textContent = updatedPost.title;
        document.querySelector('.post-body').textContent = updatedPost.content;
        document.querySelector('.post-category').textContent = updatedPost.category;
        
        // Update tags
        const tagsContainer = document.querySelector('.post-tags');
        const tagLabel = tagsContainer.querySelector('.tag-label');
        tagsContainer.innerHTML = tagLabel ? tagLabel.outerHTML : '';
        tagsContainer.innerHTML += updatedPost.tags.map(tag => 
          `<span class="tag">${tag}</span>`
        ).join('');

        closeEditPopup();
      } catch (error) {
        console.error('Error saving changes:', error);
        alert('Error saving changes. Please try again.');
      }
    });

    // Add event listeners
    console.log('Adding event listeners');
    editBtn.addEventListener('click', (e) => {
      console.log('Edit button clicked');
      openEditPopup();
    });
  };

  // Update post via API
  this.updatePost = async (postId, updatedPost) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };

// Open edit popup
function openEditPopup() {
  const editPopup = document.getElementById('edit-popup');
  if (editPopup) {
    editPopup.classList.add('active');
  }
}

// Close edit popup
function closeEditPopup() {
  const editPopup = document.getElementById('edit-popup');
  if (editPopup) {
    editPopup.classList.remove('active');
  }
}

// Initialize edit popup listeners
function initializeEditPopupListeners() {
  const editBtn = document.getElementById('editBtn');
  const editPopup = document.getElementById('editPopup');
  const editForm = document.getElementById('editForm');
  const titleInput = document.getElementById('title');
  const contentInput = document.getElementById('content');
  const categoryInput = document.getElementById('category');
  const tagsInput = document.getElementById('tags');

  if (!editBtn || !editPopup || !editForm) {
    console.error('Required elements not found for blog edit functionality');
    return;
  }

  // Get current post content
  const postId = document.querySelector('.post-title').dataset.postId;
  
  // Initialize form with current content
  async function initializeForm() {
    console.log('Initializing form with current content');
    try {
      const post = await blogManager.loadPost(postId);
      if (!post) {
        throw new Error('Post not found');
      }

      titleInput.value = post.title;
      contentInput.value = post.content;
      categoryInput.value = post.category;
      tagsInput.value = post.tags.join(', ');
    } catch (error) {
      console.error('Error initializing form:', error);
      alert('Error loading post data. Please try again.');
    }
  }

  // Open edit popup
  function openEditPopup() {
    console.log('Opening edit popup');
    initializeForm();
    editPopup.classList.add('active');
  }

  // Close edit popup
  function closeEditPopup() {
    console.log('Closing edit popup');
    editPopup.classList.remove('active');
  }

  // Save changes
  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('Saving changes');
    const updatedPost = {
      title: titleInput.value,
      content: contentInput.value,
      category: categoryInput.value,
      tags: tagsInput.value.split(',').map(tag => tag.trim())
    };

    try {
      // Update the post via API
      await blogManager.updatePost(postId, updatedPost);

      // Update the post content
      document.querySelector('.post-title').textContent = updatedPost.title;
      document.querySelector('.post-body').textContent = updatedPost.content;
      document.querySelector('.post-category').textContent = updatedPost.category;
      
      // Update tags
      const tagsContainer = document.querySelector('.post-tags');
      const tagLabel = tagsContainer.querySelector('.tag-label');
      tagsContainer.innerHTML = tagLabel ? tagLabel.outerHTML : '';
      tagsContainer.innerHTML += updatedPost.tags.map(tag => 
        `<span class="tag">${tag}</span>`
      ).join('');

      closeEditPopup();
      
      // Show success message
      alert('Post updated successfully! Changes are permanent.');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    }
  });

  // Add event listeners
  console.log('Adding event listeners');
  editBtn.addEventListener('click', (e) => {
    console.log('Edit button clicked');
    openEditPopup();
  });
  
  // Close popup when clicking outside
  editPopup.addEventListener('click', (e) => {
    if (e.target === editPopup) {
      closeEditPopup();
    }
  });

  // Close popup when pressing escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editPopup.classList.contains('active')) {
      closeEditPopup();
    }
  });

  console.log('Blog edit functionality initialized successfully');
}
