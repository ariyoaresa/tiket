const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Set up Twig as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'tiket-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Authentication middleware
function requireAuth(req, res, next) {
  const token = req.session.token;
  if (!token) {
    return res.redirect('/auth/login');
  }
  next();
}

// Mock user data
const users = [
  { id: 1, email: 'admin@tiket.com', password: 'admin123', name: 'Admin User' },
  { id: 2, email: 'user@tiket.com', password: 'user123', name: 'Regular User' }
];

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Data file path
const ticketsFile = path.join(dataDir, 'tickets.json');

// Initialize tickets data if not exists
if (!fs.existsSync(ticketsFile)) {
  fs.writeFileSync(ticketsFile, JSON.stringify([]));
}

// Helper functions for ticket operations
function getTickets() {
  const data = fs.readFileSync(ticketsFile, 'utf8');
  return JSON.parse(data);
}

function saveTickets(tickets) {
  fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
}

function findTicket(id) {
  const tickets = getTickets();
  return tickets.find(t => t.id === id);
}

// Routes
app.get('/', (req, res) => {
  res.render('landing');
});

// Authentication routes
app.get('/auth/login', (req, res) => {
  res.render('auth/login');
});

app.get('/auth/signup', (req, res) => {
  res.render('auth/signup');
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    req.session.token = `token_${user.id}_${Date.now()}`;
    req.session.user = user;
    res.json({ success: true, redirect: '/dashboard' });
  } else {
    res.json({ success: false, message: 'Invalid email or password' });
  }
});

app.post('/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.json({ success: false, message: 'Email already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  };
  
  users.push(newUser);
  req.session.token = `token_${newUser.id}_${Date.now()}`;
  req.session.user = newUser;
  res.json({ success: true, redirect: '/dashboard' });
});

app.post('/auth/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Dashboard route
app.get('/dashboard', requireAuth, (req, res) => {
  const tickets = getTickets();
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };
  
  res.render('dashboard', { user: req.session.user, stats });
});

app.get('/tickets', requireAuth, (req, res) => {
  const tickets = getTickets();
  res.render('tickets/index', { tickets, user: req.session.user });
});

app.get('/tickets/new', requireAuth, (req, res) => {
  res.render('tickets/new', { user: req.session.user });
});

app.post('/tickets', requireAuth, (req, res) => {
  const { title, description, priority, status } = req.body;
  
  // Enhanced validation
  const errors = [];
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  if (title && title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  if (description && description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  if (status && !['open', 'in_progress', 'closed'].includes(status)) {
    errors.push('Status must be open, in_progress, or closed');
  }
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  if (errors.length > 0) {
    if (req.headers['content-type'] === 'application/json') {
      return res.json({ success: false, errors });
    }
    return res.render('tickets/new', { error: errors.join(', '), user: req.session.user });
  }
  
  const tickets = getTickets();
  const newTicket = {
    id: Date.now().toString(),
    title: title.trim(),
    description: description ? description.trim() : '',
    priority: priority || 'medium',
    status: status || 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: req.session.user.id
  };
  
  tickets.push(newTicket);
  saveTickets(tickets);
  
  if (req.headers['content-type'] === 'application/json') {
    res.json({ success: true, ticket: newTicket });
  } else {
    res.redirect('/tickets');
  }
});

app.get('/tickets/:id/edit', requireAuth, (req, res) => {
  const ticket = findTicket(req.params.id);
  
  if (!ticket) {
    return res.status(404).render('404', { message: 'Ticket not found', user: req.session.user });
  }
  
  res.render('tickets/edit', { ticket, user: req.session.user });
});

app.post('/tickets/:id', requireAuth, (req, res) => {
  const { title, description, priority, status } = req.body;
  const id = req.params.id;
  
  // Enhanced validation
  const errors = [];
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }
  if (title && title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  if (description && description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  if (status && !['open', 'in_progress', 'closed'].includes(status)) {
    errors.push('Status must be open, in_progress, or closed');
  }
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  if (errors.length > 0) {
    const ticket = findTicket(id);
    if (req.headers['content-type'] === 'application/json') {
      return res.json({ success: false, errors });
    }
    return res.render('tickets/edit', { ticket, error: errors.join(', '), user: req.session.user });
  }
  
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => t.id === id);
  
  if (ticketIndex === -1) {
    return res.status(404).render('404', { message: 'Ticket not found', user: req.session.user });
  }
  
  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    title: title.trim(),
    description: description ? description.trim() : '',
    priority: priority || 'medium',
    status: status || 'open',
    updatedAt: new Date().toISOString()
  };
  
  saveTickets(tickets);
  
  if (req.headers['content-type'] === 'application/json') {
    res.json({ success: true, ticket: tickets[ticketIndex] });
  } else {
    res.redirect('/tickets');
  }
});

app.post('/tickets/:id/delete', requireAuth, (req, res) => {
  const id = req.params.id;
  const tickets = getTickets();
  const filteredTickets = tickets.filter(t => t.id !== id);
  
  saveTickets(filteredTickets);
  
  if (req.headers['content-type'] === 'application/json') {
    res.json({ success: true });
  } else {
    res.redirect('/tickets');
  }
});

app.post('/tickets/:id/status', requireAuth, (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  
  if (!['open', 'in_progress', 'closed'].includes(status)) {
    if (req.headers['content-type'] === 'application/json') {
      return res.json({ success: false, message: 'Invalid status' });
    }
    return res.redirect('/tickets');
  }
  
  const tickets = getTickets();
  const ticketIndex = tickets.findIndex(t => t.id === id);
  
  if (ticketIndex !== -1) {
    tickets[ticketIndex].status = status;
    tickets[ticketIndex].updatedAt = new Date().toISOString();
    saveTickets(tickets);
  }
  
  if (req.headers['content-type'] === 'application/json') {
    res.json({ success: true, ticket: tickets[ticketIndex] });
  } else {
    res.redirect('/tickets');
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { message: 'Page not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Tiket app running at http://localhost:${PORT}`);
});